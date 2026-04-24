/**
 * Resend REST client — no SDK.
 *
 * Two sends per booking (both via ctx.waitUntil so the HTTP response doesn't
 * block on them):
 *   - sendAdminNotificationEmail  → always, to the operator
 *   - sendBookerConfirmationEmail → when Google Calendar event creation
 *     succeeded (so we have a Meet link / reschedule link to hand back)
 */

import type { Env } from "./types";
import { formatDateLong } from "./time";

const RESEND_URL = "https://api.resend.com/emails";

export interface AdminEmailInput {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
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

export interface BookerConfirmationInput {
  bookingId: string;
  toEmail: string;
  toName: string;
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

  const subject = `[Code-Rescue] New booking — ${input.name} · ${input.company} · ${input.date}`;
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
      reply_to: input.email || env.FROM_EMAIL,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend admin send failed (${res.status}): ${body}`);
  }
}

/**
 * Booker-facing confirmation. Editorial voice to match the site. Fires only
 * when a calendar event exists — Google's invite is the authoritative record;
 * this email is a friendly nudge + Meet link.
 */
export async function sendBookerConfirmationEmail(
  env: Env,
  input: BookerConfirmationInput
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) {
    console.warn("Resend env missing — skipping booker confirmation email");
    return;
  }

  const firstName = input.toName.split(/\s+/)[0] ?? input.toName;
  const subject = `Your Code-Rescue call is booked — ${formatDateLong(input.date)} at ${input.time}`;
  const html = bookerHtml(input, firstName);
  const text = bookerText(input, firstName);

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Maxwell Collins <${env.FROM_EMAIL}>`,
      to: input.toEmail,
      subject,
      html,
      text,
      reply_to: env.FROM_EMAIL,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend booker send failed (${res.status}): ${body}`);
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
        `<a href="${escapeHtml(input.meetLink)}" style="color:#2a5f4f;">${escapeHtml(input.meetLink)}</a>`
      )
    : "";
  const eventRow = input.htmlLink
    ? row(
        "Event",
        `<a href="${escapeHtml(input.htmlLink)}" style="color:#2a5f4f;">Open in Google Calendar</a>`
      )
    : "";
  const emailLink = `<a href="mailto:${escapeHtml(input.email)}" style="color:#2a5f4f;">${escapeHtml(input.email)}</a>`;
  const phoneLink = input.phone
    ? `<a href="tel:${escapeHtml(input.phone.replace(/\s+/g, ""))}" style="color:#2a5f4f;">${escapeHtml(input.phone)}</a>`
    : "";
  const brokenHtml = escapeHtml(input.broken).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f2ec;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f2ec;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #c8c2b2;">
      <tr><td style="padding:28px 32px 12px 32px;">
        <p style="margin:0 0 4px 0;font-size:11px;color:#8a877e;letter-spacing:3px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Code-Rescue · New Booking</p>
        <h1 style="margin:8px 0 0 0;font-size:20px;font-weight:400;color:#1a1a1a;">${escapeHtml(input.name)} · ${escapeHtml(input.company)} — ${escapeHtml(dateLong)} at ${escapeHtml(input.time)}</h1>
      </td></tr>
      <tr><td style="padding:16px 32px 8px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row("Date", `${escapeHtml(dateLong)}`)}
          ${row("Time", `${escapeHtml(input.time)} (${escapeHtml(input.timezone)})`)}
          ${row("Name", escapeHtml(input.name))}
          ${row("Email", emailLink)}
          ${phoneLink ? row("Phone", phoneLink) : ""}
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
      <tr><td style="padding:16px 32px 28px 32px;border-top:1px solid #d9d4c6;">
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
  lines.push(`Name:    ${input.name}`);
  lines.push(`Email:   ${input.email}`);
  if (input.phone) lines.push(`Phone:   ${input.phone}`);
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

function bookerHtml(input: BookerConfirmationInput, firstName: string): string {
  const dateLong = formatDateLong(input.date);
  const meetBtn = input.meetLink
    ? `<a href="${escapeHtml(input.meetLink)}" style="display:inline-block;padding:14px 28px;background:#2a5f4f;color:#f5f2ec;text-decoration:none;border-radius:2px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:500;">Join the call</a>`
    : "";
  const rescheduleHint = input.htmlLink
    ? `<p style="margin:24px 0 0 0;font-size:14px;color:#5a5a54;font-family:Georgia,'Times New Roman',serif;">Need to reschedule? Use the one-click link in your calendar invite, or reply to this email.</p>`
    : `<p style="margin:24px 0 0 0;font-size:14px;color:#5a5a54;font-family:Georgia,'Times New Roman',serif;">Need to reschedule? Just reply to this email.</p>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f2ec;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f2ec;">
  <tr><td align="center" style="padding:48px 16px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #c8c2b2;">
      <tr><td style="padding:40px 44px 12px 44px;">
        <p style="margin:0 0 4px 0;font-size:11px;color:#8a877e;letter-spacing:3px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Code-Rescue</p>
        <h1 style="margin:12px 0 0 0;font-size:28px;font-weight:500;color:#1a1a1a;letter-spacing:-0.01em;">You're booked, ${escapeHtml(firstName)}.</h1>
      </td></tr>
      <tr><td style="padding:16px 44px 8px 44px;">
        <p style="margin:0 0 18px 0;font-size:17px;line-height:1.55;color:#2e2e2e;">I'll see you on <strong style="color:#2a5f4f;">${escapeHtml(dateLong)} at ${escapeHtml(input.time)}</strong>. Thirty minutes.</p>
        <p style="margin:0 0 24px 0;font-size:17px;line-height:1.55;color:#2e2e2e;">A calendar invite is in your inbox. The Meet link lives there — and here, in case it's easier:</p>
        ${meetBtn}
      </td></tr>
      <tr><td style="padding:28px 44px 40px 44px;border-top:1px solid #d9d4c6;">
        <p style="margin:0 0 14px 0;font-size:12px;color:#8a877e;letter-spacing:1px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Before we talk</p>
        <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2e2e2e;">Reply to the calendar invite (or this email) with anything you'd like me to read first. A sentence about what's breaking is plenty. No prep doc required.</p>
        <p style="margin:0;font-size:15px;line-height:1.65;color:#2e2e2e;">If we're not a fit, I'll tell you on the call and point you somewhere that is.</p>
        ${rescheduleHint}
        <p style="margin:32px 0 0 0;font-size:22px;font-style:italic;color:#1a1a1a;letter-spacing:-0.01em;">— Max</p>
        <p style="margin:4px 0 0 0;font-size:11px;color:#8a877e;letter-spacing:1px;text-transform:uppercase;font-family:Helvetica,Arial,sans-serif;">Operator, Code-Rescue · Tampa, FL</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function bookerText(input: BookerConfirmationInput, firstName: string): string {
  const lines: string[] = [];
  lines.push(`You're booked, ${firstName}.`);
  lines.push(``);
  lines.push(`${formatDateLong(input.date)} at ${input.time} — 30 minutes.`);
  lines.push(``);
  lines.push(`A calendar invite is in your inbox with the Meet link.`);
  if (input.meetLink) lines.push(`Direct: ${input.meetLink}`);
  lines.push(``);
  lines.push(`Reply to the invite (or this email) with anything you'd like me to read first.`);
  lines.push(`A sentence is plenty. No prep doc required.`);
  lines.push(``);
  lines.push(`If we're not a fit, I'll tell you on the call and point you somewhere that is.`);
  lines.push(``);
  lines.push(`— Max`);
  lines.push(`Operator, Code-Rescue · Tampa, FL`);
  return lines.join("\n");
}
