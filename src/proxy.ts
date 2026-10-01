import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, safeDashboardPath, verifySessionToken } from "@/lib/auth";
import {
  CSP_HEADER,
  NONCE_HEADER,
  buildDashboardCsp,
  buildPublicSiteCsp,
  generateNonce,
  isCspEnabled,
} from "@/lib/csp";

/**
 * Edge/Node request boundary (Next.js 16 replaces `middleware.ts` with `proxy.ts`).
 *
 * Responsibilities:
 * 1. Authentication gate for `/dashboard/**` (page navigations AND Server Action
 *    POSTs to those routes).
 * 2. Content-Security-Policy for HTML responses — nonce-based on the dashboard,
 *    pragmatic-but-hardened on the public site.
 *
 * This is defence in depth, not the only protection: every Server Action and the
 * dashboard layout independently re-verify the session, because Server Actions
 * are publicly reachable endpoints that must never rely on middleware alone.
 */

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const DASHBOARD_ROOT = "/dashboard";
const LOGIN_PATH = "/dashboard/login";

function isDashboardPath(pathname: string): boolean {
  return pathname === DASHBOARD_ROOT || pathname.startsWith(`${DASHBOARD_ROOT}/`);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboard = isDashboardPath(pathname);

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = isDashboard && token ? await verifySessionToken(token) : null;

  // --- 1. Authentication gate -------------------------------------------------
  if (isDashboard && pathname !== LOGIN_PATH && !session) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);

    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set("cache-control", "no-store");
    return redirectResponse;
  }

  // Already signed in? Skip the login screen.
  if (pathname === LOGIN_PATH && session) {
    return NextResponse.redirect(new URL(safeDashboardPath(request.nextUrl.searchParams.get("next")), request.url));
  }

  if (!isCspEnabled()) {
    return NextResponse.next();
  }

  // --- 2. Content-Security-Policy ---------------------------------------------
  // The dashboard is already dynamic (it reads the session cookie), so a fresh
  // nonce per request costs nothing and lets us drop 'unsafe-inline' for scripts.
  if (IS_PRODUCTION && isDashboard) {
    const nonce = generateNonce();
    const csp = buildDashboardCsp(nonce);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(CSP_HEADER, csp); // Next.js reads the nonce from the request headers
    requestHeaders.set(NONCE_HEADER, nonce);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set(CSP_HEADER, csp);
    response.headers.set("cache-control", "no-store");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set(CSP_HEADER, buildPublicSiteCsp({ development: !IS_PRODUCTION }));
  return response;
}

export const config = {
  /**
   * Runs on HTML routes only. Static assets, the image optimiser, uploaded media
   * and API routes are excluded — they are not documents and their security
   * headers are set in next.config.ts.
   */
  matcher: [
    "/((?!api/|_next/|images/|uploads/|favicon.ico|solar-logo.png|site.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
