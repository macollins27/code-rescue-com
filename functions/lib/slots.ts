/**
 * Slot-grid builder. Mirrors the shape the frontend expects
 * (AvailabilityResponse in src/content/booking.ts).
 */

import type { BusyInterval } from "./calendar";
import {
  AFTERNOON_SLOT_TIMES,
  MEETING_DURATION_MINUTES,
  MORNING_SLOT_TIMES,
  labelToMinutes,
  nowMinutesInTz,
  todayInTz,
  wallClockToUtcIso,
} from "./time";

export interface SlotOut {
  t: string;
  taken: boolean;
}

export interface DaySlotsOut {
  morning: SlotOut[];
  afternoon: SlotOut[];
}

export interface BuildSlotsInput {
  dates: ReadonlyArray<{ key: string }>;
  tz: string;
  busyIntervals: ReadonlyArray<BusyInterval>;
  /** Keys are "YYYY-MM-DD:MINUTES" */
  dbBooked: ReadonlySet<string>;
  now?: Date;
  /** Skip slots whose start is within `bufferMinutes` of now (operator TZ). */
  bufferMinutes?: number;
}

/**
 * Build per-date morning/afternoon slot arrays with taken flags.
 * A slot is taken if:
 *   - its 30-min window overlaps any busy interval from Google Calendar, OR
 *   - the bookings table has a row for (date, minutes), OR
 *   - it's today and the slot starts before `now + bufferMinutes`.
 */
export function buildSlotGrid(input: BuildSlotsInput): Record<string, DaySlotsOut> {
  const now = input.now ?? new Date();
  const todayStr = todayInTz(input.tz, now);
  const nowMin = nowMinutesInTz(input.tz, now);
  const buffer = input.bufferMinutes ?? 120;

  const out: Record<string, DaySlotsOut> = {};
  for (const d of input.dates) {
    out[d.key] = {
      morning: MORNING_SLOT_TIMES.map((label) =>
        buildSlot(
          label,
          d.key,
          input.tz,
          input.busyIntervals,
          input.dbBooked,
          todayStr,
          nowMin,
          buffer
        )
      ),
      afternoon: AFTERNOON_SLOT_TIMES.map((label) =>
        buildSlot(
          label,
          d.key,
          input.tz,
          input.busyIntervals,
          input.dbBooked,
          todayStr,
          nowMin,
          buffer
        )
      ),
    };
  }
  return out;
}

function buildSlot(
  label: string,
  dateKey: string,
  tz: string,
  busy: ReadonlyArray<BusyInterval>,
  dbBooked: ReadonlySet<string>,
  todayStr: string,
  nowMin: number,
  bufferMin: number
): SlotOut {
  const minutes = labelToMinutes(label);
  if (minutes === null) return { t: label, taken: true };

  // Past / too-soon (operator TZ)
  if (dateKey === todayStr && minutes <= nowMin + bufferMin) {
    return { t: label, taken: true };
  }

  // DB rows — source of truth for our own bookings
  if (dbBooked.has(`${dateKey}:${minutes}`)) {
    return { t: label, taken: true };
  }

  // Google Calendar busy overlap
  const slotStartUtc = new Date(wallClockToUtcIso(dateKey, minutes, tz)).getTime();
  const slotEndUtc = slotStartUtc + MEETING_DURATION_MINUTES * 60_000;
  for (const b of busy) {
    const bStart = Date.parse(b.start);
    const bEnd = Date.parse(b.end);
    if (Number.isNaN(bStart) || Number.isNaN(bEnd)) continue;
    if (slotStartUtc < bEnd && slotEndUtc > bStart) {
      return { t: label, taken: true };
    }
  }

  return { t: label, taken: false };
}

/** All-taken fallback for a set of dates (used when Google Calendar errors). */
export function allTakenGrid(dates: ReadonlyArray<{ key: string }>): Record<string, DaySlotsOut> {
  const out: Record<string, DaySlotsOut> = {};
  for (const d of dates) {
    out[d.key] = {
      morning: MORNING_SLOT_TIMES.map((t) => ({ t, taken: true })),
      afternoon: AFTERNOON_SLOT_TIMES.map((t) => ({ t, taken: true })),
    };
  }
  return out;
}
