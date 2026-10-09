"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Sun,
  Shield,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  BatteryCharging,
  Building2,
  Home,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

type Plan = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: string;
  priceSuffix: string | null;
  originalPrice: string | null;
  badge: string | null;
  image: string | null;
  ctaText: string;
  ctaLink: string;
  features: string;
  specifications: string;
  systemSizeKw: string | null;
  panelCount: string | null;
  panelBrand: string | null;
  inverterBrand: string | null;
  featured: boolean;
  order: number;
  status: string;
};

type Spec = { label: string; value: string };

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Helper to determine finance estimate based on price
function getWeeklyFinance(priceStr: string): string | null {
  const num = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  if (isNaN(num) || num <= 0) return null;
  // Standard Australian green loan 5-year rate (~$5.80/wk per $1000)
  const weekly = Math.round((num * 6) / 1000);
  return `From ~$${weekly}/wk ($0 upfront)`;
}

export default function PricingSection({ plans }: { plans: Plan[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "residential" | "battery" | "commercial">("residential");
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);

  // Filter plans according to selected tab
  const filteredPlans = plans.filter((plan) => {
    if (activeTab === "all") return true;
    const slug = plan.slug.toLowerCase();
    const title = plan.title.toLowerCase();
    if (activeTab === "battery") {
      return slug.includes("battery") || title.includes("battery");
    }
    if (activeTab === "commercial") {
      return slug.includes("commercial") || title.includes("commercial");
    }
    if (activeTab === "residential") {
      return !slug.includes("commercial") && !slug.includes("battery");
    }
    return true;
  });

  const toggleSpecs = (id: number) => {
    setExpandedPlanId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-12">
      {/* Australian Market Pricing Banner */}
      <div className="mx-auto max-w-4xl rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-4 text-center shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-slate-800">
          <span className="flex items-center gap-1.5 text-amber-700">
            <Sparkles className="h-4 w-4" /> Sydney Metro Pricing
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Federal STC Rebates Factored In
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Standard Single-Storey Installation Included
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-100/90 p-1.5 shadow-sm">
          {[
            { id: "residential", label: "Residential Solar", icon: Home, count: 3 },
            { id: "battery", label: "Solar + Battery", icon: BatteryCharging, count: 1 },
            { id: "commercial", label: "Commercial", icon: Building2, count: 1 },
            { id: "all", label: "All Packages", icon: Sun, count: plans.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-slate-950 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-brand" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive ? "bg-slate-800 text-brand" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div
        className={`mx-auto grid gap-6 sm:gap-8 ${
          filteredPlans.length === 1
            ? "max-w-xl"
            : filteredPlans.length === 2
            ? "max-w-4xl md:grid-cols-2"
            : "max-w-7xl md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {filteredPlans.map((plan) => {
          const features = parseJson<string[]>(plan.features, []);
          const specs = parseJson<Spec[]>(plan.specifications, []);
          const isFeatured = plan.featured;
          const isExpanded = expandedPlanId === plan.id;
          const weeklyFinance = getWeeklyFinance(plan.price);

          // Find daily output & annual savings from specs
          const dailyOutputSpec = specs.find(
            (s) => s.label.toLowerCase().includes("daily") || s.label.toLowerCase().includes("output")
          );
          const annualSavingsSpec = specs.find(
            (s) => s.label.toLowerCase().includes("saving") || s.label.toLowerCase().includes("reduction")
          );

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${
                isFeatured
                  ? "border-amber-400 ring-2 ring-amber-400/20 shadow-amber-500/10"
                  : "border-slate-200"
              }`}
            >
              {/* Top Banner Ribbon for Badges */}
              {isFeatured ? (
                <div className="bg-gradient-to-r from-amber-400 via-brand to-amber-400 px-4 py-2 text-center text-xs font-black uppercase tracking-wider text-slate-950 flex items-center justify-center gap-1.5 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-slate-950" />
                  {plan.badge || "Most Popular Choice in Sydney"}
                </div>
              ) : plan.badge ? (
                <div className="bg-slate-900 px-4 py-1.5 text-center text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-brand" />
                  {plan.badge}
                </div>
              ) : null}

              {/* Card Photo Preview */}
              {plan.image && (
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={plan.image}
                    alt={plan.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                  
                  {/* System size chip overlay */}
                  {plan.systemSizeKw && (
                    <div className="absolute bottom-3 left-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-extrabold text-brand border border-white/10 shadow-sm">
                        <Zap className="h-3.5 w-3.5" />
                        {plan.systemSizeKw} System
                      </span>
                    </div>
                  )}

                  {plan.panelCount && (
                    <div className="absolute bottom-3 right-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm">
                        <Sun className="h-3 w-3 text-amber-500" />
                        {plan.panelCount.toLowerCase().includes("panel") ? plan.panelCount : `${plan.panelCount} Panels`}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-display text-xl font-extrabold text-slate-950 tracking-tight">
                    {plan.title}
                  </h3>
                  {plan.subtitle && (
                    <p className="mt-1 text-xs font-medium text-slate-500 line-clamp-2">
                      {plan.subtitle}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-baseline gap-2">
                    {plan.originalPrice && (
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                      {plan.price}
                    </span>
                  </div>

                  {plan.priceSuffix && (
                    <p className="mt-1 text-xs font-semibold text-emerald-700">
                      ✓ {plan.priceSuffix}
                    </p>
                  )}

                  {weeklyFinance && (
                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      ⚡ {weeklyFinance}
                    </p>
                  )}
                </div>

                {/* Australian Quick Specs Micro-Grid */}
                <div className="my-5 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 text-center">
                  <div className="px-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Generation</p>
                    <p className="mt-0.5 text-xs font-extrabold text-slate-800">
                      {dailyOutputSpec?.value.replace("/ day", "").replace("/day", "") || "High Yield"}
                    </p>
                  </div>
                  <div className="px-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Savings</p>
                    <p className="mt-0.5 text-xs font-extrabold text-emerald-700">
                      {annualSavingsSpec?.value.replace("/ year", "").replace("/year", "") || "Significant"}
                    </p>
                  </div>
                  <div className="px-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hardware</p>
                    <p className="mt-0.5 text-xs font-extrabold text-slate-800 truncate" title={plan.inverterBrand || "Tier 1"}>
                      {plan.inverterBrand ? plan.inverterBrand.split(" ")[0] : "Tier 1"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {plan.description && (
                  <p className="text-xs leading-relaxed text-slate-600 line-clamp-3 mb-4">
                    {plan.description}
                  </p>
                )}

                {/* Key Features Bullet Points */}
                {features.length > 0 && (
                  <div className="flex-1 space-y-2 border-t border-slate-100 pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Inclusions
                    </p>
                    <ul className="space-y-2 text-xs">
                      {features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={3} />
                          <span className="text-slate-700 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Collapsible Full Specs & Extra Features */}
                {(features.length > 5 || specs.length > 0) && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => toggleSpecs(plan.id)}
                      className="flex w-full items-center justify-between text-xs font-bold text-brand-dark hover:text-brand"
                    >
                      <span>{isExpanded ? "Hide detailed specifications" : "View technical specifications & more"}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 rounded-xl bg-slate-50 p-3.5 text-xs animate-in fade-in duration-200">
                        {features.length > 5 && (
                          <div>
                            <p className="mb-2 font-bold uppercase text-[10px] tracking-wider text-slate-400">
                              Additional Features
                            </p>
                            <ul className="space-y-1.5">
                              {features.slice(5).map((feature, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                                  <span className="text-slate-600">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {specs.length > 0 && (
                          <div className={features.length > 5 ? "border-t border-slate-200/60 pt-3" : ""}>
                            <p className="mb-2 font-bold uppercase text-[10px] tracking-wider text-slate-400">
                              Technical Hardware Specifications
                            </p>
                            <dl className="space-y-1.5">
                              {specs.map((spec, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <dt className="text-slate-500">{spec.label}</dt>
                                  <dd className="font-semibold text-slate-900 text-right">{spec.value}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <div className="mt-6 pt-2">
                  <Link
                    href={plan.ctaLink}
                    className={`group flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-all duration-200 ${
                      isFeatured
                        ? "bg-gradient-to-r from-amber-400 via-brand to-amber-400 text-slate-950 shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5"
                        : "bg-slate-950 text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <p className="mt-2 text-center text-[11px] text-slate-400 font-medium">
                    100% Free Quote • No High-Pressure Sales
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Australian Solar Comparison Table */}
      <div className="mx-auto max-w-7xl pt-10">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Side-By-Side Comparison
          </span>
          <h3 className="font-display text-2xl font-extrabold text-slate-950 sm:text-3xl">
            Compare Solar Packages at a Glance
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Review technical outputs, warranties, and target household types across our Sydney packages.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="py-4 px-5 font-bold">Package Specification</th>
                {plans.map((p) => (
                  <th key={p.id} className="py-4 px-4 font-bold text-center">
                    <span className="block text-brand text-xs uppercase tracking-wider font-extrabold">
                      {p.systemSizeKw || p.title.split(" ")[0]}
                    </span>
                    <span className="text-white text-xs font-medium">{p.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-5 font-bold text-slate-900">Installed Price (Inc. STC)</td>
                {plans.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 text-center font-extrabold text-slate-950">
                    {p.price}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Avg. Daily Output (Sydney)</td>
                <td className="py-3.5 px-4 text-center">24 – 28 kWh</td>
                <td className="py-3.5 px-4 text-center">38 – 45 kWh</td>
                <td className="py-3.5 px-4 text-center">50 – 58 kWh</td>
                <td className="py-3.5 px-4 text-center">36 kWh + 10kWh Stored</td>
                <td className="py-3.5 px-4 text-center">60 – 400+ kWh</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-5 font-semibold text-slate-700">Est. Annual Bill Savings</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-700">$1,400 – $1,900</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-700">$2,400 – $3,100</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-700">$3,200 – $4,200</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-700">Up to $3,500+</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-700">$4,500 – $30,000+</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Best For Household Type</td>
                <td className="py-3.5 px-4 text-center text-xs">2–4 Bed ($350–$650 bills)</td>
                <td className="py-3.5 px-4 text-center text-xs">4–5 Bed (Ducted AC / Pool / EV)</td>
                <td className="py-3.5 px-4 text-center text-xs">All-Electric / High Energy</td>
                <td className="py-3.5 px-4 text-center text-xs">24/7 Grid Independence</td>
                <td className="py-3.5 px-4 text-center text-xs">Offices, Warehouses, Strata</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-5 font-semibold text-slate-700">Panels Supplied</td>
                {plans.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 text-center text-xs">
                    {p.panelCount || "Tier 1"} {p.panelBrand ? `(${p.panelBrand.split(" ")[0]})` : ""}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Inverter Technology</td>
                {plans.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 text-center text-xs font-medium">
                    {p.inverterBrand || "Tier 1 CEC Approved"}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-5 font-semibold text-slate-700">Battery Ready / Included</td>
                <td className="py-3.5 px-4 text-center text-emerald-700 font-semibold">✓ Hybrid Ready</td>
                <td className="py-3.5 px-4 text-center text-emerald-700 font-semibold">✓ Hybrid Ready</td>
                <td className="py-3.5 px-4 text-center text-emerald-700 font-semibold">✓ Hybrid Ready</td>
                <td className="py-3.5 px-4 text-center text-amber-600 font-extrabold">✓ 10kWh Included</td>
                <td className="py-3.5 px-4 text-center text-slate-500">Commercial Storage Ready</td>
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-semibold text-slate-700">Warranty Coverage</td>
                <td className="py-3.5 px-4 text-center text-xs">25 Yrs Panel / 10 Yrs Inverter</td>
                <td className="py-3.5 px-4 text-center text-xs">25 Yrs Panel / 10 Yrs Inverter</td>
                <td className="py-3.5 px-4 text-center text-xs">25 Yrs Panel / 10 Yrs Inverter</td>
                <td className="py-3.5 px-4 text-center text-xs">25 Yrs Panel / 10 Yrs Battery</td>
                <td className="py-3.5 px-4 text-center text-xs">25 Yrs Panel / 12 Yrs Inverter</td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="py-3.5 px-5 font-semibold text-slate-700">Action</td>
                {plans.map((p) => (
                  <td key={p.id} className="py-3.5 px-4 text-center">
                    <Link
                      href={p.ctaLink}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-dark transition"
                    >
                      Quote <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
