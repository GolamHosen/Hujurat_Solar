import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

/**
 * Admin session handling.
 *
 * Security model (see SECURITY.md):
 * - The session is a short-lived, signed (HS256) JWT stored in an httpOnly,
 *   SameSite=Strict, Secure-in-production cookie.
 * - The signing secret is REQUIRED. There is no hard-coded fallback: a missing
 *   or weak secret fails closed (token verification always returns `null`) and
 *   fails loudly when a token is minted, so a misconfigured deployment can
 *   never be impersonated with a publicly known key.
 * - Tokens are bound to an issuer + audience and validated against an explicit
 *   payload schema, so foreign or hand-crafted JWTs are rejected.
 * - `requireAdminSession()` is the single authorization primitive used by every
 *   mutating Server Action (Server Actions are public HTTP endpoints).
 */

const SESSION_COOKIE = "hujurat_admin_session";
const SESSION_ISSUER = "hujurat-solar-platform";
const SESSION_AUDIENCE = "hujurat-admin-dashboard";
const MIN_SECRET_LENGTH = 32;
const DEFAULT_TTL_HOURS = 24;
const MAX_TTL_HOURS = 24 * 30;

export class UnauthorizedError extends Error {
  constructor(message = "Administrator sign-in required.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

/** Resolves the signing secret. Throws when missing/weak (no insecure default). */
function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      [
        "SESSION_SECRET is missing or too weak (minimum 32 characters).",
        "Generate one with:",
        '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64url\'))"',
        "Then add it to .env and restart the server.",
      ].join("\n"),
    );
  }

  return secret;
}

function getEncodedKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

function getSessionTtlSeconds(): number {
  const configured = Number(process.env.SESSION_TTL_HOURS);
  const hours =
    Number.isFinite(configured) && configured > 0 ? Math.min(configured, MAX_TTL_HOURS) : DEFAULT_TTL_HOURS;
  return Math.floor(hours * 60 * 60);
}

const sessionPayloadSchema = z.object({
  adminId: z.number().int().positive(),
  email: z.string().min(3).max(255),
  name: z.string().max(255).default("Admin"),
});

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);

  return new SignJWT({ adminId: payload.adminId, email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt(issuedAt)
    .setJti(crypto.randomUUID())
    .setExpirationTime(issuedAt + getSessionTtlSeconds())
    .sign(getEncodedKey());
}

/** Verifies a token. Never throws — an invalid/misconfigured token fails closed. */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || token.length > 4096) return null;

  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });

    const parsed = sessionPayloadSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionTtlSeconds(),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Authorization guard for Server Actions / Route Handlers / protected layouts.
 * Server Actions are reachable by anyone who can call the app, so every mutating
 * action must call this before touching the database or the filesystem.
 */
export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

/**
 * Only allows same-app admin paths, so a crafted `?next=` value can never turn
 * the login form into an open redirect.
 */
export function safeDashboardPath(value: unknown, fallback = "/dashboard"): string {
  const raw = typeof value === "string" ? value.trim() : "";

  if (!raw || raw.startsWith("//") || raw.includes("..") || /[\\\r\n\t]/.test(raw)) return fallback;
  if (!/^\/dashboard(?:\/[\w\-.~!$&'()*+,;=:@%/?]*)?$/.test(raw)) return fallback;

  return raw;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
