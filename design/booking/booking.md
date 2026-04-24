# Booking Page — Claude Code Handoff

The mockup lives at `../Code-Rescue Book.html` + `../book.jsx`. Ship this as the production booking page at `code-rescue.com/book/` (or wherever your backend lives). The design matches the VP page (`Code-Rescue.html`) — same tokens, same typography, same visual language.

## Design direction

Editorial letter, not a booking form. The whole page reads as correspondence from Max to the person considering hiring him. This is intentional positioning: the operator is the product, and the page should feel that way.

**Do not** redesign this as a standard Cal.com-style split-pane booking. The letter framing is load-bearing.

## Flow

```
1. Pick a day     (3-day horizontal strip, sparse — "Today / Tomorrow / …")
2. Pick a time    (Morning + Afternoon grids, taken slots struck-through)
3. Fill the form  (company, role, team size, stack, deliverable, what's broken, timeline)
4. Submit         → POST /api/book → confirmation screen
```

Sections progressively reveal — time appears after date, form appears after time. No multi-step wizard; it's one scroll.

## Backend contract

### `GET /api/availability?days=3`

Returns the next 3 business days and their slot availability. Shape:

```json
{
  "dates": [
    { "key": "2026-04-28", "dow": "Mon", "day": "28", "mon": "Apr", "pill": "Today" },
    { "key": "2026-04-29", "dow": "Tue", "day": "29", "mon": "Apr", "pill": "Tomorrow" },
    { "key": "2026-04-30", "dow": "Wed", "day": "30", "mon": "Apr", "pill": "" }
  ],
  "slots": {
    "2026-04-28": {
      "morning":   [{ "t": "9:00 AM", "taken": true }, { "t": "9:30 AM", "taken": false }],
      "afternoon": [{ "t": "12:00 PM", "taken": true }, { "t": "1:00 PM", "taken": false }]
    },
    "2026-04-29": { ... },
    "2026-04-30": { ... }
  }
}
```

The mockup currently hardcodes `DATES`, `MORNING`, `AFTERNOON` at the top of `book.jsx`. Replace those three constants with a fetch on mount.

### `POST /api/book`

Request body:

```ts
{
  date: string;       // "2026-04-28"
  time: string;       // "1:00 PM"
  company: string;    // required
  role: string;       // required, e.g. "VP Engineering"
  size: string;       // "1–5" | "6–20" | "21–50" | "51–100" | "100+"
  stack: string;      // free-text
  deliv: "domain" | "migration" | "qa" | "unsure";
  broken: string;     // required, free-text paragraph
  timeline: string;   // one of TIMELINES
}
```

Response:

```ts
// 200 OK
{ ok: true, bookingId: string, icsUrl: string, rescheduleUrl: string }

// 409 Conflict (slot taken)
{ ok: false, error: "slot_taken" }

// 422 Unprocessable
{ ok: false, error: "validation", fields: { [field]: string } }
```

On 409, refetch availability and re-render (the slot the user picked just got snapped up by someone else). On 422, show the field-level error inline.

On success, the backend should:
1. Create the calendar event (Google Calendar API)
2. Send the invite email with Meet link, prep doc (optional), and reschedule link
3. Send Max a Slack/email with the form contents

## Implementation

### Stack

Same as the VP page — Next.js 15 App Router, TypeScript strict, plain CSS with the same tokens. The booking page is a single route: `app/book/page.tsx`.

### Files to create

```
app/book/page.tsx           # 'use client' — renders <Book />
app/book/Book.tsx           # the main component (from book.jsx)
app/book/DateStrip.tsx
app/book/TimeGrid.tsx
app/book/DelivTiles.tsx
app/book/Confirmation.tsx
app/book/book.module.css    # styles from Code-Rescue Book.html
app/api/availability/route.ts
app/api/book/route.ts
lib/booking.ts              # types for Date, Slot, BookingRequest, BookingResponse
```

### Design tokens

Reuse the same `:root` CSS custom properties from the VP page. Do not redefine them — the booking page is a different route in the same app and should inherit from `app/globals.css`.

