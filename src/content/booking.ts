/* Copy, data, and types for /book. Kept in sync with design/booking/. */

export const BOOKING_META = {
  title: "Book a call — Code-Rescue",
  description: "A 30-minute fit call with Maxwell Collins. One client at a time. No commitment.",
} as const;

export const BOOKING_COPY = {
  marginalia: ["A letter before we talk", "Max Collins", "Tampa, FL"],
  salutation: "To the person considering this —",
  headlineHtml: "Thirty minutes is enough to know if this is a <em>fit.</em>",
  bodyParagraphs: [
    "I take one client at a time. Before I take yours, we talk. You tell me what's breaking in your codebase and I tell you honestly whether the stack I install will help or whether you need something else. If it's the second thing, I'll usually know someone.",
    "Pick a day. Pick a time. Answer a few questions. That's the whole thing.",
  ],
  sectionHeadings: [
    "One. Pick a day.",
    "Two. Pick a time.",
    "Three. A few things to read before we talk.",
  ],
  formBlurb:
    "The more honest you are here, the more useful the call is. If you're not sure about something, say so.",
  promise:
    "I'll read this before the call. If we're not a fit, I'll tell you on the call and point you somewhere that is.",
  fallbackError: "Couldn't book that slot. Try another time or email max@code-rescue.com.",
  slotTakenError: "That slot just got taken. Pick another one — the grid has been refreshed.",
  signature: "— Max",
  signoffSub: "Operator, Code-Rescue · Tampa, FL",
  confirmationHeadline: "You're booked.",
  confirmationLede:
    "A calendar invite is on its way. Reply to it with anything you'd like me to read before we talk.",
  confirmationWhenLabel: "When",
  confirmationWhoLabel: "Who",
  confirmationWhereLabel: "Where",
  confirmationRescheduleLabel: "Reschedule",
  confirmationWhoValue: "You & Maxwell Collins",
  confirmationWhereValue: "Google Meet link in the invite",
  confirmationRescheduleValue: "One-click link in your invite",
  confirmationPrepHeading: "What to have ready",
  confirmationFooter: "No prep doc is required. Come as you are.",
  prepItems: [
    "The one area of your codebase that's causing the most trouble right now. A sentence is enough.",
    "A rough sense of team size and how much of the code is AI-assisted. No numbers need to be exact.",
    'The outcome that would make this worth your 30 minutes. "Know if this is for us" is a fine answer.',
  ],
  submitButtonIdle: (dateLabel: string, time: string) =>
    `Send — book me in on ${dateLabel} at ${time}`,
  submitButtonLoading: "Booking…",
  noscriptMessage:
    "Booking requires JavaScript. Email max@code-rescue.com and I'll book you in manually.",
  backLinkLabel: "← Back to site",
} as const;

export type DeliverableKey = "domain" | "migration" | "qa" | "unsure";

export interface DeliverableOption {
  readonly k: DeliverableKey;
  readonly label: string;
  readonly sub: string;
}

export const DELIVERABLES_OPTIONS: ReadonlyArray<DeliverableOption> = [
  { k: "domain", label: "Domain Build", sub: "Rebuild one area" },
  { k: "migration", label: "System Migration", sub: "One cross-cutting change" },
  { k: "qa", label: "QA Run", sub: "Diagnostic only" },
  { k: "unsure", label: "Not sure yet", sub: "Let's talk first" },
];

export const TEAM_SIZES = ["1–5", "6–20", "21–50", "51–100", "100+"] as const;

export const TIMELINES = [
  "As soon as possible",
  "Within 30 days",
  "Within 60–90 days",
  "Q3 or later",
  "Just exploring",
] as const;

// API shapes — kept in sync with design/booking/booking.md contract.

export interface DateOption {
  /** YYYY-MM-DD */
  readonly key: string;
  /** "Mon" */
  readonly dow: string;
  /** "28" */
  readonly day: string;
  /** "Apr" */
  readonly mon: string;
  /** "Today" | "Tomorrow" | "" */
  readonly pill: string;
}

export interface SlotInfo {
  /** "9:00 AM" */
  readonly t: string;
  readonly taken: boolean;
}

export interface DaySlots {
  readonly morning: ReadonlyArray<SlotInfo>;
  readonly afternoon: ReadonlyArray<SlotInfo>;
}

export interface AvailabilityResponse {
  readonly dates: ReadonlyArray<DateOption>;
  readonly slots: Readonly<Record<string, DaySlots>>;
}

export interface BookingRequest {
  readonly date: string;
  readonly time: string;
  readonly company: string;
  readonly role: string;
  readonly size: string;
  readonly stack: string;
  readonly deliv: DeliverableKey | "";
  readonly broken: string;
  readonly timeline: string;
}

export type BookingResponse =
  | {
      readonly ok: true;
      readonly bookingId: string;
      readonly icsUrl?: string;
      readonly rescheduleUrl?: string;
    }
  | { readonly ok: false; readonly error: "slot_taken" }
  | {
      readonly ok: false;
      readonly error: "validation";
      readonly fields: Readonly<Record<string, string>>;
    };

export interface FormState {
  company: string;
  role: string;
  size: string;
  stack: string;
  deliv: DeliverableKey | "";
  broken: string;
  timeline: string;
}

export const EMPTY_FORM: FormState = {
  company: "",
  role: "",
  size: "",
  stack: "",
  deliv: "",
  broken: "",
  timeline: "",
};
