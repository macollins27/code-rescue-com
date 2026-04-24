/**
 * TZ-aware helpers. All operator-side times live in `America/New_York`.
 * We compute offsets from the IANA zone so DST handoffs are correct without
 * relying on the server's wall clock.
 */

export const OPERATOR_TZ = "America/New_York";

export const MORNING_SLOT_TIMES = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
] as const;

export const AFTERNOON_SLOT_TIMES = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
] as const;

export const ALL_SLOT_TIMES: ReadonlyArray<string> = [
  ...MORNING_SLOT_TIMES,
  ...AFTERNOON_SLOT_TIMES,
];

export const MEETING_DURATION_MINUTES = 30;

const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MON_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Parse a "9:00 AM"/"4:30 PM" label to minutes-past-midnight. */
export function labelToMinutes(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})\s+(AM|PM)$/.exec(label);
  if (!match) return null;
  const raw = match[1];
  const min = match[2];
  const period = match[3];
  if (raw === undefined || min === undefined || period === undefined) return null;
  let hour = parseInt(raw, 10);
  const minute = parseInt(min, 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  if (period === "AM" && hour === 12) hour = 0;
  if (period === "PM" && hour !== 12) hour += 12;
  return hour * 60 + minute;
}

export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${pad2(m)} ${period}`;
}

/**
 * Today's YYYY-MM-DD in the operator TZ.
 */
export function todayInTz(tz: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

/** Minutes-past-midnight right now in `tz`. */
export function nowMinutesInTz(tz: string, now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "0";
  const minStr = parts.find((p) => p.type === "minute")?.value ?? "0";
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minStr, 10);
  const h = hour === 24 ? 0 : hour;
  return h * 60 + minute;
}

/**
 * Build up to `days` upcoming weekday DateOptions starting from tomorrow.
 */
export interface DateOptionOut {
  key: string;
  dow: string;
  day: string;
  mon: string;
  pill: "Today" | "Tomorrow" | "";
}

export function buildDateOptions(
  days: number,
  tz: string,
  now: Date = new Date()
): DateOptionOut[] {
  if (!Number.isFinite(days) || days <= 0) return [];

  const result: DateOptionOut[] = [];
  const todayStr = todayInTz(tz, now);
  const tomorrowStr = addDays(todayStr, 1);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  let cursor = new Date(now);
  let safety = 0;
  while (result.length < days && safety < days + 30) {
    safety++;
    cursor = new Date(cursor.getTime() + 86_400_000);
    const parts = formatter.formatToParts(cursor);
    const year = parts.find((p) => p.type === "year")?.value ?? "1970";
    const month = parts.find((p) => p.type === "month")?.value ?? "01";
    const day = parts.find((p) => p.type === "day")?.value ?? "01";
    const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
    const key = `${year}-${month}-${day}`;

    const dowIdx = DOW_SHORT.indexOf(weekday as (typeof DOW_SHORT)[number]);
    if (dowIdx === 0 || dowIdx === 6) continue;

    const monIdx = parseInt(month, 10) - 1;
    const monLabel = MON_SHORT[monIdx] ?? "";
    const pill: "Today" | "Tomorrow" | "" =
      key === todayStr ? "Today" : key === tomorrowStr ? "Tomorrow" : "";

    result.push({
      key,
      dow: weekday,
      day: String(parseInt(day, 10)),
      mon: monLabel,
      pill,
    });
  }

  return result;
}

/** Add N days to a YYYY-MM-DD string (UTC-noon math to dodge TZ drift). */
export function addDays(dateStr: string, n: number): string {
  const parts = dateStr.split("-");
  const y = parseInt(parts[0] ?? "", 10);
  const m = parseInt(parts[1] ?? "", 10);
  const d = parseInt(parts[2] ?? "", 10);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return dateStr;
  const base = Date.UTC(y, m - 1, d, 12, 0, 0);
  const next = new Date(base + n * 86_400_000);
  const yy = next.getUTCFullYear();
  const mm = pad2(next.getUTCMonth() + 1);
  const dd = pad2(next.getUTCDate());
  return `${yy}-${mm}-${dd}`;
}

/**
 * Offset-in-minutes for `tz` at the instant represented by the UTC-date
 * parts (year/month/day/hour/minute). Returns a number like -240 (EDT) or
 * -300 (EST).
 */
export function tzOffsetMinutes(
  tz: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): number {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(utcGuess));
  const get = (type: string): number =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);
  const tzHour = get("hour") === 24 ? 0 : get("hour");
  const tzMs = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    tzHour,
    get("minute"),
    get("second")
  );
  return Math.round((tzMs - utcGuess) / 60_000);
}

/**
 * Convert wall-clock date/time in `tz` to a UTC ISO string.
 * Example: ("2026-04-28", 780, "America/New_York") -> "2026-04-28T17:00:00.000Z"
 */
export function wallClockToUtcIso(
  dateStr: string,
  minutesFromMidnight: number,
  tz: string
): string {
  const parts = dateStr.split("-");
  const y = parseInt(parts[0] ?? "", 10);
  const m = parseInt(parts[1] ?? "", 10);
  const d = parseInt(parts[2] ?? "", 10);
  const hour = Math.floor(minutesFromMidnight / 60);
  const minute = minutesFromMidnight % 60;
  const offsetMin = tzOffsetMinutes(tz, y, m, d, hour, minute);
  // Wall clock minus offset = UTC
  const utcMs = Date.UTC(y, m - 1, d, hour, minute, 0) - offsetMin * 60_000;
  return new Date(utcMs).toISOString();
}

/**
 * Format the TZ offset as "+HH:MM" / "-HH:MM" for a given wall-clock moment.
 */
export function tzOffsetString(dateStr: string, minutesFromMidnight: number, tz: string): string {
  const parts = dateStr.split("-");
  const y = parseInt(parts[0] ?? "", 10);
  const m = parseInt(parts[1] ?? "", 10);
  const d = parseInt(parts[2] ?? "", 10);
  const hour = Math.floor(minutesFromMidnight / 60);
  const minute = minutesFromMidnight % 60;
  const offsetMin = tzOffsetMinutes(tz, y, m, d, hour, minute);
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  return `${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
}

/**
 * Build an RFC-3339 local-with-offset datetime string:
 *   "2026-04-28T13:00:00-04:00"
 * This is the exact shape the Google Calendar events.insert body expects.
 */
export function wallClockToOffsetIso(
  dateStr: string,
  minutesFromMidnight: number,
  tz: string
): string {
  const hour = Math.floor(minutesFromMidnight / 60);
  const minute = minutesFromMidnight % 60;
  const offset = tzOffsetString(dateStr, minutesFromMidnight, tz);
  return `${dateStr}T${pad2(hour)}:${pad2(minute)}:00${offset}`;
}

/** Check if a YYYY-MM-DD is a weekday in UTC (noon-safe). */
export function isWeekday(dateStr: string): boolean {
  const parts = dateStr.split("-");
  const y = parseInt(parts[0] ?? "", 10);
  const m = parseInt(parts[1] ?? "", 10);
  const d = parseInt(parts[2] ?? "", 10);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return false;
  const dow = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).getUTCDay();
  return dow !== 0 && dow !== 6;
}

/** Pretty-format a YYYY-MM-DD for email copy (e.g. "Tuesday, April 28, 2026"). */
export function formatDateLong(dateStr: string): string {
  const parts = dateStr.split("-");
  const y = parseInt(parts[0] ?? "", 10);
  const m = parseInt(parts[1] ?? "", 10);
  const d = parseInt(parts[2] ?? "", 10);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return dateStr;
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
