/**
 * Content-Security-Policy construction.
 *
 * The app renders no third-party scripts, no iframes and self-hosted fonts, so a
 * strict policy is achievable:
 * - `/dashboard/*` uses a per-request nonce. Those routes are already dynamic
 *   (they read the session cookie), so the nonce costs nothing in caching terms
 *   and removes the need for `'unsafe-inline'` in `script-src`.
 * - The public marketing pages keep a pragmatic policy (no nonce) because
 *   Next.js hydration payloads are inline scripts and the JSON-LD blocks must
 *   never be altered. It still blocks external script injection, plugin/object
 *   embedding, `<base>` hijacking, framing and cross-origin form exfiltration.
 *
 * Set `SECURITY_CSP=off` to disable (emergency escape hatch only).
 */

const DIRECTIVES_COMMON = [
  "style-src 'self' 'unsafe-inline'", // framer-motion / Next.js inline styles
  "img-src 'self' data: blob: https:", // next/image + CMS images on https hosts
  "media-src 'self' blob: https:",
  "font-src 'self' data:", // next/font self-hosts the webfonts
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
];

export const CSP_HEADER = "content-security-policy";
export const NONCE_HEADER = "x-nonce";

export function isCspEnabled(): boolean {
  return process.env.SECURITY_CSP !== "off";
}

/** Cryptographically random per-request nonce (base64, CSP-safe). */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary);
}

/** Strict, nonce-based policy for the authenticated admin dashboard. */
export function buildDashboardCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    ...DIRECTIVES_COMMON,
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * Policy for the public site. `'unsafe-inline'` is limited to scripts because
 * Next.js streams its RSC payload through inline <script> tags on every page.
 *
 * @param options.development adds what the Next.js dev overlay / HMR needs
 *   (`'unsafe-eval'` and websocket connections) and drops
 *   `upgrade-insecure-requests` so http://localhost keeps working.
 */
export function buildPublicSiteCsp(options: { development?: boolean } = {}): string {
  if (options.development) {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      ...DIRECTIVES_COMMON.filter((directive) => !directive.startsWith("connect-src")),
      "connect-src 'self' ws: wss:", // HMR / React Fast Refresh websockets
    ].join("; ");
  }

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    ...DIRECTIVES_COMMON,
    "upgrade-insecure-requests",
  ].join("; ");
}
