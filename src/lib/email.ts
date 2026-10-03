import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { siteConfig } from "@/lib/site";
import { createGoogleCalendarUrl, createIcsCalendarContent } from "@/lib/calendar";

export interface LeadEmailPayload {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  propertyType?: string | null;
  electricityBill?: string | null;
  interestedService?: string | null;
  systemSizeInterest?: string | null;
  batteryRequired?: boolean | null;
  message?: string | null;
  preferredDate?: string | null;
  preferredTimeSlot?: string | null;
  consultationType?: string | null;
  source?: string | null;
}

let cachedTransporter: Transporter | null = null;

/**
 * Safely reads an environment variable, trimming whitespace and stripping any accidental
 * surrounding quotes (e.g. when copied into Vercel/cloud dashboards).
 */
export function getCleanEnv(key: string): string {
  const val = process.env[key];
  if (!val) return "";
  let trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

/**
 * Checks whether SMTP environment variables are configured.
 */
export function isSmtpConfigured(): boolean {
  return Boolean(
    getCleanEnv("SMTP_HOST") &&
    getCleanEnv("SMTP_USER") &&
    getCleanEnv("SMTP_PASS")
  );
}

/**
 * Creates or retrieves the Nodemailer Transporter.
 * In serverless environments (such as Vercel / AWS Lambda), connection pooling (`pool: true`)
 * causes socket freezes and dead connections between invocations. Direct connections (`pool: false`)
 * ensure reliable delivery.
 */
export function getMailTransporter(): Transporter | null {
  if (!isSmtpConfigured()) {
    return null;
  }

  const host = getCleanEnv("SMTP_HOST");
  const rawPort = getCleanEnv("SMTP_PORT");
  const port = Number(rawPort) || 465;
  const secureEnv = getCleanEnv("SMTP_SECURE");
  const isSecure = secureEnv !== ""
    ? secureEnv === "true" || secureEnv === "1"
    : port === 465;

  const user = getCleanEnv("SMTP_USER");
  const pass = getCleanEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    // Avoid socket pooling in serverless environments:
    // Pooled connections freeze during container sleep and fail on subsequent requests.
    pool: false,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Helper to escape HTML characters from user input to prevent injection in emails.
 */
function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends a notification email to the admin / business inbox with all details of the enquiry.
 */
export async function sendLeadNotificationToAdmin(lead: LeadEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = getMailTransporter();
  if (!transporter) {
    console.warn("[email] SMTP is not configured. Skipping admin lead email notification.");
    return { success: false, error: "SMTP not configured" };
  }

  const userEmail = getCleanEnv("SMTP_USER") || siteConfig.email || "services@hujurat.com.au";
  const to = getCleanEnv("SMTP_TO") || userEmail;

  // Extract the authenticated email address (e.g. services@hujurat.com.au)
  const rawFrom = getCleanEnv("SMTP_FROM");
  const fromMatch = rawFrom.match(/<([^>]+)>/);
  const systemEmail = (fromMatch ? fromMatch[1].trim() : null) || userEmail;

  // Sanitize the submitter's name so it can be safely used in the RFC 5322 From header
  const cleanCustomerName = (lead.name || "").replace(/["\r\n\\]/g, "").trim();

  // Show the exact customer name who submitted the form from your website as the sender in your mailbox
  const from = cleanCustomerName
    ? `"${cleanCustomerName}" <${systemEmail}>`
    : (rawFrom || `"${siteConfig.shortName}" <${systemEmail}>`);

  const safeName = escapeHtml(lead.name);
  const safeEmail = escapeHtml(lead.email);
  const safePhone = escapeHtml(lead.phone);
  const safeSuburb = escapeHtml(lead.suburb);
  const safePropertyType = escapeHtml(lead.propertyType || "Residential");
  const safeService = escapeHtml(lead.interestedService || "General Enquiry");
  const safeBill = escapeHtml(lead.electricityBill || "Not specified");
  const safeBattery = lead.batteryRequired ? "Yes (Interested in Battery Storage)" : "No";
  const safeMessage = escapeHtml(lead.message || "No additional message provided.").replace(/\n/g, "<br>");
  const safeSource = escapeHtml(lead.source || "Website Form");
  const submittedAt = new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney", dateStyle: "full", timeStyle: "short" });

  const hasBooking = Boolean(lead.preferredDate);
  const calendarEvent = {
    title: `Solar Assessment & Consultation: ${lead.name}`,
    description: `Hujurat Solar Consultation with ${lead.name}.\nContact: ${lead.phone} | ${lead.email}\nService: ${lead.interestedService || "Solar & Battery Package"}\nType: ${lead.consultationType || "On-Site Solar Assessment"}\nSuburb: ${lead.suburb}\nNotes: ${lead.message || "None"}`,
    dateStr: lead.preferredDate || undefined,
    timeSlot: lead.preferredTimeSlot || undefined,
    location: lead.suburb ? `${lead.suburb}, NSW, Australia` : siteConfig.address,
  };
  const adminGoogleCalUrl = createGoogleCalendarUrl(calendarEvent);
  const icsContent = createIcsCalendarContent(calendarEvent);

  const bookingSectionHtml = hasBooking
    ? `
      <div class="section-title">Requested Consultation &amp; Assessment</div>
      <table class="data-table">
        <tr>
          <td class="label">Consultation Type</td>
          <td class="value"><strong>${escapeHtml(lead.consultationType || "On-Site Solar Assessment")}</strong></td>
        </tr>
        <tr>
          <td class="label">Requested Date</td>
          <td class="value"><span style="color: #16a34a; font-weight: 700;">📅 ${escapeHtml(lead.preferredDate)}</span></td>
        </tr>
        <tr>
          <td class="label">Time Slot</td>
          <td class="value">${escapeHtml(lead.preferredTimeSlot || "Flexible / Business Hours")}</td>
        </tr>
      </table>
    `.trim()
    : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Solar Lead Enquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background-color: #020617; padding: 28px 32px; border-bottom: 3px solid #f59e0b; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 20px; background-color: #fef3c7; color: #b45309; }
    .content { padding: 32px; }
    .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 12px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .data-table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    .data-table td.label { width: 35%; color: #64748b; font-weight: 600; }
    .data-table td.value { color: #0f172a; font-weight: 500; }
    .message-box { background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 24px; }
    .action-bar { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
    .btn-call { background-color: #020617; color: #ffffff; }
    .btn-reply { background-color: #f59e0b; color: #020617; }
    .btn-calendar { background-color: #16a34a; color: #ffffff; }
    .footer { background-color: #f8fafc; padding: 16px 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">New Solar Lead</span>
      <h1>${safeName} — ${safeSuburb}</h1>
      <p>Received on ${submittedAt} (AEST)</p>
    </div>
    <div class="content">
      <div class="section-title">Customer Contact Details</div>
      <table class="data-table">
        <tr>
          <td class="label">Full Name</td>
          <td class="value"><strong>${safeName}</strong></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Phone Number</td>
          <td class="value"><a href="tel:${safePhone}" style="color: #0f172a; font-weight: 700; text-decoration: none;">${safePhone}</a></td>
        </tr>
        <tr>
          <td class="label">Suburb / Location</td>
          <td class="value">${safeSuburb}</td>
        </tr>
      </table>

      ${bookingSectionHtml}

      <div class="section-title">Property &amp; System Requirements</div>
      <table class="data-table">
        <tr>
          <td class="label">Property Type</td>
          <td class="value">${safePropertyType}</td>
        </tr>
        <tr>
          <td class="label">Interested Service</td>
          <td class="value">${safeService}</td>
        </tr>
        <tr>
          <td class="label">Quarterly Bill</td>
          <td class="value">${safeBill}</td>
        </tr>
        <tr>
          <td class="label">Battery Storage</td>
          <td class="value">${safeBattery}</td>
        </tr>
        <tr>
          <td class="label">Lead Source</td>
          <td class="value">${safeSource}</td>
        </tr>
      </table>

      <div class="section-title">Client Message</div>
      <div class="message-box">
        ${safeMessage}
      </div>

      <div style="margin-top: 24px;">
        <a href="tel:${safePhone}" class="btn btn-call" style="color: #ffffff; text-decoration: none; margin-right: 8px;">📞 Call ${safePhone}</a>
        <a href="mailto:${safeEmail}?subject=Re: Your Solar Enquiry with Hujurat Solar" class="btn btn-reply" style="color: #020617; text-decoration: none; margin-right: 8px;">✉️ Reply via Email</a>
        ${hasBooking ? `<a href="${adminGoogleCalUrl}" target="_blank" class="btn btn-calendar" style="color: #ffffff; text-decoration: none;">📅 Add to Google Calendar</a>` : ""}
      </div>
    </div>
    <div class="footer">
      This notification was automatically sent by the ${siteConfig.name} website.
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
NEW SOLAR LEAD ENQUIRY
======================
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Suburb: ${lead.suburb}
Property: ${lead.propertyType || "Residential"}
Service: ${lead.interestedService || "General Enquiry"}
Quarterly Bill: ${lead.electricityBill || "Not specified"}
Battery Required: ${lead.batteryRequired ? "Yes" : "No"}
${hasBooking ? `Requested Consultation: ${lead.preferredDate} (${lead.preferredTimeSlot || "Flexible"}) - ${lead.consultationType || "On-Site"}` : ""}
${hasBooking ? `Add to Google Calendar: ${adminGoogleCalUrl}` : ""}
Lead Source: ${lead.source || "Website Form"}

Message:
${lead.message || "No additional message."}

Submitted: ${submittedAt}
  `.trim();

  try {
    const info = await transporter.sendMail({
      from,
      to,
      replyTo: cleanCustomerName ? `"${cleanCustomerName}" <${lead.email}>` : lead.email,
      subject: `⚡ New Solar Lead: ${lead.name} (${lead.suburb}) - ${lead.email}`,
      text,
      html,
      attachments: hasBooking
        ? [
            {
              filename: "solar-consultation.ics",
              content: icsContent,
              contentType: "text/calendar; charset=utf-8; method=REQUEST",
            },
          ]
        : [],
    });
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[email] Failed to send admin lead notification:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Sends a branded, polite confirmation email to the user / client who submitted the enquiry.
 */
export async function sendLeadConfirmationToUser(lead: LeadEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const transporter = getMailTransporter();
  if (!transporter) {
    return { success: false, error: "SMTP not configured" };
  }

  const userEmail = getCleanEnv("SMTP_USER") || siteConfig.email || "services@hujurat.com.au";
  const rawFrom = getCleanEnv("SMTP_FROM");
  const fromMatch = rawFrom.match(/<([^>]+)>/);
  const systemEmail = (fromMatch ? fromMatch[1].trim() : null) || userEmail;
  const from = rawFrom || `"${siteConfig.shortName}" <${systemEmail}>`;
  const safeName = escapeHtml(lead.name);
  const safeService = escapeHtml(lead.interestedService || "solar and battery solutions");

  const hasBooking = Boolean(lead.preferredDate);
  const calendarEvent = {
    title: `Hujurat Solar Consultation (${lead.consultationType || "Assessment"})`,
    description: `Your solar assessment & consultation with Hujurat Solar.\nType: ${lead.consultationType || "On-Site Solar Assessment"}\nService: ${lead.interestedService || "Solar & Battery Package"}\nPhone: ${siteConfig.phoneDisplay} / ${siteConfig.phoneMobileDisplay}\nEmail: ${siteConfig.email}`,
    dateStr: lead.preferredDate || undefined,
    timeSlot: lead.preferredTimeSlot || undefined,
    location: lead.suburb ? `${lead.suburb}, NSW` : siteConfig.address,
  };
  const clientGoogleCalUrl = createGoogleCalendarUrl(calendarEvent);
  const icsContent = createIcsCalendarContent(calendarEvent);

  const bookingCardHtml = hasBooking
    ? `
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 0.05em;">
          📅 Requested Consultation Booking
        </p>
        <p style="margin: 0 0 4px; font-size: 14px; color: #14532d;">
          <strong>Date:</strong> ${escapeHtml(lead.preferredDate)} ${lead.preferredTimeSlot ? `(${escapeHtml(lead.preferredTimeSlot)})` : ""}
        </p>
        <p style="margin: 0 0 14px; font-size: 14px; color: #14532d;">
          <strong>Type:</strong> ${escapeHtml(lead.consultationType || "On-Site Solar Assessment")}
        </p>
        <a href="${clientGoogleCalUrl}" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 18px; border-radius: 8px;">
          📅 Add to Google Calendar
        </a>
      </div>
    `.trim()
    : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Thank You for Contacting Hujurat Solar</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background-color: #020617; padding: 28px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #f59e0b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
    .content { padding: 32px; line-height: 1.6; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .message { font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px; }
    .contact-box { background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 18px 20px; margin-top: 24px; }
    .contact-box p { margin: 0 0 8px; font-size: 13px; color: #92400e; font-weight: 600; }
    .contact-numbers { font-size: 14px; color: #78350f; }
    .contact-numbers a { color: #b45309; font-weight: 700; text-decoration: none; }
    .footer { background-color: #f1f5f9; padding: 18px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hujurat Solar</h1>
      <p>Supply &amp; Install</p>
    </div>
    <div class="content">
      <div class="greeting">Hi ${safeName},</div>
      <p class="message">
        We have successfully received your inquiry. Our solar and energy storage experts are currently reviewing your mail. We will contact you very soon.
      </p>

      ${bookingCardHtml}

      <div class="contact-box">
        <p>Need urgent assistance or have immediate questions?</p>
        <div class="contact-numbers">
          Office: <a href="tel:${siteConfig.phone}">${siteConfig.phoneDisplay}</a><br>
          Mobile: <a href="tel:${siteConfig.phoneMobile}">${siteConfig.phoneMobileDisplay}</a><br>
          Email: <a href="mailto:${siteConfig.email}">${siteConfig.email}</a>
        </div>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.<br>
      Serving Sydney, Parramatta, and Western Sydney.
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Hi ${lead.name},

We have successfully received your inquiry. Our solar and energy storage experts are currently reviewing your mail. We will contact you very soon.
${hasBooking ? `\nRequested Consultation:\nDate: ${lead.preferredDate} (${lead.preferredTimeSlot || "Flexible"})\nType: ${lead.consultationType || "On-Site"}\nAdd to Google Calendar:\n${clientGoogleCalUrl}\n` : ""}
If you have any questions in the meantime, feel free to contact us:
Office: ${siteConfig.phoneDisplay} (${siteConfig.phone})
Mobile: ${siteConfig.phoneMobileDisplay} (${siteConfig.phoneMobile})
Email: ${siteConfig.email}

Kind regards,
Hujurat Solar Supply & Install Team
https://www.hujuratsolar.com.au
  `.trim();

  try {
    const info = await transporter.sendMail({
      from,
      to: lead.email,
      replyTo: siteConfig.email,
      subject: `Thank you for your enquiry | ${siteConfig.shortName}`,
      text,
      html,
      attachments: hasBooking
        ? [
            {
              filename: "hujurat-solar-consultation.ics",
              content: icsContent,
              contentType: "text/calendar; charset=utf-8; method=REQUEST",
            },
          ]
        : [],
    });
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[email] Failed to send client confirmation email:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * High-level orchestration that sends both the admin notification and client confirmation in parallel.
 * Won't throw: errors are caught and logged so user experience is not disrupted.
 */
export async function sendLeadEmails(lead: LeadEmailPayload): Promise<{
  adminSent: boolean;
  clientSent: boolean;
  adminError?: string;
  clientError?: string;
}> {
  if (!isSmtpConfigured()) {
    console.warn(
      "[email] SMTP is not configured in this environment (missing SMTP_HOST, SMTP_USER, or SMTP_PASS). Skipping email dispatch."
    );
    return { adminSent: false, clientSent: false, adminError: "SMTP not configured" };
  }

  const [adminResult, clientResult] = await Promise.allSettled([
    sendLeadNotificationToAdmin(lead),
    sendLeadConfirmationToUser(lead),
  ]);

  const adminSent = adminResult.status === "fulfilled" && adminResult.value.success;
  const clientSent = clientResult.status === "fulfilled" && clientResult.value.success;
  const adminError = adminResult.status === "fulfilled" ? adminResult.value.error : String(adminResult.reason);
  const clientError = clientResult.status === "fulfilled" ? clientResult.value.error : String(clientResult.reason);

  if (!adminSent) {
    console.error("[email] Admin lead email notification failed:", adminError);
  }
  if (!clientSent) {
    console.warn("[email] Client confirmation email failed:", clientError);
  }

  return { adminSent, clientSent, adminError, clientError };
}

/**
 * Tests the SMTP credentials and server connectivity.
 */
export async function verifySmtpConnection(): Promise<{ ok: boolean; message: string }> {
  if (!isSmtpConfigured()) {
    return {
      ok: false,
      message: "SMTP is not fully configured. Please ensure SMTP_HOST, SMTP_USER, and SMTP_PASS are set in your environment.",
    };
  }

  const transporter = getMailTransporter();
  if (!transporter) {
    return { ok: false, message: "Could not initialize mail transporter." };
  }

  try {
    await transporter.verify();
    return { ok: true, message: "SMTP server connection and authentication successful!" };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `SMTP connection failed: ${errorMsg}` };
  }
}
