import Link from "next/link";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Globe,
  FileCode,
  Sparkles,
  Pencil,
} from "lucide-react";
import { siteConfig } from "@/lib/site";
import {
  getAllProjects,
  getAllServices,
  getAllLocations,
  getAllBlogPosts,
} from "@/lib/queries";

export default async function DashboardSeoPage() {
  const [projects, services, locations, blogPosts] = await Promise.all([
    getAllProjects(),
    getAllServices(),
    getAllLocations(),
    getAllBlogPosts(),
  ]);

  // Aggregate audit items
  const auditItems = [
    ...services.map((s) => ({
      type: "Service",
      title: s.title,
      slug: `/services/${s.slug}`,
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
      status: s.status,
      editUrl: `/dashboard/services/${s.id}/edit`,
    })),
    ...locations.map((l) => ({
      type: "Location",
      title: `${l.name}, ${l.state}`,
      slug: `/locations/${l.slug}`,
      seoTitle: l.seoTitle,
      seoDescription: l.seoDescription,
      status: l.status,
      editUrl: `/dashboard/locations/${l.id}/edit`,
    })),
    ...projects.map((p) => ({
      type: "Project",
      title: p.title,
      slug: `/projects/${p.slug}`,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      status: p.status,
      editUrl: `/dashboard/projects/${p.id}/edit`,
    })),
    ...blogPosts.map((b) => ({
      type: "Blog",
      title: b.title,
      slug: `/blog/${b.slug}`,
      seoTitle: b.seoTitle,
      seoDescription: b.seoDescription,
      status: b.status,
      editUrl: `/dashboard/blog/${b.id}/edit`,
    })),
  ];

  const totalPages = auditItems.length;
  const withSeoTitle = auditItems.filter((i) => Boolean(i.seoTitle?.trim())).length;
  const withSeoDesc = auditItems.filter((i) => Boolean(i.seoDescription?.trim())).length;
  const missingDesc = auditItems.filter((i) => !i.seoDescription?.trim());
  const score = totalPages > 0 ? Math.round(((withSeoTitle + withSeoDesc) / (totalPages * 2)) * 100) : 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-950">
          Search Engine Optimization (SEO)
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor search rankings, OpenGraph tags, schema markup, and meta description coverage.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">SEO Health Score</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-slate-900">
            {score}%
          </p>
          <p className="mt-1 text-xs text-slate-500">Metadata completion rate</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Indexed Pages</span>
            <Globe className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-slate-900">
            {totalPages}
          </p>
          <p className="mt-1 text-xs text-slate-500">Projects, services & suburbs</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Meta Titles Set</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-slate-900">
            {withSeoTitle} / {totalPages}
          </p>
          <p className="mt-1 text-xs text-emerald-600">Custom click-through titles</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Needs Description</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold text-slate-900">
            {missingDesc.length}
          </p>
          <p className="mt-1 text-xs text-amber-600">Falling back to auto summaries</p>
        </div>
      </div>

      {/* Google SERP Preview & Schema Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SERP Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-slate-950 flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" /> Google Search Result Preview
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            How your primary homepage snippet appears on search engine result pages (SERPs).
          </p>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
              <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                Ad / Organic
              </span>
              <span>{siteConfig.url}</span>
            </div>
            <h3 className="text-base font-medium text-blue-800 hover:underline cursor-pointer">
              {siteConfig.name} | Solar Panels, Batteries & Installation Sydney
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <span>★★★★★ Rating: 5.0</span>
              <span>· Free Quotes</span>
              <span>· CEC Accredited</span>
            </div>
          </div>
        </div>

        {/* Structured Data & Schema */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-slate-950 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-slate-400" /> Schema.org & Feeds
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Automated rich-results markup configured for Google bot crawling.
          </p>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
              <span className="font-medium text-slate-800">Organization & LocalBusiness</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active (RoofingContractor)
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
              <span className="font-medium text-slate-800">AggregateRating Schema</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active (Live Reviews)
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
              <span className="font-medium text-slate-800">Breadcrumbs & FAQ Schema</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active (Deep Indexing)
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
              <span className="font-medium text-slate-800">Dynamic XML Sitemap</span>
              <a
                href="/sitemap.xml"
                target="_blank"
                className="inline-flex items-center gap-1 text-brand-dark hover:underline font-semibold"
              >
                /sitemap.xml <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
              <span className="font-medium text-slate-800">Robots.txt Directives</span>
              <a
                href="/robots.txt"
                target="_blank"
                className="inline-flex items-center gap-1 text-brand-dark hover:underline font-semibold"
              >
                /robots.txt <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Audit Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-display text-base font-bold text-slate-950">
            Page-by-Page Metadata Audit
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Review custom SEO titles and meta descriptions. Click edit to customize any snippet.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Page / URL</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">SEO Title</th>
                <th className="px-5 py-3">Meta Description</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {auditItems.map((item, idx) => (
                <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-400 font-mono">{item.slug}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 max-w-xs">
                    {item.seoTitle ? (
                      <span className="text-xs text-slate-800 font-medium">
                        {item.seoTitle}
                      </span>
                    ) : (
                      <span className="text-xs italic text-slate-400">Default fallback</span>
                    )}
                  </td>
                  <td className="px-5 py-3 max-w-sm">
                    {item.seoDescription ? (
                      <p className="line-clamp-2 text-xs text-slate-600">
                        {item.seoDescription}
                      </p>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        <AlertTriangle className="h-3 w-3" /> Auto excerpt
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={item.editUrl}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-dark"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
