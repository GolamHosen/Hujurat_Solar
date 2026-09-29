import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Location } from "@/data/types";

export default function LocationsStrip({ items }: { items: Location[] }) {
  return (
    <section className="border-y border-slate-200 bg-white py-20">
      <div className="section-container">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Areas we service</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Local solar installers near you
            </h2>
          </div>
          <Link href="/areas-we-service" prefetch={true} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
            All service areas <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((location) => (
            <Link
              key={location.id}
              href={`/locations/${location.slug}`}
              prefetch={true}
              className="group flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:border-brand hover:bg-brand/5 hover:text-brand-dark"
            >
              <MapPin className="h-4 w-4 text-brand-dark" />
              {location.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
