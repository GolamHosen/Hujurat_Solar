/**
 * Public site loading skeleton — shows immediately while page data loads.
 * Gives users instant visual feedback instead of a blank screen.
 */
export default function SiteLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-slate-100 px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-10 w-3/4 rounded-lg bg-slate-200" />
          <div className="h-6 w-1/2 rounded-md bg-slate-200" />
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 rounded-full bg-slate-200" />
            <div className="h-12 w-36 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="h-8 w-8 rounded-lg bg-slate-200 mb-4" />
              <div className="h-5 w-32 rounded bg-slate-200 mb-2" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
