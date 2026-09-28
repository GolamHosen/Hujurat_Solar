import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hujuratsolar.com.au";

function siteHostname(): string {
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return "www.hujuratsolar.com.au";
  }
}

/**
 * next/image allow-list.
 *
 * A wildcard hostname (`"**"`) turns `/_next/image?url=...` into an open image
 * proxy: anyone could make the server fetch arbitrary remote URLs (bandwidth
 * abuse plus an SSRF foothold into whatever the server can reach). Only the
 * site's own host, the storage providers actually in use, and hosts listed in
 * NEXT_PUBLIC_IMAGE_HOSTS are permitted.
 */
function imageRemotePatterns(): { protocol: "https"; hostname: string; pathname: string }[] {
  const hostnames = new Set<string>([
    siteHostname(),
    "**.supabase.co",
    "**.supabase.in",
    "res.cloudinary.com",
  ]);

  for (const entry of (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "").split(",")) {
    const hostname = entry.trim();
    if (hostname) hostnames.add(hostname);
  }

  return [...hostnames].map((hostname) => ({ protocol: "https" as const, hostname, pathname: "/**" }));
}

/** Extra origins allowed to invoke Server Actions (needed only behind a proxy/CDN). */
const serverActionOrigins = (process.env.SERVER_ACTION_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/**
 * Security headers applied to every response. The Content-Security-Policy is
 * emitted per-request in `src/proxy.ts` because the dashboard uses a nonce.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in responses.
  poweredByHeader: false,

  // Catches bugs early (double-renders only in dev, zero cost in prod).
  reactStrictMode: true,

  images: {
    // Modern formats improve Largest Contentful Paint (a Core Web Vitals ranking signal).
    formats: ["image/avif", "image/webp"],
    remotePatterns: imageRemotePatterns(),
  },

  // ── Performance: reduce dev-server filesystem pressure ──
  experimental: {
    // Opt into the Rust-based CSS/module optimizer for faster cold starts.
    webpackMemoryOptimizations: true,
    serverActions: {
      // Media uploads exceed the 1 MB default; kept just above the 8 MB upload cap.
      bodySizeLimit: "10mb",
      ...(serverActionOrigins.length > 0 ? { allowedOrigins: serverActionOrigins } : {}),
    },
  },

  // Suppress noisy per-request compilation logs that themselves hit the FS.
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // Uploaded media is untrusted content: never let a browser sniff a
        // different content type or treat the file as a document.
        source: "/uploads/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Content-Security-Policy", value: "default-src 'none'; sandbox" },
        ],
      },
      {
        source: "/dashboard/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

