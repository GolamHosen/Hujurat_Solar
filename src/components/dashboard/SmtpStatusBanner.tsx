"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertTriangle, Loader2, Send } from "lucide-react";

interface SmtpStatusBannerProps {
  isConfigured: boolean;
  smtpHost?: string;
  smtpUser?: string;
}

export default function SmtpStatusBanner({
  isConfigured,
  smtpHost,
  smtpUser,
}: SmtpStatusBannerProps) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleTestEmail = async () => {
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch("/api/test-email", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({
          ok: true,
          message: "Test email dispatched successfully! Please check your inbox.",
        });
      } else {
        setResult({
          ok: false,
          message: data.error || data.message || "Failed to dispatch test email.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setResult({ ok: false, message: `Request failed: ${msg}` });
    } finally {
      setTesting(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-amber-950">
                SMTP Email Notifications Not Configured in this Environment
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                New quote submissions will be saved to your database, but email alerts won&apos;t be dispatched until SMTP variables (
                <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[11px]">SMTP_HOST</code>,{" "}
                <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[11px]">SMTP_USER</code>,{" "}
                <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[11px]">SMTP_PASS</code>) are added to your hosting platform (e.g. Vercel Project Settings → Environment Variables).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-900">
                Email Notifications Active
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sending via {smtpHost || "SMTP"} ({smtpUser || "configured"})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestEmail}
          disabled={testing}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50"
        >
          {testing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          Send Test Email
        </button>
      </div>

      {result && (
        <div
          className={`mt-3 rounded-xl p-3 text-xs flex items-center gap-2 ${
            result.ok
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          {result.ok ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
