"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, PhoneCall } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or server console
    console.error("[Hujurat Solar] Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB71B]">
        Hujurat Solar Supply &amp; Install
      </p>

      <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
        Something unexpected occurred
      </h1>

      <p className="mt-3 max-w-md text-sm text-slate-600 sm:text-base">
        We experienced a temporary hiccup loading this page. Our technical team has been notified.
        Please reload the page or feel free to call our Sydney team directly.
      </p>

      {error?.digest && (
        <p className="mt-2 text-xs font-mono text-slate-400">
          Error Reference ID: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-[#061225] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#FFB71B] hover:text-[#061225] shadow-sm"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reload &amp; Try Again</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#FFB71B] hover:text-[#FFB71B]"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <a
          href={`tel:${siteConfig.phone}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-[#FFB71B] hover:text-[#FFB71B]"
        >
          <PhoneCall className="h-4 w-4 text-[#FFB71B]" />
          <span>{siteConfig.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
}
