/**
 * Resend REST client — no SDK. Sends the admin notification for every booking.
 *
 * Note: the /book form does not collect booker name/email, so we cannot send
 * the booker a confirmation email. If the form grows contact fields, add a
 * `sendBookerConfirmationEmail` that mirrors the aesthetic in
 * /Users/maxwell/Developer/MAC-Ecosystem/code-rescue-website/lib/booking-email.ts.
 */

import type { Env } from "./types";
import { formatDateLong } from "./time";

const RESEND_URL = "https://api.resend.com/emails";

export interface AdminEmailInput {
  bookingId: string;
  company: string;
  role: string;
  size: string;
  stack: string;
  deliverable: string;
  broken: string;
  timeline: string;
  date: string;
  time: string;
  timezone: string;
  meetLink: string | null;
  htmlLink: string | null;
}

export async function sendAdminNotificationEmail(env: Env, input: AdminEmailInput): Promise<void> {
  if (!env.RESEND_API_KEY || !env.NOTIFICATION_EMAIL || !env.FROM_EMAIL) {
    console.warn("Resend env missing — skipping admin notification email");
    return;
  }

  const subject = `[Code-Rescue] New booking — ${input.company} · ${input.date}`;
  const html = adminHtml(input);
  const text = adminText(input);

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Code-Rescue <${env.FROM_EMAIL}>`,
      to: env.NOTIFICATION_EMAIL,
      subject,
      html,
      text,
      reply_to: env.FROM_EMAIL,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend send failed (${res.status}): ${body}`);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function adminHtml(input: AdminEmailInput): string {
  const dateLong = formatDateLong(input.date);
  const row = (label: string, value: string): string =>
    `<tr><td style="padding:6px 12px 6px 0;font-size:12px;color:#6b6b6b;text-transform:uppercase;letter-spacing:1px;vertical-align:top;width:120px;">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${value}</td></tr>`;

  const meetRow = input.meetLink
    ? row(
        "Meet",
        `<a href="${escapeHtml(input.meetLink)}" style="color:#8b6f47;">${escapeHtml(input.meetLink)}</a>`
      )
    : "";
  const eventRow = input.htmlLink
    ? row(
        "Event",
        `<a href="${escapeHtml(input.htmlLink)}" style="color:#8b6f47;">Open in Google Calendar</a>`
      )
    : "";
  const brokenHtml = escapeHtml(input.broken).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f3ec;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f3ec;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#fffaf0;border:1px solid #e4dccb;border-radius:8px;">
      <tr><td style="padding:28px 32px 12px 32px;">
        <p style="margin:0 0 4px 0;font-size:11px;color:#8b6f47;letter-spacing:3px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Code-Rescue · New Booking</p>
        <h1 style="margin:8px 0 0 0;font-size:20px;font-weight:400;color:#1a1a1a;">${escapeHtml(input.company)} — ${escapeHtml(dateLong)} at ${escapeHtml(input.time)}</h1>
      </td></tr>
      <tr><td style="padding:16px 32px 8px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row("Date", `${escapeHtml(dateLong)}`)}
          ${row("Time", `${escapeHtml(input.time)} (${escapeHtml(input.timezone)})`)}
          ${row("Company", escapeHtml(input.company))}
          ${row("Role", escapeHtml(input.role))}
          ${input.size ? row("Team size", escapeHtml(input.size)) : ""}
          ${input.stack ? row("Stack", escapeHtml(input.stack)) : ""}
          ${input.deliverable ? row("Deliverable", escapeHtml(input.deliverable)) : ""}
          ${input.timeline ? row("Timeline", escapeHtml(input.timeline)) : ""}
          ${meetRow}
          ${eventRow}
          ${row("Booking ID", `<code style="font-size:12px;color:#6b6b6b;">${escapeHtml(input.bookingId)}</code>`)}
        </table>
      </td></tr>
      <tr><td style="padding:16px 32px 28px 32px;border-top:1px solid #e4dccb;">
        <p style="margin:0 0 6px 0;font-size:12px;color:#6b6b6b;text-transform:uppercase;letter-spacing:1px;font-family:Helvetica,Arial,sans-serif;">What's broken</p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#1a1a1a;">${brokenHtml}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function adminText(input: AdminEmailInput): string {
  const lines: string[] = [];
  lines.push(`New Code-Rescue booking.`);
  lines.push(``);
  lines.push(`Date:    ${formatDateLong(input.date)}`);
  lines.push(`Time:    ${input.time} (${input.timezone})`);
  lines.push(`Company: ${input.company}`);
  lines.push(`Role:    ${input.role}`);
  if (input.size) lines.push(`Size:    ${input.size}`);
  if (input.stack) lines.push(`Stack:   ${input.stack}`);
  if (input.deliverable) lines.push(`Deliv:   ${input.deliverable}`);
  if (input.timeline) lines.push(`Timeline:${input.timeline}`);
  if (input.meetLink) lines.push(`Meet:    ${input.meetLink}`);
  if (input.htmlLink) lines.push(`Event:   ${input.htmlLink}`);
  lines.push(`ID:      ${input.bookingId}`);
  lines.push(``);
  lines.push(`What's broken:`);
  lines.push(input.broken);
  return lines.join("\n");
}
