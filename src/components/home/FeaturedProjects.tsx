import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import type { Project } from "@/data/types";
import Reveal from "@/components/ui/Reveal";

export default function FeaturedProjects({ projects: items }: { projects: Project[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-slate-50 py-24">
      <div className="section-container">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Real installs, real results</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">Featured projects</h2>
          </div>
          <Link href="/projects" prefetch={true} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
            View all projects <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {items.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.1}>
              <Link
                href={`/projects/${project.slug}`}
                prefetch={true}
                className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-xl"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={project.featuredImage?.url || "/images/project-residential.jpg"}
                    alt={project.featuredImage?.alt || project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                  {project.systemSizeKw && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-brand backdrop-blur">
                      <Zap className="h-3 w-3" /> {project.systemSizeKw}kW
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <MapPin className="h-3.5 w-3.5" /> {project.suburb}, {project.state}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-slate-950">{project.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.summary}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
