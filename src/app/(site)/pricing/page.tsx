import Link from "next/link";
import Image from "next/image";
import {
  Check,
  ArrowRight,
  Sun,
  Shield,
  Zap,
  PhoneCall,
  Star,
  BadgeCheck,
  ChevronRight,
  Calculator,
  HelpCircle,
  Sparkles,
  TrendingDown,
  DollarSign,
  Battery,
  Cpu,
  Home,
  Building2,
  MapPin,
  Award,
  Clock,
  ArrowDown,
  Info,
  Bolt,
  Landmark,
} from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PricingSection from "@/components/site/PricingSection";
import AustralianCostGuide from "@/components/site/AustralianCostGuide";
import { getPublishedPricingPlans } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Solar Panel Pricing & Packages Sydney 2026 | Australian Solar Costs | Hujurat Solar",
  description:
    "Compare Australian solar panel packages and pricing for 2026. Residential 6.6kW from $5,500, 10kW systems, battery storage, and commercial solutions. STC rebates included, CEC-accredited installation, 25-year warranties. Transparent pricing — no hidden fees.",
  path: "/pricing",
});

export default async function PricingPage() {
  const plans = await getPublishedPricingPlans();

  return (
    <div>
      <Breadcrumbs items={[{ name: "Pricing", path: "/pricing" }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 sm:py-28">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,183,27,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,27,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand/8 blur-[120px]" />

        <div className="section-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
              <Sun className="h-3.5 w-3.5" />
              2026 Australian Solar Packages &amp; Pricing
            </div>
            <h1 className="font-display text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl text-balance">
              Premium solar systems at{" "}
              <span className="bg-gradient-to-r from-brand via-amber-300 to-brand bg-clip-text text-transparent">
                transparent prices
              </span>
            </h1>
            <p className="mt-6 text-base text-slate-400 sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Every package includes CEC-accredited installation, premium Tier 1 components, comprehensive
              warranties, and ongoing monitoring — no hidden fees, no surprises. All prices include Federal STC rebates.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-brand" /> 25-Year Warranty
              </span>
              <span className="h-3 w-px bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-brand" /> CEC Accredited
              </span>
              <span className="h-3 w-px bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-brand" /> Free Monitoring
              </span>
              <span className="h-3 w-px bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-brand" /> STC Rebates Included
              </span>
            </div>

            {/* Quick jump link */}
            <div className="mt-10">
              <a
                href="#cost-guide"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand transition"
              >
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                See full Australian solar cost breakdown below
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Explorer with Filter Tabs, Cards & Comparison Matrix */}
      <section className="section-container relative -mt-10 pb-20 sm:-mt-14 sm:pb-24">
        <PricingSection plans={plans} />
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COMPREHENSIVE AUSTRALIAN SOLAR COST GUIDE
          Research-backed section with real market data for 2026
          ═══════════════════════════════════════════════════════════════ */}
      <AustralianCostGuide />

      {/* Solar Savings Calculator Banner */}
      <section className="section-container pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-r from-amber-500/10 via-amber-50 to-brand/10 p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark mb-3">
                <Calculator className="h-3.5 w-3.5" />
                Sydney Solar ROI Calculator
              </div>
              <h2 className="font-display text-2xl font-extrabold text-slate-950 sm:text-3xl">
                Unsure which package is right for you?
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">
                Calculate your estimated quarterly electricity bill savings, payback period, and recommended system size in less than 60 seconds.
              </p>
            </div>
            <Link
              href="/solar-calculator"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-brand-dark hover:shadow-xl hover:-translate-y-0.5"
            >
              <Calculator className="h-4 w-4 text-brand" />
              Launch Solar Calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing FAQs Section */}
      <section className="border-t border-slate-200 bg-white py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-950 sm:text-3xl">
              Solar Package &amp; Pricing FAQs
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Clear, transparent answers about Australian solar costs, rebates, and installations.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {[
              {
                q: "Are Australian Government STC rebates included in these prices?",
                a: "Yes! All package prices listed include the Federal Government Small-scale Technology Certificate (STC) discount. For Sydney (Zone 3), a 6.6kW system earns approximately $2,200–$3,800 in STCs. We handle all compliance paperwork and assign the rebate directly, keeping your out-of-pocket payment as low as possible.",
              },
              {
                q: "How much does a typical residential solar system cost in Australia in 2026?",
                a: "The average Australian residential solar system costs approximately $1,000 per kW installed after rebates. A popular 6.6kW system ranges from $5,500–$8,500 fully installed with Tier 1 panels, hybrid inverter, and all approvals. Premium hardware or complex roofs may cost more, while our competitive Sydney metro pricing keeps costs at the lower end.",
              },
              {
                q: "What size solar system does my household need?",
                a: "A 6.6kW system is the gold standard for most 3–4 bedroom Sydney households with electricity bills around $350–$700/quarter. If you run ducted air conditioning, heat a pool, or charge an EV, a 10kW or 13kW system will provide optimal self-consumption. We recommend booking a free consultation for a tailored assessment.",
              },
              {
                q: "How much can I save with a solar + battery package?",
                a: "A 6.6kW solar + 10kWh battery system can reduce your electricity bill by 80–90%. Without a battery, solar alone typically saves 50–70%. Battery storage lets you store excess daytime generation and use it at night when grid electricity costs peak (often 35–50c/kWh in NSW). With the new Federal Battery Rebate (~$252/kWh), battery payback periods have dropped to 5–7 years.",
              },
              {
                q: "Can I add a battery storage system in the future?",
                a: "Yes. All our standard inverter installations use hybrid-ready or fully hybrid inverters compatible with modular AC-coupled batteries like Tesla Powerwall 3, Sungrow SBR, and Sigenergy. You can add a battery at any time without replacing your inverter.",
              },
              {
                q: "What is the Federal Battery Rebate and am I eligible?",
                a: "Introduced in mid-2025, the Cheaper Home Batteries Program provides approximately $252 per usable kWh (up to 14kWh) as a point-of-sale discount. This can save you over $3,500 on a standard battery installation. Eligibility extends to most Australian households and small businesses. Our team handles all the paperwork.",
              },
              {
                q: "What warranties are included with my installation?",
                a: "We only supply Tier 1 CEC-approved hardware. You receive a 25-Year Linear Performance Warranty on solar panels, 10–12 years on inverters, 10 years on lithium batteries, and our own 10-Year Sydney Workmanship Guarantee covering all wiring, mounting, and waterproofing.",
              },
              {
                q: "How long does the installation take?",
                a: "Most residential solar installations (up to 10kW) take just 1 business day. Larger commercial systems may require 2–5 days depending on size. Our CEC-accredited electricians perform a clean, professional install with full Ausgrid / Endeavour Energy grid connection and meter upgrade coordination included.",
              },
              {
                q: "Why is the 6.6kW system on a 5kW inverter the Australian standard?",
                a: "Both Ausgrid and Endeavour Energy allow up to 5kW single-phase inverter export in Sydney. The Clean Energy Council permits up to 133% panel oversizing — meaning 6.6kW of panels on a 5kW inverter. This configuration maximises your generation in early morning, late afternoon, and cloudy conditions when panels produce less than rated capacity.",
              },
              {
                q: "Do you offer flexible payment plans or financing?",
                a: "Yes, we partner with leading Australian green loan providers offering flexible $0-deposit finance terms from approximately $30–$55/week depending on system size. Your monthly energy savings typically help offset repayments from day one. Interest-free options are also available for eligible customers.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition hover:border-brand/40 hover:bg-white hover:shadow-md"
              >
                <h3 className="font-display text-base font-bold text-slate-900">{faq.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 sm:py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-extrabold text-slate-950 sm:text-3xl">
              Why choose Hujurat Solar?
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Every system we install comes with industry-leading quality and support.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "25-Year Warranty",
                desc: "Full product and performance warranties on all panels and inverters.",
              },
              {
                icon: BadgeCheck,
                title: "CEC Accredited",
                desc: "All installations by Clean Energy Council accredited installers.",
              },
              {
                icon: Zap,
                title: "Premium Components",
                desc: "Only Tier 1 panels and top-brand inverters for maximum performance.",
              },
              {
                icon: Star,
                title: "Free Monitoring",
                desc: "Track your system performance in real time with our included monitoring app.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:border-brand/40"
              >
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand-dark transition group-hover:bg-brand group-hover:text-slate-950">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-brand py-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,18,37,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(6,18,37,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="section-container relative z-10 flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl font-display text-3xl font-extrabold text-slate-950 sm:text-4xl text-balance">
            Need a custom solar solution?
          </h2>
          <p className="max-w-xl text-sm text-slate-900/80">
            Every roof is different. Get a free, no-obligation quote designed around your property,
            usage, and budget — we&apos;ll find the perfect system for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-950/20 bg-white/40 px-7 py-4 text-sm font-semibold text-slate-950 transition hover:bg-white/70"
            >
              <PhoneCall className="h-4 w-4" /> {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
