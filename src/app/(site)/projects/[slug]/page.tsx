import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Battery, CalendarDays, MapPin, PlayCircle, Quote, Zap } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import LeadForm from "@/components/forms/LeadForm";
import { getProjectBySlug } from "@/data/cms";
import type { ProjectDetail } from "@/data/types";
import { buildMetadata, projectSchema, reviewSchema } from "@/lib/seo";
import { formatLongDate } from "@/lib/format";
import ProjectImageCarousel from "@/components/site/ProjectImageCarousel";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {


  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.seo.title || `${project.title} | Hujurat Solar`,
    description: project.seo.description || project.summary,
    path: `/projects/${project.slug}`,
    image: project.featuredImage?.url,
    noIndex: project.seo.robots?.includes("noindex"),
  });
}

const SPEC_ITEMS = (project: ProjectDetail) => [
  { label: "System Size", value: project.systemSizeKw ? `${project.systemSizeKw} kW` : null },
  { label: "Battery Size", value: project.batterySizeKwh ? `${project.batterySizeKwh} kWh` : null },
  { label: "Panel Brand", value: project.panelBrand },
  { label: "Inverter Brand", value: project.inverterBrand },
  { label: "Battery Brand", value: project.batteryBrand },
  { label: "Project Type", value: project.projectType === "commercial" ? "Commercial" : "Residential" },
  { label: "Location", value: `${project.suburb}, ${project.state} ${project.postcode || ""}`.trim() },
  { label: "Install Date", value: formatLongDate(project.installDate) },
];

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const images = project.gallery;
  const videos = project.videos;
  const specs = SPEC_ITEMS(project).filter((spec) => spec.value);

  return (
    <div>
      <Breadcrumbs items={[{ name: "Projects", path: "/projects" }, { name: project.title, path: `/projects/${project.slug}` }]} />
      <JsonLd
        data={[
          projectSchema({
            title: project.title,
            description: project.seo.description || project.summary,
            path: `/projects/${project.slug}`,
            image: project.featuredImage?.url,
            suburb: `${project.suburb}, ${project.state}`,
            datePublished: project.publishedAt ? new Date(project.publishedAt).toISOString() : null,
          }),
          ...(project.customerTestimonial
            ? reviewSchema([{ author: project.customerName || "Customer", rating: 5, content: project.customerTestimonial, date: project.publishedAt ? new Date(project.publishedAt).toISOString() : null }])
            : []),
        ]}
      />

      <section className="section-container grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark">
            <MapPin className="h-3.5 w-3.5" /> {project.suburb}, {project.state}
            {project.installDate && (
              <>
                <span className="mx-1 text-slate-300">•</span>
                <CalendarDays className="h-3.5 w-3.5" />
                {formatLongDate(project.installDate)}
              </>
            )}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">{project.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{project.summary}</p>

          <div className="mt-7">
            <ProjectImageCarousel images={images} projectTitle={project.title} />
          </div>


          {videos.length > 0 && (
            <div className="mt-8 rounded-2xl border border-slate-200 p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-slate-950">
                <PlayCircle className="h-5 w-5 text-brand-dark" /> Project video
              </h2>
              {videos.map((video) => (
                <div key={video.id} className="mt-4">
                  <p className="font-semibold text-slate-900">{video.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{video.description}</p>
                  <video controls poster={video.thumbnailUrl || undefined} className="mt-3 w-full rounded-xl bg-slate-900">
                    <source src={video.url} />
                  </video>
                </div>
              ))}
            </div>
          )}

          <div className="prose-hujurat mt-10 max-w-none">
            <h2>About this project</h2>
            <p>{project.description}</p>
            {project.challenge && (
              <>
                <h2>The challenge</h2>
                <p>{project.challenge}</p>
              </>
            )}
            {project.outcome && (
              <>
                <h2>The outcome</h2>
                <p>{project.outcome}</p>
              </>
            )}
          </div>

          {project.customerTestimonial && (
            <div className="mt-10 rounded-2xl bg-slate-50 p-7">
              <Quote className="h-6 w-6 text-brand" />
              <p className="mt-3 text-slate-700">&ldquo;{project.customerTestimonial}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">
                {project.customerName} — {project.suburb}
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h2 className="font-display text-lg font-bold text-slate-950">Project specifications</h2>
            <dl className="mt-4 space-y-3">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3 text-sm last:border-0">
                  <dt className="flex items-center gap-1.5 text-slate-500">
                    {spec.label === "System Size" && <Zap className="h-3.5 w-3.5" />}
                    {spec.label === "Battery Size" && <Battery className="h-3.5 w-3.5" />}
                    {spec.label}
                  </dt>
                  <dd className="font-semibold text-slate-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <h2 className="font-display text-lg font-bold">Want a similar system?</h2>
            <p className="mt-2 text-sm text-slate-300">Get a free, no-obligation quote for your property.</p>
            <div className="mt-4">
              <LeadForm compact />
            </div>
          </div>
        </aside>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14 text-center">
        <div className="section-container">
          <h2 className="font-display text-2xl font-bold text-slate-950">See more of our work</h2>
          <Link href="/projects" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            View all projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
