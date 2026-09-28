import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Icon from "@/components/site/Icon";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { getServices } from "@/data/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Solar Services in Sydney | Panels, Batteries, Installation & More",
  description:
    "Explore Hujurat Solar's full range of services: solar panels, battery storage, installation, upgrades, commercial & residential solar, maintenance, repairs and monitoring.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
      <section className="section-container py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Our services</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            Everything you need for solar, from design to monitoring
          </h1>
          <p className="mt-5 text-slate-600">
            Hujurat Solar handles every stage of your solar journey — supply, installation, upgrades, maintenance
            and ongoing monitoring — for residential and commercial properties across Sydney.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand-dark transition group-hover:bg-brand group-hover:text-slate-950">
                <Icon name={service.icon} className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-lg font-bold text-slate-950">{service.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
                Learn more <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
