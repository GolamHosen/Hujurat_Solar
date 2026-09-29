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
    {
      question: "What size solar system do I need for my Sydney home?",
      answer:
        "Most Sydney households are best suited to a 6.6kW system (15–16 panels) for average daily usage around 18–20kWh, or a 10kW to 13.3kW system if you run ducted air conditioning, have a pool, or plan for an electric vehicle. We analyze your actual meter data to recommend the exact ideal size.",
    },
    {
      question: "How long do Tier-1 solar panels last in Australian weather conditions?",
      answer:
        "High-performance Tier-1 monocrystalline panels (such as Jinko Solar, REC, and Trina) are designed to withstand intense Australian UV, hail, and high temperatures, featuring 25-year product warranties and 25 to 30-year linear performance guarantees (retaining over 85% generation after 25 years).",
    },
    {
      question: "Will solar panels work on cloudy or rainy Sydney days?",
      answer:
        "Yes. While solar panels produce maximum power under direct sunlight, modern high-efficiency panels still capture diffuse ultraviolet and ambient daylight, producing between 15% to 35% of their rated output even during overcast Sydney conditions.",
    },
    {
      question: "How does the Federal STC solar rebate discount my panel installation cost?",
      answer:
        "Under the Small-scale Renewable Energy Scheme (SRES), your installation creates Small-scale Technology Certificates (STCs) based on system capacity and Sydney's solar zone. This provides an immediate point-of-sale discount worth roughly $2,200 to $3,500 on a typical 6.6kW–10kW system.",
    },
  ],
  "solar-battery": [
    {
      question: "Is installing a solar battery worth it in Sydney in 2025/2026?",
      answer:
        "Yes, especially with evening peak electricity tariffs reaching 35c–50c/kWh and feed-in tariffs hovering between 5c–8c/kWh. Storing your daytime solar rather than exporting it for pennies delivers maximum bill reduction, bringing payback down to 6–8 years when combined with NSW state rebates.",
    },
    {
      question: "How much is the NSW Peak Demand Reduction Scheme (PDRS) battery rebate?",
      answer:
        "The NSW Government PDRS incentive offers eligible Sydney households an upfront discount of roughly $1,600 to $2,400 off the purchase and installation of an approved solar battery, making premium storage systems like Sungrow and BYD significantly more accessible.",
    },
    {
      question: "Can I retrofit a battery to my existing solar system?",
      answer:
        "Yes. An AC-coupled battery (such as Tesla Powerwall 2/3 or Enphase) can connect directly into your main switchboard regardless of your current inverter brand. Alternatively, if your inverter is older than 8–10 years, upgrading to a hybrid inverter allows DC-coupled battery integration for higher efficiency.",
    },
    {
      question: "Will a solar battery keep my power on during a blackout?",
      answer:
        "Yes, provided your battery system includes Emergency Power Supply (EPS) or blackout backup circuitry. During an outage, the system automatically isolates from the grid (anti-islanding) and powers designated backup circuits such as fridges, lighting, internet, and essential powerpoints.",
    },
  ],
  "solar-installation": [
    {
      question: "How long does a complete solar installation take from quote to grid connection?",
      answer:
        "On-site installation is typically completed in 1 to 2 business days. The end-to-end timeline from signing the proposal to permission-to-connect (including Ausgrid/Endeavour Energy grid approvals and bi-directional meter configuration) usually takes 2 to 4 weeks.",
    },
    {
      question: "What roof types can Hujurat Solar install panels on?",
      answer:
        "We install on virtually all Australian roof types, including Colorbond, corrugated tin, concrete tiles, terracotta tiles, and flat kliplok metal roofs, using specialized non-penetrating clamps and cyclone-rated mounting rails.",
    },
    {
      question: "Who handles the grid connection approvals with Ausgrid or Endeavour Energy?",
      answer:
        "Hujurat Solar handles 100% of network connection applications, safety certificates of compliance (CCEW), and meter reconfiguration requests with your energy retailer on your behalf.",
    },
  ],
  "solar-system-upgrades": [
    {
      question: "Can I add more solar panels to my existing 5kW system?",
      answer:
        "Yes, depending on your current inverter capacity, remaining roof space, and network export rules. If your current inverter is operating at capacity, we can either install an additional small system with a separate inverter or replace your existing unit with a high-capacity hybrid inverter.",
    },
    {
      question: "When should I upgrade an older solar inverter?",
      answer:
        "Inverters typically have a lifespan of 10 to 12 years. If your older string inverter is out of warranty, displaying recurring fault codes, or incompatible with battery storage, upgrading to a modern hybrid inverter (like Sungrow or Fronius) improves efficiency by up to 10% and adds WiFi smart app monitoring.",
    },
    {
      question: "Will upgrading my solar system void my existing government rebates?",
      answer:
        "No. You are eligible for new Federal STC rebates on newly installed panels and eligible for the NSW PDRS rebate when adding an approved battery system.",
    },
  ],
  "commercial-solar": [
    {
      question: "What is the return on investment (ROI) for commercial solar in Sydney?",
      answer:
        "Commercial solar systems for Sydney warehouses, factories, retail centers, and offices typically achieve full payback within 2.5 to 4 years. Because commercial facilities consume power during high-rate business hours, solar energy is used instantly on-site to offset commercial daytime tariffs.",
    },
    {
      question: "Does commercial solar require three-phase power and network capacity studies?",
      answer:
        "Systems above 30kW to 100kW+ connect into three-phase supplies and require formal network engineering approvals from Ausgrid or Endeavour Energy. Hujurat Solar manages all connection studies, zero-export or export-limited settings, and grid protection relays.",
    },
    {
      question: "Can commercial solar systems be financed without upfront capital?",
      answer:
        "Yes, we offer Power Purchase Agreements (PPAs), commercial equipment leases, and cash-flow positive financing structures where the monthly power bill savings exceed the equipment repayments from month one.",
    },
  ],
  "residential-solar": [
    {
      question: "What is the best solar panel layout for an Australian home?",
      answer:
        "North-facing roofs produce the highest total kilowatt-hours throughout the day, while East-facing panels capture strong morning generation (ideal for morning routines) and West-facing panels capture late afternoon sun (reducing peak evening cooling costs). Split East-West configurations provide smooth, consistent generation across the entire day.",
    },
    {
      question: "How do I monitor how much electricity my solar panels are generating?",
      answer:
        "All our solar installations include free smartphone and web monitoring apps (e.g., Sungrow iSolarCloud, Solar.web, or GoodWe SEMS). You can track real-time generation, household power consumption, battery charge levels, and historical savings 24/7.",
    },
    {
      question: "What happens if a solar panel is damaged by hail or severe storms?",
      answer:
        "CEC-approved panels are rated to withstand direct impacts from 25mm hailstones at 80+ km/h. If severe weather does damage a panel, residential solar systems are covered under standard Australian home building insurance policies.",
    },
  ],
  "solar-maintenance": [
    {
      question: "How often do solar panels need cleaning and servicing in Sydney?",
      answer:
        "We recommend a professional inspection and health check every 2 to 3 years. In Western Sydney where dust, pollen, bird droppings, and industrial particulate accumulate, an annual clean can recover 5% to 15% of lost generation.",
    },
    {
      question: "What is included in a Hujurat Solar comprehensive system health check?",
      answer:
        "Our accredited electricians perform DC voltage and current testing on panel strings, thermal imaging to identify hotspot micro-fractures, inspection of rooftop DC isolators for water ingress, switchboard safety switch verification, inverter firmware updates, and earth continuity checks.",
    },
    {
      question: "Can dirty solar panels cause permanent damage?",
      answer:
        "Yes. Heavy localised bird droppings or baked-on leaves cause cell shading. When sunlight hits the rest of the string, shaded cells are forced to operate in reverse bias, creating dangerous thermal hotspots that can permanently degrade solar cells or trigger fire risks.",
    },
  ],
  "solar-repairs": [
    {
      question: "Why is my solar inverter showing a red light or error message?",
      answer:
        "A red light indicates an active fault requiring attention. Common causes include: (1) Isolation fault (moisture entering rooftop DC isolators or cables), (2) Grid Over-Voltage (the local street grid voltage exceeded 255V, causing safety shutdown), (3) Ground fault, or (4) Internal relay/capacitor degradation. Call our repair team to diagnose the exact error code.",
    },
    {
      question: "What should I do if my solar system stops generating power suddenly?",
      answer:
        "First, follow the standard safe shutdown procedure: Turn OFF the Solar AC Isolator in your switchboard, turn OFF the DC Isolator near the inverter. Wait 5 minutes, then turn ON the AC isolator, followed by the DC isolator. If the inverter fails to reboot into a green operating status, contact Hujurat Solar for prompt fault diagnosis.",
    },
    {
      question: "Is it worth repairing an older inverter or replacing it with a new one?",
      answer:
        "If your inverter is under 5 years old and within warranty, component repair or manufacturer warranty replacement is ideal. If the unit is over 8–10 years old, replacing it with a modern, high-efficiency hybrid inverter is usually more cost-effective, comes with a fresh 10-year warranty, and adds battery compatibility.",
    },
    {
      question: "How quickly can Hujurat Solar attend to an emergency solar repair in Western Sydney?",
      answer:
        "We offer rapid-response repair callouts across Greater Sydney and Western Sydney (including Mount Druitt, Parramatta, Penrith, and Blacktown), typically attending within 24 to 48 hours to secure hazardous isolators and restore lost energy production.",
    },
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
