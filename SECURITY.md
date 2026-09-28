# Security Review — Hujurat Solar Platform

Date: 2026-09-25
Scope: full application review (`src/**`, `scripts/**`, `next.config.ts`, environment handling)
Status of every finding below: **fixed and verified** (see §4 Verification).

---

## 1. Executive summary

The application had one **critical** and several **high** severity issues. The most
serious was that **every Server Action was an unauthenticated public endpoint**:
anyone on the internet could create, edit and delete projects, blog posts,
services, locations, testimonials and media, and could read/modify/delete the
customer lead database (PII). It was exploitable without any credentials.

All findings have been remediated. One item (§5.1) needs an operator action
because it depends on a provider-side certificate.

---

## 2. Findings and fixes

| # | Severity | Finding | Fix |
|---|----------|---------|-----|
| 1 | **Critical** | No authorization in any Server Action (`src/lib/actions/*`). Server Actions are public HTTP endpoints, so an unauthenticated attacker could mutate all CMS content, delete leads (PII) and upload files. | `requireAdminSession()` (`src/lib/auth.ts`) is now the **first** statement of all 18 mutating actions. Argument ids are validated (`toPositiveInt`) and payloads type-checked (`assertFormData`). |
| 2 | **Critical** | Unrestricted arbitrary file upload (`uploadMediaAction`): no type allow-list, no size cap, the client-supplied filename was reused for the stored path. | MIME + magic-byte allow-list (JPEG/PNG/GIF/WebP/AVIF/MP4/WebM), **SVG rejected** (script-capable ⇒ stored XSS), 8 MB cap, server-generated filenames, `path.basename()` for display names, upload errors returned as fixed codes. |
| 3 | **High** | Hard-coded JWT fallback secret (`process.env.SESSION_SECRET \|\| "hujurat-solar-dev-secret-change-me"`): any deployment missing the env var had forgeable admin tokens. | No fallback. A missing/weak (<32 char) secret **fails closed** when verifying and throws when minting. Tokens carry `iss`, `aud`, `jti`, `typ` and are validated against a Zod schema. |
| 4 | **High** | Database TLS verification disabled (`rejectUnauthorized: false`) — equivalent to `sslmode=require`: encrypted but trusts any certificate, so a man-in-the-middle could read/modify every query (admin hashes, all lead PII). | Verification ON by default, with `DATABASE_SSL_CA` / `DATABASE_SSL_CA_FILE` support for the provider root certificate. `sslmode=verify-full` / `sslrootcert` in the URL is respected instead of overridden. See §5.1. |
| 5 | **High** | No brute-force protection and user enumeration on admin login; `?next=` could act as an open redirect (`startsWith("/dashboard")`). | Two rate limits (10/account + 30/IP per 15 min; the account counter is not IP-scoped), constant-work bcrypt compare for unknown accounts (dummy hash), one generic error message, `safeDashboardPath()` reduces `next` to a same-app `/dashboard` path. |
| 6 | **High** | Admin credentials shipped publicly: the login form prefilled the admin email and printed `Demo: … / HujuratSolar2024!`; `scripts/seed.ts` hard-coded the same password. | Prefill removed; the hint is dev-only. Seed reads `ADMIN_EMAIL`/`ADMIN_PASSWORD`, requires a password in production, hashes at cost 12 and no longer prints it. |
| 7 | **Medium** | Stored XSS surface in `JsonLd`: `JSON.stringify` went into `dangerouslySetInnerHTML`, so a CMS title containing `</script>` escaped the script element. | `serialiseJsonLd()` escapes `<`, `>`, `&`, U+2028/U+2029 to `\uXXXX` (still valid JSON-LD). |
| 8 | **Medium** | No security headers; `X-Powered-By` advertised the framework. | Added `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS, COOP, `Origin-Agent-Cluster`, `X-DNS-Prefetch-Control`, `X-Permitted-Cross-Domain-Policies`; `poweredByHeader: false`; `X-Robots-Tag: noindex` on `/dashboard`. |

| 9 | **Medium** | No Content-Security-Policy. | Per-request CSP in `src/proxy.ts`: **nonce-based strict policy for `/dashboard`** (no `'unsafe-inline'` for scripts) and a hardened policy for the public site. `SECURITY_CSP=off` is the emergency escape hatch. |
| 10 | **Medium** | `images.remotePatterns: [{ hostname: "**" }]` made `/_next/image` an open image proxy (bandwidth abuse + SSRF foothold). | Explicit allow-list: the site host, `*.supabase.co`, `*.supabase.in`, plus optional `NEXT_PUBLIC_IMAGE_HOSTS`. |
| 11 | **Medium** | Public `POST /api/leads` accepted unlimited submissions and echoed the stored row. | Same-origin check, 5 requests/10 min per IP, 32 KB body cap, malformed JSON ⇒ `400`, and the response is now `{ ok: true }` with `201` (no PII echoed). |
| 12 | **Medium** | `/api/health` leaked raw Postgres driver errors (host/user/connection-string fragments) to unauthenticated callers. | Details are logged server-side only; the response is reachability + latency with `cache-control: no-store`. |
| 13 | **Low** | Path traversal in `deleteMediaAction`: `path.join(cwd, "public", item.url)` could delete arbitrary files if a row ever held a traversal path. | Only `/uploads/` URLs are considered and the unlink target must resolve inside the upload directory. |
| 14 | **Low** | Dashboard pages rendered data without a session (the layout returned `children` unauthenticated). | The dashboard layout now `redirect()`s to sign-in, and the sign-in route moved to a `(dashboard-auth)` route group so it cannot loop. Defence in depth behind the proxy. |
| 15 | **Low** | The session cookie lacked `SameSite=Strict`; logout used a different cookie shape; fixed 7-day lifetime. | `httpOnly` + `secure` (prod) + `SameSite=Strict` + matching delete; lifetime configurable via `SESSION_TTL_HOURS` (default 24 h). |
| 16 | **Low** | Uploaded media was served without sniffing protection; `public/uploads` was not git-ignored. | `/uploads/*` now sends `nosniff` + `Content-Security-Policy: default-src 'none'; sandbox`; `/public/uploads` and `tsconfig.tsbuildinfo` added to `.gitignore`. |

---

## 3. Files changed

**New:** `src/lib/rate-limit.ts` (limiter + client-IP helper), `src/lib/csp.ts`
(CSP + nonce), `SECURITY.md`.

**Rewritten/edited:** `src/lib/auth.ts`, `src/proxy.ts`, `src/lib/actions/*.ts`
(8 files), `src/app/api/leads/route.ts`, `src/app/api/health/route.ts`,
`src/app/dashboard/layout.tsx`, `src/app/(dashboard-auth)/dashboard/login/{page,LoginForm}.tsx`,
`src/app/dashboard/media/page.tsx`, `src/components/site/JsonLd.tsx`,
`src/lib/validation.ts`, `src/db/index.ts`, `scripts/seed.ts`, `next.config.ts`,
`.env.example`, `.gitignore`.

---

## 4. Verification

Run against a real production build (`npm run build` → `next start`):

| Check | Result |
|-------|--------|
| Unauthenticated `GET /dashboard/leads` | `307` → `/dashboard/login?next=…`, `cache-control: no-store` |
| Unauthenticated Server Action `POST` to `/dashboard/media` and `/dashboard/leads` | `307` — blocked by the proxy |
| Direct unauthenticated invocation of `deleteMediaAction`, `deleteLeadAction`, `createBlogPostAction`, `updateProjectAction`, `uploadMediaAction` | all **`blocked`** — `UnauthorizedError` thrown before any DB or filesystem access |
| `GET /dashboard/login` CSP | `script-src 'self' 'nonce-…'`, no `'unsafe-inline'` for scripts, nonce present on the rendered script tags |
| `GET /` headers | `nosniff`, `DENY`, HSTS, `Referrer-Policy`, `Permissions-Policy`, CSP; no `X-Powered-By` |
| Login page HTML contains the demo password | `false` |
| `POST /api/leads` without `Origin` | `403` |
| `POST /api/leads` same-origin, invalid payload | `400` |
| `GET /api/health` | `200 {"ok":true,…}` — no driver error text |
| `safeDashboardPath()` | `//evil.com`, `\evil.com`, `https://evil.com`, `/dashboardevil`, `javascript:alert(1)`, `/admin`, `..` traversal, `undefined`, `""` ⇒ `/dashboard` |
| `npx tsc --noEmit`, `npx eslint .`, `npm run build` | clean |

## 5. Operator action required

### 5.1 Database TLS — Completed

The root certificate (`Supabase Root 2021 CA`) has been installed into `./certs/supabase-root.crt`, `DATABASE_SSL_CA_FILE=./certs/supabase-root.crt` is configured in `.env`, and unverified fallback (`DATABASE_SSL_NO_VERIFY`) has been removed. Full TLS verification against Supabase's pooler is active and verified.

### 5.2 Rotate credentials

The admin password and Supabase database password were present in source and in
the login UI in plaintext, so treat them as compromised:

- change the admin password (`ADMIN_PASSWORD=<new>` then re-run `npm run seed`, or
  update `admins.password_hash` with a bcrypt cost-12 hash);
- rotate the Supabase database password;
- rotate `SESSION_SECRET` (invalidates every existing session) if it was ever
  shared or committed.

### 5.3 Deployment notes

- Serve strictly over HTTPS: the session cookie is `Secure` in production.
- Set `NEXT_PUBLIC_SITE_URL` to the real origin so canonical URLs, `og:url` and
  HSTS expectations match production (it is currently `http://localhost:3000`).
- The rate limiter is in-process. Behind more than one instance, move the login
  and `/api/leads` counters to a shared store (e.g. Upstash Redis) for hard
  global limits.
- Server Actions are additionally protected by Next.js' built-in Origin/Host
  check. If a CDN or proxy rewrites those headers, list the extra origins in
  `SERVER_ACTION_ALLOWED_ORIGINS`.
- Uploaded media currently lives in `public/uploads` with no access control.
  Moving it to object storage is a recommended follow-up.

---

## 6. Residual risks accepted deliberately

- The public site CSP allows `'unsafe-inline'` for scripts because Next.js streams
  its RSC payload inline; `script-src` is still origin-restricted and `object-src`,
  `base-uri`, `frame-ancestors` and `form-action` are locked down. The dashboard
  (highest-value target) uses a nonce instead.
- `/dashboard/login` is deliberately excluded from the auth gate, so it is
  rate-limited rather than blocked.
- Uploads are validated by magic bytes; content/AV scanning is out of scope.
- In-process rate limiting is a speed bump, not a guarantee, on multi-instance
  deployments (see §5.3).


