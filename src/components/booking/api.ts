import type { AvailabilityResponse, BookingRequest, BookingResponse } from "@content/booking";

// Public env var read at build time by Vite. Empty string = same-origin /api/*.
const BASE: string = (import.meta.env.PUBLIC_API_BASE ?? "").replace(/\/$/, "");

export class SlotTakenError extends Error {
  constructor() {
    super("slot_taken");
    this.name = "SlotTakenError";
  }
}

export class ValidationError extends Error {
  readonly fields: Readonly<Record<string, string>>;
  constructor(fields: Readonly<Record<string, string>>) {
    super("validation");
    this.name = "ValidationError";
    this.fields = fields;
  }
}

export async function fetchAvailability(
  signal?: AbortSignal
): Promise<AvailabilityResponse | null> {
  try {
    const res = await fetch(`${BASE}/api/availability?days=3`, {
      headers: { Accept: "application/json" },
      signal: signal ?? null,
    });
    if (!res.ok) return null;
    const body = (await res.json()) as unknown;
    if (!isAvailabilityResponse(body)) return null;
    return body;
  } catch {
    return null;
  }
}

export async function submitBooking(req: BookingRequest): Promise<BookingResponse> {
  const res = await fetch(`${BASE}/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(req),
  });
  const body = (await res.json().catch(() => null)) as unknown;

  if (res.status === 409) {
    throw new SlotTakenError();
  }
  if (res.status === 422 && isValidationResponse(body)) {
    throw new ValidationError(body.fields);
  }
  if (!res.ok) {
    throw new Error(`booking_failed_${res.status}`);
  }
  if (!isBookingSuccess(body)) {
    throw new Error("malformed_response");
  }
  return body;
}

function isAvailabilityResponse(v: unknown): v is AvailabilityResponse {
  if (typeof v !== "object" || v === null) return false;
  const r = v as { dates?: unknown; slots?: unknown };
  return Array.isArray(r.dates) && typeof r.slots === "object" && r.slots !== null;
}

function isValidationResponse(
  v: unknown
): v is { ok: false; error: "validation"; fields: Record<string, string> } {
  if (typeof v !== "object" || v === null) return false;
  const r = v as { ok?: unknown; error?: unknown; fields?: unknown };
  return r.ok === false && r.error === "validation" && typeof r.fields === "object";
}

function isBookingSuccess(v: unknown): v is { ok: true; bookingId: string } {
  if (typeof v !== "object" || v === null) return false;
  const r = v as { ok?: unknown; bookingId?: unknown };
  return r.ok === true && typeof r.bookingId === "string";
}
