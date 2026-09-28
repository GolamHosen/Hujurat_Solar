import Link from "next/link";
import { FolderKanban, Users, Newspaper, Wrench, MapPin, ArrowUpRight } from "lucide-react";
import { getDashboardStats, getAllLeads, getAllProjects } from "@/lib/queries";

export default async function DashboardOverviewPage() {
  const [stats, leads, projects] = await Promise.all([getDashboardStats(), getAllLeads(), getAllProjects()]);

  const recentLeads = leads.slice(0, 5);
  const recentProjects = projects.slice(0, 5);

  const cards = [
    { label: "Total Projects", value: stats.totalProjects, sub: `${stats.publishedProjects} published`, icon: FolderKanban, href: "/dashboard/projects" },
    { label: "Total Leads", value: stats.totalLeads, sub: `${stats.newLeads} new`, icon: Users, href: "/dashboard/leads" },
    { label: "Published Blog Posts", value: stats.publishedBlogPosts, sub: "SEO content", icon: Newspaper, href: "/dashboard/blog" },
    { label: "Published Services", value: stats.publishedServices, sub: "Live on site", icon: Wrench, href: "/dashboard/services" },
    { label: "Published Locations", value: stats.publishedLocations, sub: "Local SEO pages", icon: MapPin, href: "/dashboard/locations" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-950">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-slate-500">A snapshot of your solar business platform.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
            <card.icon className="h-5 w-5 text-brand-dark" />
            <p className="mt-4 font-display text-3xl font-extrabold text-slate-950">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-[11px] text-emerald-600">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-950">Recent leads</h2>
            <Link href="/dashboard/leads" className="flex items-center gap-1 text-xs font-semibold text-brand-dark">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentLeads.length === 0 && <p className="text-sm text-slate-400">No leads yet.</p>}
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm last:border-0">
                <div>
                  <p className="font-semibold text-slate-900">{lead.name}</p>
                  <p className="text-xs text-slate-500">{lead.suburb} · {lead.interestedService || "General enquiry"}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  {lead.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-950">Recent projects</h2>
            <Link href="/dashboard/projects" className="flex items-center gap-1 text-xs font-semibold text-brand-dark">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentProjects.length === 0 && <p className="text-sm text-slate-400">No projects yet.</p>}
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm last:border-0">
                <div>
                  <p className="font-semibold text-slate-900">{project.title}</p>
                  <p className="text-xs text-slate-500">{project.suburb}, {project.state}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${project.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
