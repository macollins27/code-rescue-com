/**
 * Google Calendar REST client — no SDK. Runs on Cloudflare Workers (no Node
 * `net`/`tls`). Uses OAuth2 refresh-token flow: exchange the long-lived
 * refresh token for a ~1h access token per request, then hit the v3 API.
 */

import type { Env } from "./types";
import { MEETING_DURATION_MINUTES, wallClockToOffsetIso, wallClockToUtcIso } from "./time";

const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const FREEBUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy";

export interface BusyInterval {
  start: string; // ISO
  end: string; // ISO
}

export interface GoogleCalendarCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  calendarId: string;
}

export function credsFromEnv(env: Env): GoogleCalendarCredentials {
  const clientId = env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const calendarId = env.GOOGLE_CALENDAR_ID;
  if (!clientId || !clientSecret || !refreshToken || !calendarId) {
    throw new Error(
      "Missing Google Calendar env (GOOGLE_OAUTH_CLIENT_ID/CLIENT_SECRET/REFRESH_TOKEN/CALENDAR_ID)"
    );
  }
  return { clientId, clientSecret, refreshToken, calendarId };
}

/**
 * Exchange a refresh token for an access token. Response lifetime is ~1h;
 * we don't cache across requests (each Workers invocation is ephemeral).
 */
export async function getAccessToken(creds: GoogleCalendarCredentials): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    refresh_token: creds.refreshToken,
  });

  const res = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google OAuth2 token exchange failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as { access_token?: unknown };
  const token = json.access_token;
  if (typeof token !== "string" || token.length === 0) {
    throw new Error("Google OAuth2 response missing access_token");
  }
  return token;
}

/**
 * Query busy intervals in the given wall-clock date range. Fail-closed:
 * throws if the calendar payload is missing or errored so the caller can
 * return a 503 rather than silently showing all-free.
 */
export async function getFreeBusy(
  creds: GoogleCalendarCredentials,
  accessToken: string,
  startDate: string,
  endDate: string,
  tz: string
): Promise<BusyInterval[]> {
  const timeMin = wallClockToUtcIso(startDate, 0, tz);
  // end of day: 23:59 on endDate → start of next day is cleaner, but freebusy
  // accepts any RFC-3339, so we pin 24*60 - 1 == 1439 minutes (23:59).
  const timeMax = wallClockToUtcIso(endDate, 23 * 60 + 59, tz);

  const res = await fetch(FREEBUSY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: tz,
      items: [{ id: creds.calendarId }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google Calendar freebusy failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as {
    calendars?: Record<
      string,
      { busy?: Array<{ start?: string; end?: string }>; errors?: unknown[] }
    >;
  };
  const cal = json.calendars?.[creds.calendarId];
  if (!cal) {
    throw new Error(
      `Google Calendar freebusy: no data for calendarId "${creds.calendarId}" — check ID/permissions`
    );
  }
  if (Array.isArray(cal.errors) && cal.errors.length > 0) {
    throw new Error(`Google Calendar freebusy errors: ${JSON.stringify(cal.errors)}`);
  }
  const busy = cal.busy ?? [];
  return busy.map((b) => ({
    start: typeof b.start === "string" ? b.start : "",
    end: typeof b.end === "string" ? b.end : "",
  }));
}

export interface CreatedCalendarEvent {
  eventId: string | null;
  meetLink: string | null;
  htmlLink: string | null;
}

export interface CreateEventInput {
  company: string;
  role: string;
  size: string;
  stack: string;
  deliverable: string;
  broken: string;
  timeline: string;
  date: string;
  timeMinutes: number;
  timezone: string;
  operatorEmail: string;
  requestId: string;
  bookerEmail?: string;
}

/**
 * Create a calendar event with a Google Meet link. `requestId` should be a
 * unique-per-attempt id (the booking id) so Meet rooms don't collide on
 * concurrent requests.
 */
export async function createCalendarEvent(
  creds: GoogleCalendarCredentials,
  accessToken: string,
  input: CreateEventInput
): Promise<CreatedCalendarEvent> {
  const endMinutes = input.timeMinutes + MEETING_DURATION_MINUTES;
  const startIso = wallClockToOffsetIso(input.date, input.timeMinutes, input.timezone);
  const endIso = wallClockToOffsetIso(input.date, endMinutes, input.timezone);

  const descLines: string[] = [];
  descLines.push(`Company: ${input.company}`);
  descLines.push(`Role: ${input.role}`);
  if (input.size) descLines.push(`Team size: ${input.size}`);
  if (input.stack) descLines.push(`Stack: ${input.stack}`);
  if (input.deliverable) descLines.push(`Deliverable: ${input.deliverable}`);
  if (input.timeline) descLines.push(`Timeline: ${input.timeline}`);
  descLines.push("");
  descLines.push("What's broken:");
  descLines.push(input.broken);

  const attendees: Array<{ email: string }> = [{ email: input.operatorEmail }];
  if (input.bookerEmail) attendees.push({ email: input.bookerEmail });

  const body = {
    summary: `Code-Rescue fit call — ${input.company}`,
    description: descLines.join("\n"),
    start: { dateTime: startIso, timeZone: input.timezone },
    end: { dateTime: endIso, timeZone: input.timezone },
    attendees,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 15 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: input.requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    guestsCanModify: false,
  };

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(creds.calendarId)}/events?conferenceDataVersion=1`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google Calendar events.insert failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as {
    id?: unknown;
    htmlLink?: unknown;
    hangoutLink?: unknown;
    conferenceData?: {
      entryPoints?: Array<{ entryPointType?: unknown; uri?: unknown }>;
    };
  };

  const eventId = typeof json.id === "string" ? json.id : null;
  const htmlLink = typeof json.htmlLink === "string" ? json.htmlLink : null;

  let meetLink: string | null = null;
  if (typeof json.hangoutLink === "string" && json.hangoutLink.length > 0) {
    meetLink = json.hangoutLink;
  } else if (Array.isArray(json.conferenceData?.entryPoints)) {
    const video = json.conferenceData.entryPoints.find(
      (ep) => ep.entryPointType === "video" && typeof ep.uri === "string"
    );
    if (video && typeof video.uri === "string") meetLink = video.uri;
  }

  return { eventId, meetLink, htmlLink };
}
