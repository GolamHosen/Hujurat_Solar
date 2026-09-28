import { db } from "@/db";
import { leads } from "@/db/schema";
import { leadFormSchema } from "@/lib/validation";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendLeadEmails } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Public lead intake — an unauthenticated write endpoint, so it is treated as
 * hostile input:
 * - same-origin check (blocks naive cross-site drive-by submissions),
 * - per-IP rate limiting (blocks spam floods of the leads table),
 * - hard body-size cap,
 * - strict Zod validation; the stored record is never echoed back.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 32 * 1024;

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const host = request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }

  const limit = consumeRateLimit(`leads:ip:${getClientIp(request.headers)}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const data = parsed.data;

  try {
    await db.insert(leads).values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      suburb: data.suburb,
      propertyType: data.propertyType,
      electricityBill: data.electricityBill,
      interestedService: data.interestedService,
      systemSizeInterest: data.systemSizeInterest,
      batteryRequired: data.batteryRequired,
      message: data.message,
      source: data.source,
    });

    // Trigger SMTP emails (admin notification + client confirmation)
    try {
      await sendLeadEmails(data);
    } catch (emailError) {
      console.error("[api/leads] Error dispatching lead emails:", emailError);
    }

    // Never echo the stored row: it holds PII and internal identifiers.
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to create lead", error);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

