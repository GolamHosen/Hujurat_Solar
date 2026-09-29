import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Zap } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import LeadForm from "@/components/forms/LeadForm";
import { getLocationBySlug, getProjects, getServices } from "@/data/cms";
import { buildMetadata, faqSchema, locationLocalBusinessSchema } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) return {};
  return buildMetadata({
    title: location.seo.title || `Solar Installer ${location.name} NSW | CEC Accredited | Hujurat Solar`,
    description:
      location.seo.description ||
      `Top-rated solar panel and battery installations in ${location.name}, NSW. CEC-accredited installers, tier-1 equipment, free quotes, and maximum government rebates.`,
    path: `/locations/${location.slug}`,
    image: location.heroImage?.url,
  });
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  // No direct database access: "projects near here" is a data-layer concern.
  const [localProjects, services, allPublished] = await Promise.all([
    getProjects({ locationId: location.id }),
    getServices(),
    getProjects(),
  ]);

  const projectsToShow = localProjects.length > 0 ? localProjects : allPublished.slice(0, 3);

  const faqs = [
    {
      question: `Do you install residential and commercial solar systems in ${location.name}?`,
      answer: `Yes, ${location.name} is one of our core primary service areas. We regularly design and install 6.6kW to 13.3kW residential solar systems, commercial installations, and solar battery storage across ${location.name} and surrounding suburbs.`,
    },
    {
      question: `Which electricity distributor network covers ${location.name} for solar grid connection?`,
      answer: `Most of Western Sydney and ${location.name} is serviced by the Endeavour Energy or Ausgrid electricity network. Hujurat Solar manages all connection applications, export approval limits, and bi-directional smart meter upgrades directly with your network provider.`,
    },
    {
      question: `What solar and battery rebates are available to homeowners in ${location.name}, NSW?`,
      answer: `Homeowners in ${location.name} qualify for the Federal Government Small-scale Technology Certificates (STC) discount (saving up to $2,500–$3,500 on system costs) and the NSW Peak Demand Reduction Scheme (PDRS) battery discount (saving up to $1,600–$2,400). As a CEC-accredited installer, Hujurat Solar applies all rebates upfront on your quote.`,
    },
    {
      question: `Do I need local council approval to install solar panels in ${location.name}?`,
      answer: `In almost all standard residential properties in ${location.name}, rooftop solar installations are classified as Exempt Development under NSW State Environmental Planning Policy (SEPP), meaning formal council Development Applications (DA) are not required unless your building is state heritage-listed.`,
    },
    {
      question: `How quickly can you install solar in ${location.name}?`,
      answer: `Following proposal acceptance and network pre-approval, our team completes rooftop installation within 2 to 4 weeks, with physical on-site work typically finished in a single day.`,
    },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ name: "Locations", path: "/locations" }, { name: location.name, path: `/locations/${location.slug}` }]} />
      <JsonLd
        data={[
          locationLocalBusinessSchema({
            locationName: location.name,
            region: location.region,
            state: location.state,
            path: `/locations/${location.slug}`,
            description: location.seo.description || location.blurb,
          }),
          faqSchema(faqs),
        ]}
      />

      <section className="relative">
        <div className="relative h-72 w-full sm:h-96">
          <Image src={location.heroImage?.url || "/images/location-suburb.jpg"} alt={location.heroImage?.alt || location.name} fill preload className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-slate-950/10" />
          <div className="section-container absolute inset-x-0 bottom-0 pb-10 text-white">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
              <MapPin className="h-3.5 w-3.5" /> {location.region}, {location.state}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Solar Installer in {location.name}</h1>
          </div>
        </div>
      </section>

      <section className="section-container grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="prose-hujurat max-w-none">
            <p>{location.description}</p>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold text-slate-950">Services available in {location.name}</h2>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand-dark">
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          {projectsToShow.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-slate-950">Recent projects near {location.name}</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {projectsToShow.map((project) => (
                  <Link key={project.id} href={`/projects/${project.slug}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="relative h-40 w-full">
                      <Image src={project.featuredImage?.url || "/images/project-residential.jpg"} alt={project.featuredImage?.alt || project.title} fill className="object-cover transition group-hover:scale-105" sizes="50vw" />
                      {project.systemSizeKw && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-2.5 py-1 text-xs font-semibold text-brand">
                          <Zap className="h-3 w-3" /> {project.systemSizeKw}kW
                        </span>
                      )}
                    </div>
                    <p className="p-4 text-sm font-semibold text-slate-900">{project.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold text-slate-950">Frequently asked questions</h2>
            <div className="mt-5 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-7 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-bold text-slate-950">Get a free {location.name} quote</h2>
          <p className="mt-2 text-sm text-slate-600">Local installers, fast turnaround, transparent pricing.</p>
          <div className="mt-5">
            <LeadForm compact />
          </div>
        </aside>
      </section>

      <section className="border-t border-slate-200 bg-slate-950 py-14 text-center text-white">
        <div className="section-container">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Serving {location.name} and surrounding suburbs</h2>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-brand-dark">
            Get your free quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
