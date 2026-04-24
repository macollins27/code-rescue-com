/**
 * D1 helpers. Keep the surface small — the whole backend does two kinds of
 * queries: read bookings in a date range, and insert a new one.
 */

import type { D1Database } from "./types";

export interface BookingRow {
  booking_date: string;
  booking_time_minutes: number;
}

export async function getBookedSlotsInRange(
  db: D1Database,
  startDate: string,
  endDate: string
): Promise<Set<string>> {
  const { results } = await db
    .prepare(
      "SELECT booking_date, booking_time_minutes FROM bookings " +
        "WHERE status = 'confirmed' AND booking_date >= ? AND booking_date <= ?"
    )
    .bind(startDate, endDate)
    .all<BookingRow>();

  const set = new Set<string>();
  for (const row of results) {
    set.add(`${row.booking_date}:${row.booking_time_minutes}`);
  }
  return set;
}

export interface InsertBookingInput {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  teamSize: string;
  stack: string;
  deliverable: string;
  broken: string;
  timeline: string;
  bookingDate: string;
  bookingTimeMinutes: number;
  timezone: string;
}

export type InsertBookingResult = { ok: true } | { ok: false; conflict: true };

/**
 * Insert a booking. Returns `{ ok: false, conflict: true }` on UNIQUE
 * constraint violation (double-book), `{ ok: true }` otherwise.
 * Any other DB error bubbles up.
 */
export async function insertBooking(
  db: D1Database,
  input: InsertBookingInput
): Promise<InsertBookingResult> {
  try {
    await db
      .prepare(
        "INSERT INTO bookings (" +
          "id, name, email, phone, company, role, team_size, stack, deliverable, broken, timeline, " +
          "booking_date, booking_time_minutes, timezone" +
          ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(
        input.id,
        input.name,
        input.email,
        input.phone,
        input.company,
        input.role,
        input.teamSize,
        input.stack,
        input.deliverable,
        input.broken,
        input.timeline,
        input.bookingDate,
        input.bookingTimeMinutes,
        input.timezone
      )
      .run();
    return { ok: true };
  } catch (err: unknown) {
    if (isUniqueViolation(err)) {
      return { ok: false, conflict: true };
    }
    throw err;
  }
}

export async function updateBookingEventId(
  db: D1Database,
  id: string,
  googleEventId: string
): Promise<void> {
  await db
    .prepare("UPDATE bookings SET google_event_id = ? WHERE id = ?")
    .bind(googleEventId, id)
    .run();
}

/**
 * D1 surfaces UNIQUE-constraint errors as SQLite messages that include
 * "UNIQUE constraint failed". Sniff the message rather than the code
 * because D1 doesn't expose a stable error-code enum across runtimes.
 */
function isUniqueViolation(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return msg.includes("unique constraint failed") || msg.includes("constraint_unique");
}
