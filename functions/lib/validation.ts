/**
 * Request-body validation for POST /api/book. Mirrors the shapes declared in
 * src/content/booking.ts. Returns either a sanitized value object or a
 * `fields` dict mapping field-name → human-readable message (the frontend's
 * `setFieldErrors` renders these inline).
 */

import { TEAM_SIZES, TIMELINES, type DeliverableKey } from "../../src/content/booking";
import { ALL_SLOT_TIMES, isWeekday, labelToMinutes } from "./time";

const DELIVERABLE_KEYS: ReadonlyArray<DeliverableKey> = ["domain", "migration", "qa", "unsure"];

export interface ValidatedBooking {
  date: string;
  time: string;
  timeMinutes: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  size: string;
  stack: string;
  deliv: DeliverableKey | "";
  broken: string;
  timeline: string;
}

export type ValidationResult =
  | { ok: true; value: ValidatedBooking }
  | { ok: false; fields: Record<string, string> };

// Basic RFC-5322-ish check. Resend will bounce anything invalid; this is
// just a cheap pre-filter so we don't waste API quota on obvious garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate + sanitize a raw JSON body. `allowedDates` is the set of
 * YYYY-MM-DD keys that the availability endpoint would return today —
 * we reject bookings for days outside that window.
 */
export function validateBookingRequest(
  raw: unknown,
  allowedDates: ReadonlySet<string>
): ValidationResult {
  const fields: Record<string, string> = {};

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, fields: { _: "Invalid request body" } };
  }
  const body = raw as Record<string, unknown>;

  const date = typeof body["date"] === "string" ? body["date"] : "";
  const time = typeof body["time"] === "string" ? body["time"] : "";
  const name = trimString(body["name"]);
  const email = trimString(body["email"]);
  const phone = trimString(body["phone"]);
  const company = trimString(body["company"]);
  const role = trimString(body["role"]);
  const size = trimString(body["size"]);
  const stack = trimString(body["stack"]);
  const deliv = trimString(body["deliv"]);
  const broken = trimString(body["broken"]);
  const timeline = trimString(body["timeline"]);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fields["date"] = "Pick a date from the list.";
  } else if (!isWeekday(date)) {
    fields["date"] = "Weekdays only — pick another day.";
  } else if (!allowedDates.has(date)) {
    fields["date"] = "That date is outside the availability window.";
  }

  let timeMinutes = -1;
  if (!ALL_SLOT_TIMES.includes(time)) {
    fields["time"] = "Pick a time from the grid.";
  } else {
    const m = labelToMinutes(time);
    if (m === null) {
      fields["time"] = "Pick a time from the grid.";
    } else {
      timeMinutes = m;
    }
  }

  if (name.length < 1 || name.length > 200) {
    fields["name"] = "Your name is required (1–200 chars).";
  }
  if (email.length < 1 || email.length > 254) {
    fields["email"] = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    fields["email"] = "That doesn't look like a valid email.";
  }
  if (phone.length > 50) {
    fields["phone"] = "Keep the phone field under 50 chars.";
  }
  if (company.length < 1 || company.length > 200) {
    fields["company"] = "Company is required (1–200 chars).";
  }
  if (role.length < 1 || role.length > 200) {
    fields["role"] = "Your role is required (1–200 chars).";
  }
  if (broken.length < 1 || broken.length > 2000) {
    fields["broken"] = "Tell me what's broken (1–2000 chars).";
  }
  if (stack.length > 500) {
    fields["stack"] = "Keep the stack field under 500 chars.";
  }
  if (size !== "" && !TEAM_SIZES.includes(size as (typeof TEAM_SIZES)[number])) {
    fields["size"] = "Pick a team size from the list.";
  }
  if (timeline !== "" && !TIMELINES.includes(timeline as (typeof TIMELINES)[number])) {
    fields["timeline"] = "Pick a timeline from the list.";
  }
  if (deliv !== "" && !DELIVERABLE_KEYS.includes(deliv as DeliverableKey)) {
    fields["deliv"] = "Pick a deliverable or leave it blank.";
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: {
      date,
      time,
      timeMinutes,
      name: name.slice(0, 200),
      email: email.slice(0, 254),
      phone: phone.slice(0, 50),
      company: company.slice(0, 200),
      role: role.slice(0, 200),
      size,
      stack: stack.slice(0, 500),
      deliv: deliv as DeliverableKey | "",
      broken: broken.slice(0, 2000),
      timeline,
    },
  };
}

function trimString(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.trim();
}
