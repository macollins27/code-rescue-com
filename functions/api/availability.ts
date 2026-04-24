/**
 * GET /api/availability?days=3
 *
 * Returns the next `days` weekdays with per-day morning + afternoon slot
 * arrays. Overlays Google Calendar busy intervals and D1 bookings to
 * determine `taken`. Fails closed (all-taken + 503) if Google Calendar
 * errors, so the UI never shows phantom availability.
 */

import type { PagesFunction } from "../lib/types";
import { OPERATOR_TZ, buildDateOptions } from "../lib/time";
import { credsFromEnv, getAccessToken, getFreeBusy } from "../lib/calendar";
import { getBookedSlotsInRange } from "../lib/db";
import { allTakenGrid, buildSlotGrid } from "../lib/slots";

const JSON_HEADERS: HeadersInit = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

export const onRequestGet: PagesFunction = async (ctx) => {
  const url = new URL(ctx.request.url);
  const daysRaw = url.searchParams.get("days");
  const days = clampDays(daysRaw);

  const dates = buildDateOptions(days, OPERATOR_TZ);
  if (dates.length === 0) {
    return json({ dates: [], slots: {} });
  }

  const startDate = dates[0]?.key ?? "";
  const endDate = dates[dates.length - 1]?.key ?? startDate;

  // D1 lookup is non-fatal — if it fails, we still render with GCal data only.
  let dbBooked = new Set<string>();
  try {
    dbBooked = await getBookedSlotsInRange(ctx.env.DB, startDate, endDate);
  } catch (err) {
    console.error("D1 getBookedSlotsInRange failed:", err);
  }

  // Google Calendar — fail closed on any error.
  try {
    const creds = credsFromEnv(ctx.env);
    const token = await getAccessToken(creds);
    const busy = await getFreeBusy(creds, token, startDate, endDate, OPERATOR_TZ);
    const slots = buildSlotGrid({
      dates,
      tz: OPERATOR_TZ,
      busyIntervals: busy,
      dbBooked,
    });
    return json({ dates, slots });
  } catch (err) {
    console.error("Availability failed (Google Calendar):", err);
    return json({ dates, slots: allTakenGrid(dates) }, { status: 503 });
  }
};

function clampDays(raw: string | null): number {
  if (raw === null) return 3;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return 3;
  if (n < 1) return 1;
  if (n > 14) return 14;
  return n;
}

function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { ...JSON_HEADERS, ...(init.headers ?? {}) },
  });
}
