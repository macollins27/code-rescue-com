import type { AvailabilityResponse, DateOption, DaySlots, SlotInfo } from "@content/booking";

/**
 * Fallback availability used when PUBLIC_API_BASE is unset or the endpoint
 * returns a non-2xx. Computes the next 3 business days from today and seeds
 * realistic "taken" slots so the UI always renders live-looking state.
 */
export function generateMockAvailability(now: Date = new Date()): AvailabilityResponse {
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dates: DateOption[] = [];
  const cursor = new Date(now);
  let added = 0;
  while (added < 3) {
    cursor.setDate(cursor.getDate() + 1);
    const d = cursor.getDay();
    if (d === 0 || d === 6) continue;
    const yyyy = cursor.getFullYear();
    const mm = String(cursor.getMonth() + 1).padStart(2, "0");
    const dd = String(cursor.getDate()).padStart(2, "0");
    dates.push({
      key: `${yyyy}-${mm}-${dd}`,
      dow: dow[cursor.getDay()] ?? "",
      day: String(cursor.getDate()),
      mon: mon[cursor.getMonth()] ?? "",
      pill: added === 0 ? "Tomorrow" : "",
    });
    added++;
  }

  const morningTimes = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
  const afternoonTimes = [
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

  // Deterministic but varied "taken" pattern so the grid looks lived-in.
  const isTaken = (dayIdx: number, slotIdx: number): boolean => {
    const seed = (dayIdx * 7 + slotIdx * 3) % 11;
    return seed < 3;
  };

  const slots: Record<string, DaySlots> = {};
  dates.forEach((d, dayIdx) => {
    const morning: SlotInfo[] = morningTimes.map((t, i) => ({
      t,
      taken: isTaken(dayIdx, i),
    }));
    const afternoon: SlotInfo[] = afternoonTimes.map((t, i) => ({
      t,
      taken: isTaken(dayIdx + 1, i + 6),
    }));
    slots[d.key] = { morning, afternoon };
  });

  return { dates, slots };
}
