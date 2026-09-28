import Link from "next/link";
import { MapPin, CheckCircle2 } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { getLocations } from "@/data/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Areas We Service | Hujurat Solar Supply & Install",
  description:
    "Hujurat Solar services Sydney and Western Sydney including Parramatta, Blacktown, Penrith, Liverpool, Camden and surrounding suburbs. Find your local solar installer.",
  path: "/areas-we-service",
});

export default async function AreasWeServicePage() {
  const locations = await getLocations();

  return (
    <div>
      <Breadcrumbs items={[{ name: "Areas We Service", path: "/areas-we-service" }]} />
      <section className="section-container py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Coverage</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            Areas we service
          </h1>
          <p className="mt-5 text-slate-600">
            Hujurat Solar is based in Western Sydney and travels across Greater Sydney for residential and
            commercial installations. If your suburb isn&apos;t listed below, get in touch — we likely still
            service your area.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link key={location.id} href={`/locations/${location.slug}`} className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 transition hover:border-brand hover:bg-brand/5">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin className="h-4 w-4 text-brand-dark" /> {location.name}
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-slate-950 p-10 text-center text-white">
          <h2 className="font-display text-2xl font-bold">Not sure if we service your suburb?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
            Send us your address and electricity bill and we&apos;ll confirm coverage along with a free, obligation-free quote.
          </p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-brand-dark">
            Check my suburb
          </Link>
        </div>
      </section>
    </div>
  );
}
