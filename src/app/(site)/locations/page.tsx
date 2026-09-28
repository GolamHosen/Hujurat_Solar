import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { getLocations } from "@/data/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Areas We Service | Solar Installers Across Sydney & Western Sydney",
  description:
    "Hujurat Solar installs solar panels and batteries across Sydney and Western Sydney, including Parramatta, Blacktown, Penrith, Liverpool and Camden.",
  path: "/locations",
});

export default async function LocationsPage() {
  const locations = await getLocations();

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
          {locations.map((location) => (
            <Link key={location.id} href={`/locations/${location.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-40 w-full">
                <Image src={location.heroImage?.url || "/images/location-suburb.jpg"} alt={location.heroImage?.alt || location.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width:1024px) 33vw, 100vw" />
              </div>
              <div className="p-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-brand-dark" /> {location.region}
                </p>
                <h2 className="mt-2 font-display text-lg font-bold text-slate-950">{location.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{location.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
                  View area <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
