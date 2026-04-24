-- Cloudflare D1 schema for Code-Rescue bookings.
--
-- Apply locally:
--   pnpm wrangler d1 migrations apply code-rescue-bookings
-- Apply to remote (requires Cloudflare auth):
--   pnpm wrangler d1 migrations apply code-rescue-bookings --remote
--
-- The /book form does not collect name/email/phone (operator reaches out
-- off-channel or via the calendar invite), so those columns are nullable
-- with empty-string defaults. The columns are kept for forward-compat in
-- case the form grows contact fields, and for the voice-agent bookings
-- the old site used to create.

CREATE TABLE IF NOT EXISTS bookings (
  id                   TEXT PRIMARY KEY,
  name                 TEXT NOT NULL DEFAULT '',
  email                TEXT NOT NULL DEFAULT '',
  phone                TEXT NOT NULL DEFAULT '',
  company              TEXT NOT NULL DEFAULT '',
  role                 TEXT NOT NULL DEFAULT '',
  team_size            TEXT NOT NULL DEFAULT '',
  stack                TEXT NOT NULL DEFAULT '',
  deliverable          TEXT NOT NULL DEFAULT '',
  broken               TEXT NOT NULL DEFAULT '',
  timeline             TEXT NOT NULL DEFAULT '',
  booking_date         TEXT NOT NULL,
  booking_time_minutes INTEGER NOT NULL,
  timezone             TEXT NOT NULL DEFAULT 'America/New_York',
  status               TEXT NOT NULL DEFAULT 'confirmed',
  google_event_id      TEXT,
  created_at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (booking_date, booking_time_minutes)
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings (email);
