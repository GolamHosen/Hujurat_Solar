import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Zap } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { getLocations, getProjects } from "@/data/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Areas We Service | Solar Installers Across Sydney & Western Sydney",
  description:
    "Hujurat Solar installs solar panels and batteries across Sydney and Western Sydney, including Parramatta, Blacktown, Penrith, Liverpool and Camden.",
  path: "/locations",
});

export default async function LocationsPage() {
  const [locations, allProjects] = await Promise.all([
    getLocations(),
    getProjects(),
  ]);

  return (
    <div>
      <Breadcrumbs items={[{ name: "Locations", path: "/locations" }]} />
      <section className="section-container py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Service areas</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            Local solar installers across Sydney
          </h1>
          <p className="mt-5 text-slate-600">
            We&rsquo;re locally based in Western Sydney and install solar and battery systems for homes and businesses
            throughout Greater Sydney. Explore each area below for local project examples and information.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => {
            const hasImage = Boolean(
              location.heroImage?.url &&
              location.heroImage.url !== "/images/location-suburb.jpg"
            );

            const projectCount = allProjects.filter(
              (p) =>
                (p.locationId && p.locationId === location.id) ||
                (p.suburb && p.suburb.toLowerCase() === location.name.toLowerCase())
            ).length;

            return (
              <Link
                key={location.id}
                href={`/locations/${location.slug}`}
                prefetch={true}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg"
              >
                {hasImage && (
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={location.heroImage!.url}
                      alt={location.heroImage!.alt || location.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {!hasImage && (
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-brand-dark transition group-hover:bg-brand group-hover:text-slate-950">
                        <MapPin className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-brand-dark" /> {location.region || location.state}
                      </p>
                      {projectCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 border border-amber-200/80">
                          <Zap className="h-3 w-3 text-brand" /> {projectCount} {projectCount === 1 ? "project" : "projects"}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 font-display text-lg font-bold text-slate-950">{location.name}</h2>
                    {location.blurb && (
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{location.blurb}</p>
                    )}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
                    {projectCount > 0 ? "View area & projects" : "View area"} <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
