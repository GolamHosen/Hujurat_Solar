/**
 * Small in-process fixed-window rate limiter.
 *
 * Purpose: brute-force protection for the admin login and abuse protection for
 * the public lead endpoint (both are unauthenticated entry points).
 *
 * Limitations (documented on purpose):
 * - State lives in memory, so it is per-instance. On a multi-instance /
 *   serverless deployment each instance keeps its own counters; pair this with a
 *   shared store (e.g. Upstash Redis) if you need hard global limits.
 * - The client IP is taken from proxy headers, which are only trustworthy when
 *   the app runs behind a proxy that overwrites them. A global fallback counter
 *   is therefore always applied alongside the per-IP counter.
 */

type Bucket = { count: number; resetAt: number };

const MAX_TRACKED_KEYS = 10_000;

const globalForRateLimit = globalThis as typeof globalThis & {
  __hujuratRateLimits?: Map<string, Bucket>;
};

function getStore(): Map<string, Bucket> {
  if (!globalForRateLimit.__hujuratRateLimits) {
    globalForRateLimit.__hujuratRateLimits = new Map<string, Bucket>();
  }
  return globalForRateLimit.__hujuratRateLimits;
}

function pruneExpired(store: Map<string, Bucket>, now: number): void {
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/** Records one hit against `key` and reports whether the caller is still under the limit. */
export function consumeRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const store = getStore();
  const now = Date.now();

  if (store.size > MAX_TRACKED_KEYS) pruneExpired(store, now);

  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  bucket.count += 1;

  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  return { ok: true, remaining: Math.max(0, limit - bucket.count), retryAfterSeconds };
}

/** Clears a bucket — call after a successful login so a good password resets the counter. */
export function resetRateLimit(key: string): void {
  getStore().delete(key);
}

/** Best-effort client IP for rate-limit keys (spoofable unless behind a trusted proxy). */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return (
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-vercel-forwarded-for")?.trim() ||
    "unknown"
  );
}
