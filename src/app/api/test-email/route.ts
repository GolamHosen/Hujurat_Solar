import { NextRequest, NextResponse } from "next/server";
import { isSmtpConfigured, verifySmtpConnection, sendLeadNotificationToAdmin } from "@/lib/email";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Diagnostic endpoint for SMTP connectivity.
 * Requires admin session or NODE_ENV !== "production".
 */
export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const session = await getSession();

  if (!isDev && !session) {
    return NextResponse.json({ ok: false, error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  const configured = isSmtpConfigured();
  if (!configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message: "SMTP is not configured. Missing SMTP_HOST, SMTP_USER, or SMTP_PASS.",
      environmentVariables: {
        SMTP_HOST: process.env.SMTP_HOST || "(not set)",
        SMTP_PORT: process.env.SMTP_PORT || "(default 465)",
        SMTP_SECURE: process.env.SMTP_SECURE || "(default true)",
        SMTP_USER: process.env.SMTP_USER || "(not set)",
        SMTP_PASS: process.env.SMTP_PASS ? "(configured)" : "(not set)",
        SMTP_FROM: process.env.SMTP_FROM || "(not set)",
        SMTP_TO: process.env.SMTP_TO || "(not set)",
      },
    });
  }

  const result = await verifySmtpConnection();
  return NextResponse.json({
    ok: result.ok,
    configured: true,
    message: result.message,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    user: process.env.SMTP_USER,
  });
}

/**
 * Sends a test email to the configured admin inbox.
 */
export async function POST(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const session = await getSession();

  if (!isDev && !session) {
    return NextResponse.json({ ok: false, error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  if (!isSmtpConfigured()) {
    return NextResponse.json({
      ok: false,
      error: "SMTP is not configured in .env or environment variables.",
    }, { status: 400 });
  }

  const testResult = await sendLeadNotificationToAdmin({
    name: "Test Customer",
    email: process.env.SMTP_USER || "test@example.com",
    phone: "0468 209 407",
    suburb: "Parramatta",
    propertyType: "residential",
    interestedService: "Solar & Battery Package (Test)",
    electricityBill: "$600 - $900",
    batteryRequired: true,
    message: "This is a test notification verifying that your Nodemailer SMTP configuration is working properly!",
    source: "SMTP Verification Test",
  });

  if (!testResult.success) {
    return NextResponse.json({
      ok: false,
      error: testResult.error,
    }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Test email sent successfully!",
    messageId: testResult.messageId,
  });
}
