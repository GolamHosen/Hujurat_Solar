import Image from "next/image";
import Link from "next/link";
import { MapPin, Zap, Battery } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { getProjects } from "@/data/cms";
import { buildMetadata } from "@/lib/seo";
import { formatMeasureCompact } from "@/lib/format";

export const metadata = buildMetadata({
  title: "Solar Project Portfolio | Real Installations Across Sydney",
  description:
    "Browse real solar and battery installation projects completed by Hujurat Solar across Sydney and Western Sydney, with full specs, photos and results.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }]} />
      <section className="section-container py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Project portfolio</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            See What Real Solar Can Do
          </h1>
          <p className="mt-5 text-slate-600">
            Thinking about going solar? See how we&rsquo;ve helped homes and businesses across Sydney.
            Explore real Hujurat Solar installations featuring actual system details, installation photos
            and genuine customer results &mdash; real systems delivering real-world savings.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
            Your Home Could Be Next
          </span>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} prefetch={true} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-48 w-full">
                <Image src={project.featuredImage?.url || "/images/project-residential.jpg"} alt={project.featuredImage?.alt || project.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width:1024px) 33vw, 100vw" />
                <span className="absolute left-3 top-3 rounded-full bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">
                  {project.projectType}
                </span>
              </div>
              <div className="p-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> {project.suburb}, {project.state}
                </p>
                <h2 className="mt-2 font-display text-base font-bold leading-snug text-slate-950">{project.title}</h2>
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
                  {formatMeasureCompact(project.systemSizeKw, "kW") && (
                    <span className="inline-flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-brand-dark" /> {formatMeasureCompact(project.systemSizeKw, "kW")} solar
                    </span>
                  )}
                  {formatMeasureCompact(project.batterySizeKwh, "kWh") && (
                    <span className="inline-flex items-center gap-1">
                      <Battery className="h-3.5 w-3.5 text-brand-dark" /> {formatMeasureCompact(project.batterySizeKwh, "kWh")} battery
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="mt-10 text-sm text-slate-500">No published projects yet — check back soon.</p>
        )}
      </section>
    </div>
  );
}
