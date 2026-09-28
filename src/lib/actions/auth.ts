"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { clearSessionCookie, safeDashboardPath, setSessionCookie } from "@/lib/auth";
import { consumeRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

/**
 * Sign-in hardening:
 * - Per-account and per-IP rate limits blunt online password guessing. The
 *   per-account counter is not IP-scoped so a distributed attempt against one
 *   administrator still trips it.
 * - A bcrypt comparison runs even when the account does not exist, so response
 *   timing cannot be used to enumerate administrator emails.
 * - Failures return a single generic message (never "unknown email").
 * - The post-login redirect target is reduced to a same-app /dashboard path.
 */
const PER_ACCOUNT_LIMIT = 10;
const PER_ACCOUNT_WINDOW_MS = 15 * 60 * 1000;
const PER_IP_LIMIT = 30;
const PER_IP_WINDOW_MS = 15 * 60 * 1000;

/** Valid bcrypt hash of a random throwaway value (never matches a real password). */
const DUMMY_PASSWORD_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

const INVALID_CREDENTIALS = "Invalid email or password.";

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  if (!formData || typeof formData.get !== "function") {
    return { error: INVALID_CREDENTIALS };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase().slice(0, 255);
  const password = String(formData.get("password") || "").slice(0, 200);
  const next = safeDashboardPath(formData.get("next"));

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const clientIp = getClientIp(await headers());
  const accountKey = `login:account:${email}`;
  const ipKey = `login:ip:${clientIp}`;

  const accountLimit = consumeRateLimit(accountKey, PER_ACCOUNT_LIMIT, PER_ACCOUNT_WINDOW_MS);
  const ipLimit = consumeRateLimit(ipKey, PER_IP_LIMIT, PER_IP_WINDOW_MS);

  if (!accountLimit.ok || !ipLimit.ok) {
    const retryAfterSeconds = Math.max(accountLimit.retryAfterSeconds, ipLimit.retryAfterSeconds);
    const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
    return { error: `Too many sign-in attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` };
  }

  const rows = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  const admin = rows[0];

  // Always hash-compare: identical work for "no such user" and "wrong password".
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_PASSWORD_HASH);

  if (!admin || !valid) {
    return { error: INVALID_CREDENTIALS };
  }

  resetRateLimit(accountKey);

  await setSessionCookie({ adminId: admin.id, email: admin.email, name: admin.name });
  redirect(next);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/dashboard/login");
}

