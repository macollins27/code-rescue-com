# Booking Backend — Implementation Handoff

**Target agent:** next turn. Fresh context, no prior conversation knowledge.
**Goal:** stand up `/api/availability` and `/api/book` as Cloudflare Pages Functions so the already-built `/book` frontend (see `src/components/booking/`) becomes live end-to-end.
**Status on the frontend:** shipped (`main` branch, commit `6afe408`). It fetches from `${PUBLIC_API_BASE}/api/availability`, falls back to mock data when that 404s, and submits to `${PUBLIC_API_BASE}/api/book`. Both endpoints currently return 404; that's the gap this handoff closes.

---

## 1. Scope

Build two Cloudflare Pages Functions plus a Cloudflare D1 database, and wire them to:

- **Google Calendar** (OAuth2 refresh-token flow — no SDK, direct REST)
- **Resend** (confirmation email to booker + admin notification to operator)

**Out of scope**, and deliberately so:

- ElevenLabs / voice agent integration (retired; don't port `/api/voice/*` from the old Next.js site).
- Cloudflare Turnstile captcha (volume doesn't need it; can add later if spam).
- Upstash Redis rate limiting (volume doesn't need it; Cloudflare WAF covers the rest).
- Neon Postgres (using D1 instead for Cloudflare-native + single-vendor ethos).
- Dashboard UI (not shipping one; D1 queries for now, add an admin page later if needed).

**Volume assumption:** 5–20 bookings/month (one-client-at-a-time consultancy). Design for that scale, not enterprise.

## 2. Reference — existing backend

The old Next.js site at `/Users/maxwell/Developer/MAC-Ecosystem/code-rescue-website` has the working implementation. Read, don't port:

| What                                             | Where                                      |
| ------------------------------------------------ | ------------------------------------------ |
| `createBooking()` shared core                    | `lib/booking.ts`                           |
| Google Calendar integration (SDK-based)          | `lib/google-calendar.ts`                   |
| Availability computation                         | `lib/availability.ts`                      |
| Booking-confirmation + admin-notification emails | `lib/booking-email.ts`                     |
| Booking API handler (source of the contract)     | `app/api/calendar/book/route.ts`           |
| Availability API handler                         | `app/api/calendar/availability/route.ts`   |
| Database schema (Neon Postgres)                  | `dashboard/src/lib/db.ts` (bookings table) |

**What's different in the new world:**

- No `googleapis` SDK (Node-only, won't run on Cloudflare Workers). Replace with direct REST against the Google Calendar API v3 — see §5.
- No `@vercel/functions` `waitUntil`. Use Cloudflare's `context.waitUntil()` from the Pages Functions signature.
- No voice_calls table, no ElevenLabs bearer-token endpoints.
- Database is **Cloudflare D1 (SQLite)**, not Neon Postgres.

## 3. File layout to create

```
functions/
  api/
    availability.ts         # GET  /api/availability?days=3
    book.ts                 # POST /api/book
  lib/
    calendar.ts             # Google Calendar REST client (fetch-based)
    email.ts                # Resend REST client (fetch-based)
    db.ts                   # D1 helpers: insertBooking, getBookingsInRange
    slots.ts                # slot grid builder (mirror lib/availability.ts shape)
    time.ts                 # TZ-aware date helpers, weekday filter
    validation.ts           # BookingRequest validation (re-use shapes from src/content/booking.ts)
    types.ts                # env bindings interface (Env type)

migrations/
  0001_create_bookings.sql  # D1 schema

wrangler.toml               # Pages Functions config + D1 binding

.dev.vars                   # local secrets (gitignored)
.dev.vars.example           # template committed to repo
```

## 4. API contracts (frontend already consumes these — don't change shapes)

### `GET /api/availability?days=3`

Read the `dates` + `slots` shape from `src/content/booking.ts` (`AvailabilityResponse` type). The frontend already validates the structure via type-guards in `src/components/booking/api.ts`. Must return:

```ts
{
  dates: [
    { key: "YYYY-MM-DD", dow: "Mon", day: "28", mon: "Apr", pill: "Today" | "Tomorrow" | "" },
    // ...next 3 business days
  ],
  slots: {
    "YYYY-MM-DD": {
      morning:   [{ t: "9:00 AM", taken: boolean }, ...],   // 9:00-11:30 in 30-min steps
      afternoon: [{ t: "12:00 PM", taken: boolean }, ...]   // 12:00-4:30 in 30-min steps
    }
  }
}
```

Slot grid is fixed: morning 9:00 / 9:30 / 10:00 / 10:30 / 11:00 / 11:30, afternoon 12:00 / 1:00 / 2:00 / 2:30 / 3:00 / 3:30 / 4:00 / 4:30 (ET). A slot is `taken: true` if the Google Calendar freebusy overlaps it OR the D1 bookings table has a row for `(date, time_minutes)`. Fail closed: if Google Calendar errors, mark everything taken and return 503.

All times render in the operator's timezone (`America/New_York`). The frontend later formats in the viewer's local TZ if needed — out of scope for v1.

### `POST /api/book`

Request body matches `BookingRequest` in `src/content/booking.ts`:

```ts
{
  date: "YYYY-MM-DD",
  time: "1:00 PM",            // matches one of the slot times above
  company: string,            // required, 1..200 chars
  role: string,               // required, 1..200 chars
  size: string,               // one of TEAM_SIZES or ""
  stack: string,              // optional free-text, max 500 chars
  deliv: "domain" | "migration" | "qa" | "unsure" | "",
  broken: string,             // required, 1..2000 chars
  timeline: string            // one of TIMELINES or ""
}
```

Responses:

```ts
// 200 OK
{ ok: true, bookingId: string, icsUrl?: string, rescheduleUrl?: string }

// 409 Conflict — slot already booked
{ ok: false, error: "slot_taken" }

// 422 Unprocessable — field-level validation errors
{ ok: false, error: "validation", fields: { [field]: string } }

// 500 — anything else
{ ok: false, error: "internal" }
```

`BookingResponse` is typed in `src/content/booking.ts`. Frontend already distinguishes all three error branches via `SlotTakenError` / `ValidationError` thrown from `src/components/booking/api.ts`.

## 5. Google Calendar via REST (no SDK)

The old backend uses `googleapis` which requires Node's `net`/`tls`, so it doesn't run on Workers. Replace with direct REST:

### OAuth2 token exchange

```
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
client_id=${GOOGLE_OAUTH_CLIENT_ID}&
client_secret=${GOOGLE_OAUTH_CLIENT_SECRET}&
refresh_token=${GOOGLE_OAUTH_REFRESH_TOKEN}
```

Response: `{ access_token, expires_in, token_type }`. Cache the access token in-memory per request (don't persist); they live ~1h anyway.

### Freebusy query

```
POST https://www.googleapis.com/calendar/v3/freeBusy
Authorization: Bearer ${access_token}
Content-Type: application/json

{
  "timeMin": "2026-04-28T00:00:00-04:00",
  "timeMax": "2026-05-01T00:00:00-04:00",
  "timeZone": "America/New_York",
  "items": [{ "id": "${GOOGLE_CALENDAR_ID}" }]
}
```

Response: `{ calendars: { [calId]: { busy: [{ start, end }, ...] } } }`. Intersect each 30-minute slot against the busy intervals.

### Create event with Meet link

```
POST https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?conferenceDataVersion=1
Authorization: Bearer ${access_token}
Content-Type: application/json

{
  "summary": "Code-Rescue fit call — ${company}",
  "description": "${rendered description with booker details}",
  "start": { "dateTime": "2026-04-28T13:00:00-04:00", "timeZone": "America/New_York" },
  "end":   { "dateTime": "2026-04-28T13:30:00-04:00", "timeZone": "America/New_York" },
  "attendees": [
    { "email": "${bookerEmail}" },
    { "email": "max@code-rescue.com" }
  ],
  "reminders": { "useDefault": false, "overrides": [
    { "method": "email", "minutes": 60 },
    { "method": "popup", "minutes": 15 }
  ]},
  "conferenceData": {
    "createRequest": {
      "requestId": "${bookingId}",
      "conferenceSolutionKey": { "type": "hangoutsMeet" }
    }
  },
  "guestsCanModify": false
}
```

Response includes `hangoutLink` + `htmlLink`. Store `event.id` in `google_event_id` column.

**Race handling:** Google Calendar doesn't prevent double-booking at the API level. The D1 `UNIQUE (booking_date, booking_time_minutes)` constraint is the source of truth — attempt the INSERT first, and only call Google if it succeeds. On DB `UNIQUE` violation, return 409 without creating the event.

## 6. Database — Cloudflare D1

### Schema

```sql
CREATE TABLE bookings (
  id                  TEXT PRIMARY KEY,         -- UUIDv7 (use crypto.randomUUID or a small impl)
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT DEFAULT '',
  company             TEXT NOT NULL DEFAULT '',
  role                TEXT NOT NULL DEFAULT '',
  team_size           TEXT DEFAULT '',
  stack               TEXT DEFAULT '',
  deliverable         TEXT DEFAULT '',           -- domain|migration|qa|unsure|''
  broken              TEXT NOT NULL DEFAULT '',
  timeline            TEXT DEFAULT '',
  booking_date        TEXT NOT NULL,             -- ISO YYYY-MM-DD
  booking_time_minutes INTEGER NOT NULL,         -- 540..990 (9:00 AM .. 4:30 PM)
  timezone            TEXT NOT NULL DEFAULT 'America/New_York',
  status              TEXT NOT NULL DEFAULT 'confirmed',
  google_event_id     TEXT,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (booking_date, booking_time_minutes)
);

CREATE INDEX idx_bookings_date ON bookings (booking_date);
CREATE INDEX idx_bookings_email ON bookings (email);
```

### wrangler binding

```toml
# wrangler.toml
name = "code-rescue-com"
pages_build_output_dir = "dist"
compatibility_date = "2026-04-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "code-rescue-bookings"
database_id = "<fill after wrangler d1 create>"
```

### Migration command

```bash
pnpm wrangler d1 create code-rescue-bookings                  # one-time
pnpm wrangler d1 migrations apply code-rescue-bookings        # local
pnpm wrangler d1 migrations apply code-rescue-bookings --remote
```

## 7. Resend email — confirmation + admin notification

Two templates, both plain HTML (no React Email framework; keep it dependency-free):

### Booker confirmation

Subject: `Your Code-Rescue call is booked — ${date} at ${time}`.
Body: serif + cream styling to match site aesthetic. Include: date/time (operator TZ + booker TZ), Google Meet link, calendar ICS download, "reply to this email with anything you'd like me to read first." Sent from `max@code-rescue.com` via Resend.

### Admin notification

Subject: `[Code-Rescue] New booking — ${company} · ${date}`.
Body: all form fields inline, plus clickable email/phone. Sent to `max@code-rescue.com` (also the from — it shows up in the sent folder as a self-copy). No Meet link; max already has it on his calendar.

Resend call:

```
POST https://api.resend.com/emails
Authorization: Bearer ${RESEND_API_KEY}
Content-Type: application/json

{
  "from": "Code-Rescue <max@code-rescue.com>",
  "to": "${recipient}",
  "subject": "...",
  "html": "...",
  "reply_to": "max@code-rescue.com"
}
```

Dispatch emails via `context.waitUntil(sendEmails())` so the HTTP response doesn't wait on Resend. If email send fails, log it (console.error) — the booking still lands in D1, calendar event still exists, user still sees the confirmation screen. Email failures are a retry-later problem, not a block.

## 8. Environment & secrets

`.dev.vars.example` (commit this):

```
# Google Calendar
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=max@code-rescue.com

# Resend
RESEND_API_KEY=
NOTIFICATION_EMAIL=max@code-rescue.com
FROM_EMAIL=max@code-rescue.com

# Already in use on the public (Vite) side — declared in src/env.d.ts
PUBLIC_API_BASE=
```

The Google Calendar values should be copied from the old Vercel project (Maxwell has them). `GOOGLE_OAUTH_REFRESH_TOKEN` is the trickiest to obtain fresh; reuse the existing one.

Set production secrets via `pnpm wrangler pages secret put <name>` or the Cloudflare dashboard.

## 9. Types — share where sensible

The frontend already exports `BookingRequest`, `AvailabilityResponse`, `DeliverableKey`, etc. from `src/content/booking.ts`. Backend can import these via relative path (functions live in `functions/` at repo root, not under `src/`, so imports look like `../../src/content/booking.ts`) or via a path alias added to `tsconfig.json`'s `functions/` tsconfig.

Alternative (cleaner): create `shared/booking-contract.ts` with just the wire types and re-export from both `src/content/booking.ts` and functions. Avoid drift.

## 10. Validation rules

Re-use / mirror the shape from the old `lib/booking.ts`:

- `company`: trim, 1..200 chars → required
- `role`: trim, 1..200 chars → required
- `broken`: trim, 1..2000 chars → required
- `date`: matches `/^\d{4}-\d{2}-\d{2}$/`, must be a future weekday, within the 3-day availability window
- `time`: must be one of the 14 canonical slot strings ("9:00 AM" etc.)
- `size`: "" or one of `TEAM_SIZES`
- `deliv`: "" or one of the 4 DeliverableKey values
- `timeline`: "" or one of `TIMELINES`
- `stack`: trim, 0..500 chars

On failure, return 422 with `{ fields: { [fieldName]: "human-readable message" } }`. The frontend's `setFieldErrors` will render these inline.

## 11. Testing the handoff

After implementation, verify end-to-end locally:

```bash
pnpm wrangler pages dev dist --d1 DB=code-rescue-bookings --persist-to=.wrangler/state
```

This runs `astro build` output + Pages Functions locally with a real D1 binding.

**Manual smoke:**

1. Visit `http://localhost:8788/book` — mock banner should NOT appear (real API responds).
2. Pick a date, pick a time, fill form, submit.
3. Confirm Google Calendar event appears in the operator calendar.
4. Confirm `bookings` row exists (`pnpm wrangler d1 execute code-rescue-bookings --local --command "SELECT * FROM bookings;"`).
5. Confirm both emails arrive (check Resend dashboard for deliveries).
6. Re-submit the same slot — should get 409, frontend should refresh slot grid and unset the time.
7. Submit with empty `broken` field — should get 422, frontend should show inline error.
8. Unplug backend (stop dev), reload `/book` — mock banner should reappear.

## 12. Gate + ship

- `pnpm gate` must pass (format + lint + typecheck + build). Functions have their own types; add `functions/**/*.ts` to `tsconfig.json` include.
- Bundle budget on the `/book` page stays the same (functions run server-side, don't ship to client).
- Commit message: `book: backend — Pages Functions + D1 + Google Calendar + Resend` with a body listing the 4 integrations.

## 13. Watch-outs

- **D1 timestamps**: SQLite's `CURRENT_TIMESTAMP` is local time, not ISO. Use `strftime('%Y-%m-%dT%H:%M:%fZ','now')` as shown above. The old Postgres schema used `now()` which is TZ-aware — D1 isn't.
- **crypto.randomUUID()**: available on Workers. UUIDv7 is nicer (time-ordered) but requires a small impl. For this volume, `crypto.randomUUID()` (UUIDv4) is fine.
- **Google refresh token expiry**: refresh tokens don't expire under normal use but can if unused for 6+ months. If the one copied from Vercel was rotated recently, test it before relying on it in prod.
- **Cloudflare Pages Functions routing**: files under `functions/api/*.ts` map to `/api/*` routes. Don't put them under `src/pages/api` — that's Astro's server-endpoints directory and requires an adapter we don't have. Pages Functions live at the project root.
- **`nodejs_compat` flag**: enable it in wrangler.toml so `Buffer`, `crypto` (Node's `crypto.timingSafeEqual` etc.) work. Don't rely on full Node — verify `fetch` + `crypto` + `URL` are enough.
- **TZ in slot parsing**: "1:00 PM" → 13 hours from midnight. Slot-minutes (13 \* 60 = 780) are in operator TZ (America/New_York). When creating the Google Calendar event, use the explicit `-04:00`/`-05:00` offset for ET; don't try to let the server's TZ matter.

## 14. Success signal

When this handoff is complete:

1. Visiting `/book` on the live site and submitting a real form produces a real Google Calendar event + two real emails.
2. The booker gets a Meet link.
3. The operator (Maxwell) can see the booking in his calendar + his inbox + by querying D1.
4. Nothing on Vercel is needed anymore — the old Next.js site can be decommissioned.

Full DNS cutover to Cloudflare Pages is safe once this lands.
