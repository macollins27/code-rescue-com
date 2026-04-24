/**
 * POST /api/book
 *
 * Flow:
 *  1. Parse + validate body (422 on bad input).
 *  2. INSERT into D1 first — the UNIQUE(booking_date, booking_time_minutes)
 *     index is the source of truth for double-booking. On conflict, return
 *     409 without side-effecting Google Calendar or email.
 *  3. Create Google Calendar event w/ Meet link; store event id back on the
 *     row. Calendar failures are non-fatal — the row is still valid.
 *  4. Dispatch admin email via waitUntil so the HTTP response doesn't block.
 */

import type { PagesFunction } from "../lib/types";
import { OPERATOR_TZ, buildDateOptions } from "../lib/time";
import { credsFromEnv, getAccessToken, createCalendarEvent } from "../lib/calendar";
import { insertBooking, updateBookingEventId } from "../lib/db";
import { sendAdminNotificationEmail } from "../lib/email";
import { validateBookingRequest } from "../lib/validation";

const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export const onRequestPost: PagesFunction = async (ctx) => {
  let raw: unknown;
  try {
    raw = await ctx.request.json();
  } catch {
    return json(
      { ok: false, error: "validation", fields: { _: "Invalid JSON body" } },
      { status: 422 }
    );
  }

  // Rebuild the same date window the frontend is operating against so we
  // reject bookings outside it. 14 days upper bound is generous.
  const allowedDates = new Set(buildDateOptions(14, OPERATOR_TZ).map((d) => d.key));
  const parsed = validateBookingRequest(raw, allowedDates);
  if (!parsed.ok) {
    return json({ ok: false, error: "validation", fields: parsed.fields }, { status: 422 });
  }

  const v = parsed.value;
  const bookingId = crypto.randomUUID();

  // 1) Insert. Conflict here is the authoritative "slot taken".
  let insertResult;
  try {
    insertResult = await insertBooking(ctx.env.DB, {
      id: bookingId,
      company: v.company,
      role: v.role,
      teamSize: v.size,
      stack: v.stack,
      deliverable: v.deliv,
      broken: v.broken,
      timeline: v.timeline,
      bookingDate: v.date,
      bookingTimeMinutes: v.timeMinutes,
      timezone: OPERATOR_TZ,
    });
  } catch (err) {
    console.error("insertBooking failed:", err);
    return json({ ok: false, error: "internal" }, { status: 500 });
  }

  if (!insertResult.ok) {
    return json({ ok: false, error: "slot_taken" }, { status: 409 });
  }

  // 2) Google Calendar event. Non-fatal on error.
  let meetLink: string | null = null;
  let htmlLink: string | null = null;
  try {
    const creds = credsFromEnv(ctx.env);
    const token = await getAccessToken(creds);
    const ev = await createCalendarEvent(creds, token, {
      company: v.company,
      role: v.role,
      size: v.size,
      stack: v.stack,
      deliverable: v.deliv,
      broken: v.broken,
      timeline: v.timeline,
      date: v.date,
      timeMinutes: v.timeMinutes,
      timezone: OPERATOR_TZ,
      operatorEmail: ctx.env.NOTIFICATION_EMAIL || "max@code-rescue.com",
      requestId: bookingId,
    });
    meetLink = ev.meetLink;
    htmlLink = ev.htmlLink;
    if (ev.eventId) {
      try {
        await updateBookingEventId(ctx.env.DB, bookingId, ev.eventId);
      } catch (err) {
        console.error("updateBookingEventId failed:", err);
      }
    }
  } catch (err) {
    console.error("createCalendarEvent failed:", err);
  }

  // 3) Admin email via waitUntil — don't block the HTTP response.
  ctx.waitUntil(
    sendAdminNotificationEmail(ctx.env, {
      bookingId,
      company: v.company,
      role: v.role,
      size: v.size,
      stack: v.stack,
      deliverable: v.deliv,
      broken: v.broken,
      timeline: v.timeline,
      date: v.date,
      time: v.time,
      timezone: OPERATOR_TZ,
      meetLink,
      htmlLink,
    }).catch((err: unknown) => {
      console.error("sendAdminNotificationEmail failed:", err);
    })
  );

  return json({ ok: true, bookingId, rescheduleUrl: htmlLink ?? undefined });
};

function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { ...JSON_HEADERS, ...(init.headers ?? {}) },
  });
}