### State management

Local React state is fine. No Redux, no Zustand, no server state library. The whole page is a single component with:

```ts
const [date, setDate] = useState<string | null>(null);
const [time, setTime] = useState<string | null>(null);
const [form, setForm] = useState<FormState>(...);
const [submitting, setSubmitting] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Validation

Required fields: `date`, `time`, `company`, `role`, `broken`. All others optional. The submit button stays disabled until those five are present — already wired in the mockup via `canSubmit`.

Server should re-validate. Never trust the client.

### Analytics

None. The VP page has no analytics and neither should this one. If Max wants to track conversion later, add a single server-side event on successful booking — no client-side pixels.

## Content

All copy is in `book.jsx`. Do not change without Max's explicit approval — the tone is deliberate. Specifically:

- **Headline:** "Thirty minutes is enough to know if this is a *fit.*" (em on "fit" is accent color)
- **Salutation:** "To the person considering this —"
- **Three section headings:** "One. Pick a day." / "Two. Pick a time." / "Three. A few things to read before we talk."
- **Section dividers:** `§` pilcrow centered on a thin rule
- **Signature:** "— Max" in serif italic
- **Signoff:** "Operator, Code-Rescue · Tampa, FL" in mono

## Responsive

- `>768px` — 760px paper card centered on cream background
- `≤768px` — paper card fills viewport with 16px side margin, 40/28/56 padding
- Time grid: 4 columns at wide, 3 columns at narrow
- Deliverable tiles: 2 columns at wide, 1 column at narrow
- Confirmation summary: two-col at wide, stacked at narrow

Already wired in the mockup's `@media` block.

## Accessibility

- Every button is a `<button>`, not a `<div>`.
- Disabled time slots have `disabled` attribute + line-through (screen readers announce "dimmed").
- Focus rings on all interactive elements (default browser + `box-shadow` on input focus).
- Labels are real `<label>` elements associated with inputs.
- Semantic `<h1>` → `<h2>` hierarchy.
- `prefers-reduced-motion`: disable the 150ms transitions.

## Confirmation page

In-page, not a redirect. The `submitted` state replaces the form with:

1. Green checkmark disc
2. "You're booked." headline
3. Summary `<dl>`: When / Who / Where / Reschedule
4. "What to have ready" — 3 numbered items (see `Confirmation` component)
5. Footer line: "No prep doc is required. Come as you are."

The backend should have already sent the calendar invite by this point. The confirmation message says so explicitly ("A calendar invite is on its way").

## Error states

- **Slot snatched during form-fill** (409) — show inline error, refresh availability, highlight the now-unavailable time, ask user to repick.
- **Network failure** — show the fallback: "Couldn't book that slot. Try another time or email max@code-rescue.com."
- **Backend validation** (422) — inline per-field error messages.

## Out of scope

- Cal.com integration (you're building this yourself)
- Rescheduling UI (one-click link in the email, handled by backend)
- Admin view for Max to see bookings (separate `/dashboard` concern)
- Timezone selector — show slots in viewer's local TZ by having the backend emit ISO strings and formatting client-side with `Intl.DateTimeFormat`
- Multi-day availability expansion (we committed to 3 days on purpose — "one client at a time" signals scarcity)
- Any tracking, analytics, or A/B testing

## Checklist

- [ ] Copy `book.jsx` → `app/book/Book.tsx`, add types
- [ ] Extract styles from `Code-Rescue Book.html` → `book.module.css`
- [ ] Build `app/api/availability/route.ts` hitting your calendar source
- [ ] Build `app/api/book/route.ts` that creates the event + sends the invite
- [ ] Wire fetch on mount; handle loading state (skeleton or fade-in)
- [ ] Wire submit handler; handle 200 / 409 / 422 / network error
- [ ] Verify keyboard flow end-to-end: Tab through date → time → form → submit
- [ ] Lighthouse: 100 / 100 / 100 / 100 on mobile
- [ ] Deploy; confirm the live URL receives a real booking end-to-end
