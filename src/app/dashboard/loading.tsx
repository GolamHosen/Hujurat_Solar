/**
 * Dashboard loading skeleton — shown immediately while page data fetches.
 * Prevents the "blank screen" delay and gives users instant visual feedback.
 */
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Title bar skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded-md bg-slate-200" />
        </div>
        <div className="h-10 w-32 rounded-full bg-slate-200" />
      </div>

      {/* Content skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="h-4 w-20 rounded bg-slate-100" />
            <div className="h-4 w-16 rounded bg-slate-100" />
            <div className="h-4 w-28 rounded bg-slate-100" />
            <div className="h-4 w-14 rounded bg-slate-100" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-t border-slate-100 pt-3">
              <div className="h-4 w-40 rounded bg-slate-100" />
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="h-4 w-20 rounded bg-slate-100" />
              <div className="h-4 w-16 rounded bg-slate-100" />
              <div className="h-6 w-16 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
