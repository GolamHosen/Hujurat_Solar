import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/site/Icon";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import LeadForm from "@/components/forms/LeadForm";
import { getLocations, getProjects, getServiceBySlug } from "@/data/cms";
import { buildMetadata, serviceSchema, faqSchema } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: service.seo.title || `${service.title} | Hujurat Solar`,
    description: service.seo.description || service.summary,
    path: `/services/${service.slug}`,
    image: service.heroImage?.url,
  });
}

const FAQS_BY_SLUG: Record<string, { question: string; answer: string }[]> = {
  "solar-panels": [
    { question: "What size solar system do I need?", answer: "Most Sydney households are well suited to a 6.6kW to 13.3kW system, depending on daily electricity usage, roof space and orientation. We size every system based on your actual usage data." },
    { question: "How long do solar panels last?", answer: "Quality Tier-1 solar panels are typically rated for 25 to 30 years of performance, backed by manufacturer product and performance warranties." },
  ],
  "solar-battery": [
    { question: "Is a solar battery worth it?", answer: "It depends on your evening electricity usage and feed-in tariff. Households using significant power after sunset generally see the strongest case for a battery." },
    { question: "Can I add a battery to my existing solar system?", answer: "In most cases, yes. We assess your existing inverter and switchboard to determine the best battery retrofit option." },
  ],
  "commercial-solar": [
    { question: "How long does a commercial solar installation take?", answer: "Most commercial installations take between 3 and 10 business days on site, depending on system size and roof access, plus lead time for approvals." },
    { question: "Do commercial systems require three-phase power?", answer: "Larger commercial systems typically use three-phase inverters, which we can confirm during your free site assessment." },
  ],
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, projects, locations] = await Promise.all([
    getServiceBySlug(slug),
    getProjects({ limit: 3 }),
    getLocations(),
  ]);

  if (!service) notFound();

  const faqs = FAQS_BY_SLUG[service.slug] || [
    { question: `How much does ${service.title.toLowerCase()} cost?`, answer: "Pricing depends on your property, existing equipment and requirements. Request a free quote and we'll provide transparent, itemised pricing." },
    { question: "Do you service my suburb?", answer: "We service Sydney and Western Sydney including Parramatta, Blacktown, Penrith, Liverpool and Camden. Get in touch to confirm your suburb." },
  ];

  return (
    <div>
      <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: service.title, path: `/services/${service.slug}` }]} />
      <JsonLd data={[serviceSchema({ name: service.title, description: service.seo.description || service.summary, path: `/services/${service.slug}`, image: service.heroImage?.url }), faqSchema(faqs)]} />

      <section className="section-container grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand-dark">
            <Icon name={service.icon} className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">{service.title}</h1>
          <p className="mt-5 text-lg text-slate-600">{service.summary}</p>

          {service.heroImage && (
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl sm:h-96">
              <Image src={service.heroImage.url} alt={service.heroImage.alt || service.title} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
          )}

          <div className="prose-hujurat mt-8 max-w-none">
            <p>{service.description}</p>
          </div>

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

          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold text-slate-950">We service these areas</h2>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {locations.map((location) => (
                <Link key={location.id} href={`/locations/${location.slug}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand-dark">
                  {location.name}
                </Link>
              ))}
            </div>
          </div>

          {projects.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-slate-950">Related projects</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.slug}`} className="group overflow-hidden rounded-xl border border-slate-200">
                    <div className="relative h-32 w-full">
                      <Image src={project.featuredImage?.url || "/images/project-residential.jpg"} alt={project.featuredImage?.alt || project.title} fill className="object-cover transition group-hover:scale-105" sizes="33vw" />
                    </div>
                    <p className="p-3 text-xs font-semibold text-slate-800">{project.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-7 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-bold text-slate-950">Request a free quote</h2>
          <p className="mt-2 text-sm text-slate-600">Tell us about your property and we&apos;ll be in touch within one business day.</p>
          <div className="mt-5">
            <LeadForm compact />
          </div>
        </aside>
      </section>

      <section className="border-t border-slate-200 bg-slate-950 py-14 text-center text-white">
        <div className="section-container">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to talk about {service.title.toLowerCase()}?</h2>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-brand-dark">
            Contact our team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
