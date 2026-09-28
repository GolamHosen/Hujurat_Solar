import LoginForm from "./LoginForm";
import { safeDashboardPath } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function DashboardLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  // Reduced to a same-app /dashboard path so the form can never be used as an open redirect.
  const nextPath = safeDashboardPath(next);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Hujurat Solar Admin</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">Sign in to your dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">Manage projects, leads, content and SEO.</p>
        <div className="mt-6">
          <LoginForm next={nextPath} />
        </div>
      </div>
    </div>
  );
}
