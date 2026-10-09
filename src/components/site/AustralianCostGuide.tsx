"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sun,
  Shield,
  Zap,
  Battery,
  DollarSign,
  TrendingDown,
  Home,
  Building2,
  MapPin,
  Award,
  Cpu,
  Info,
  Bolt,
  Landmark,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Calculator,
  Clock,
  Star,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────
   AUSTRALIAN SOLAR COST GUIDE (2026 Research-Backed Data)
   
   Sources:
   - solarquotes.com.au (national pricing database)
   - solarchoice.net.au (installer comparison data)
   - Australian Clean Energy Council (CEC) guidelines
   - Federal STC scheme (Small-scale Renewable Energy Scheme)
   - Cheaper Home Batteries Program (Federal, mid-2025+)
   - Ausgrid & Endeavour Energy grid connection guidelines
   ────────────────────────────────────────────────────────────────── */

const RESIDENTIAL_COSTS = [
  {
    size: "3kW",
    panels: "7–8 panels",
    range: "$3,500 – $5,500",
    avgDaily: "12–14 kWh",
    annualSavings: "$800 – $1,200",
    bestFor: "Small apartment, 1–2 person household",
    payback: "3–4 years",
  },
  {
    size: "5kW",
    panels: "12–13 panels",
    range: "$5,000 – $7,500",
    avgDaily: "20–23 kWh",
    annualSavings: "$1,200 – $1,700",
    bestFor: "Small home, 2–3 bedroom, moderate usage",
    payback: "3–4 years",
  },
  {
    size: "6.6kW",
    panels: "15–16 panels",
    range: "$5,500 – $8,500",
    avgDaily: "24–28 kWh",
    annualSavings: "$1,400 – $2,100",
    bestFor: "Average Sydney home, 3–4 bedroom",
    payback: "3–5 years",
    popular: true,
  },
  {
    size: "8kW",
    panels: "18–20 panels",
    range: "$7,500 – $11,000",
    avgDaily: "30–36 kWh",
    annualSavings: "$1,800 – $2,700",
    bestFor: "Larger home, ducted AC, pool pump",
    payback: "3–5 years",
  },
  {
    size: "10kW",
    panels: "23–25 panels",
    range: "$9,000 – $13,000",
    avgDaily: "38–45 kWh",
    annualSavings: "$2,400 – $3,400",
    bestFor: "Large family, EV charging, high usage",
    payback: "3–5 years",
  },
  {
    size: "13kW",
    panels: "30–32 panels",
    range: "$11,000 – $16,000",
    avgDaily: "50–58 kWh",
    annualSavings: "$3,200 – $4,500",
    bestFor: "All-electric home, dual-storey, multiple split systems",
    payback: "3–5 years",
  },
];

const BATTERY_PACKAGES = [
  {
    config: "6.6kW Solar + 5kWh Battery",
    price: "$9,500 – $13,500",
    stored: "5 kWh",
    backupHours: "4–6 hrs (essentials)",
    annualSavings: "$2,200 – $3,000",
    bestFor: "Partial grid independence, evening offset",
  },
  {
    config: "6.6kW Solar + 10kWh Battery",
    price: "$12,500 – $17,500",
    stored: "10 kWh",
    backupHours: "8–12 hrs (essentials)",
    annualSavings: "$2,800 – $3,800",
    bestFor: "Near-complete grid independence",
    popular: true,
  },
  {
    config: "10kW Solar + 10kWh Battery",
    price: "$16,000 – $22,000",
    stored: "10 kWh",
    backupHours: "8–12 hrs",
    annualSavings: "$3,500 – $4,800",
    bestFor: "High-usage homes, EV + battery combo",
  },
  {
    config: "10kW Solar + 15kWh Battery",
    price: "$21,000 – $27,000",
    stored: "15 kWh",
    backupHours: "12–18 hrs",
    annualSavings: "$4,200 – $5,500",
    bestFor: "Maximum self-sufficiency",
  },
];

const INVERTER_TYPES = [
  {
    type: "String Inverter",
    brands: "Fronius, SMA, Goodwe",
    costRange: "$1,200 – $2,500",
    pros: "Cost-effective, reliable, ideal for simple north-facing roofs",
    cons: "Entire string affected by shading on one panel",
    bestFor: "Simple roof layouts with minimal shading",
    icon: Cpu,
  },
  {
    type: "Hybrid Inverter",
    brands: "Sungrow, Goodwe, Fronius Gen24",
    costRange: "$1,800 – $3,500",
    pros: "Battery-ready from day one, manages solar + battery in one unit",
    cons: "Slightly higher upfront cost than string-only",
    bestFor: "Planning to add a battery now or later",
    icon: Battery,
    popular: true,
  },
  {
    type: "Microinverters",
    brands: "Enphase IQ8, Hoymiles",
    costRange: "$2,500 – $4,500",
    pros: "Panel-level optimisation, eliminates shading losses, 25-year warranty",
    cons: "Higher per-panel cost, more components on roof",
    bestFor: "Complex roofs, partial shading, multiple orientations",
    icon: Zap,
  },
  {
    type: "All-in-One (Integrated)",
    brands: "Tesla Powerwall 3, Sigenergy",
    costRange: "$8,000 – $14,000 (inc. battery)",
    pros: "Inverter built into battery, simplified install, seamless backup",
    cons: "Higher total cost, less component flexibility",
    bestFor: "Premium installs wanting complete integrated system",
    icon: Bolt,
  },
];

const COMMERCIAL_TIERS = [
  { size: "15–30kW", type: "Small Business / Retail", pricePerKw: "$900 – $1,100", totalRange: "$13,500 – $33,000" },
  { size: "30–50kW", type: "Medium Business / Office", pricePerKw: "$800 – $1,000", totalRange: "$24,000 – $50,000" },
  { size: "50–100kW", type: "Warehouse / Industrial", pricePerKw: "$750 – $950", totalRange: "$37,500 – $95,000" },
  { size: "100kW+", type: "Large Commercial / Strata", pricePerKw: "$700 – $900", totalRange: "From $70,000+" },
];

type TabId = "residential" | "battery" | "inverters" | "commercial" | "rebates";

export default function AustralianCostGuide() {
  const [activeTab, setActiveTab] = useState<TabId>("residential");

  const tabs: { id: TabId; label: string; icon: typeof Sun }[] = [
    { id: "residential", label: "Residential Solar", icon: Home },
    { id: "battery", label: "Solar + Battery", icon: Battery },
    { id: "inverters", label: "Inverter Guide", icon: Cpu },
    { id: "commercial", label: "Commercial", icon: Building2 },
    { id: "rebates", label: "Rebates & Incentives", icon: Landmark },
  ];

  return (
    <section id="cost-guide" className="border-t border-slate-200 bg-slate-50 py-16 sm:py-24 scroll-mt-20">
      <div className="section-container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            2026 Australian Solar Market Guide
          </span>
          <h2 className="font-display text-3xl font-extrabold text-slate-950 sm:text-4xl text-balance">
            How much does solar cost in Australia?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transparent, research-backed pricing data for residential and commercial solar panel systems across Sydney and Australia.
            All prices shown are <strong>fully installed after Federal STC rebates</strong>.
          </p>
        </div>

        {/* Quick Stats Banner */}
        <div className="mx-auto mt-10 max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Average Cost / kW", value: "~$1,000", sub: "Residential (after rebates)", icon: DollarSign },
            { label: "STC Rebate (6.6kW)", value: "$2,200–$3,800", sub: "Sydney Zone 3", icon: TrendingDown },
            { label: "Battery Rebate", value: "~$252/kWh", sub: "Federal program (2025+)", icon: Battery },
            { label: "Avg. Payback Period", value: "3–5 Years", sub: "Sydney metro", icon: Clock },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:shadow-md hover:border-brand/30"
            >
              <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand-dark">
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="font-display text-xl font-extrabold text-slate-950 sm:text-2xl">{stat.value}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="mt-0.5 text-[10px] text-slate-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-slate-950 text-white shadow-md"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-brand" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-10 mx-auto max-w-6xl">
          {/* ─── RESIDENTIAL SOLAR ─── */}
          {activeTab === "residential" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center">
                <h3 className="font-display text-2xl font-extrabold text-slate-950">
                  Residential Solar Panel System Costs (2026)
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
                  Prices reflect fully installed systems including Tier 1 panels, inverter, mounting,
                  cabling, electrical work, Ausgrid/Endeavour grid connection approvals, and Federal STC rebates.
                </p>
              </div>

              {/* Cost Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm min-w-[800px]">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="py-4 px-5 font-bold">System Size</th>
                      <th className="py-4 px-4 font-bold">Panels</th>
                      <th className="py-4 px-4 font-bold">Installed Price<br /><span className="text-brand text-[10px] font-normal">(After STC)</span></th>
                      <th className="py-4 px-4 font-bold">Daily Output<br /><span className="text-slate-400 text-[10px] font-normal">(Sydney avg)</span></th>
                      <th className="py-4 px-4 font-bold">Annual Savings</th>
                      <th className="py-4 px-4 font-bold">Payback</th>
                      <th className="py-4 px-4 font-bold">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {RESIDENTIAL_COSTS.map((row) => (
                      <tr
                        key={row.size}
                        className={`transition hover:bg-amber-50/50 ${
                          row.popular ? "bg-amber-50/40 border-l-4 border-l-brand" : ""
                        }`}
                      >
                        <td className="py-4 px-5 font-extrabold text-slate-950 text-base">
                          <div className="flex items-center gap-2">
                            {row.size}
                            {row.popular && (
                              <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[9px] font-bold uppercase text-brand-dark">
                                Most Popular
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600">{row.panels}</td>
                        <td className="py-4 px-4 font-bold text-slate-950">{row.range}</td>
                        <td className="py-4 px-4 text-slate-700">{row.avgDaily}</td>
                        <td className="py-4 px-4 font-bold text-emerald-700">{row.annualSavings}</td>
                        <td className="py-4 px-4 font-semibold text-slate-700">{row.payback}</td>
                        <td className="py-4 px-4 text-xs text-slate-500">{row.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Key Insight Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10 text-brand-dark">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-slate-950">Sydney Metro Advantage</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    High installer competition in Sydney metro delivers consistently lower prices than regional areas.
                    Hujurat Solar services all of Greater Sydney and Western Sydney with competitive metro pricing.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10 text-brand-dark">
                      <Zap className="h-4 w-4" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-slate-950">The 6.6kW / 5kW Standard</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ausgrid and Endeavour Energy allow 5kW single-phase export. CEC permits 133% panel oversizing
                    (6.6kW panels + 5kW inverter) — maximising generation in sub-optimal conditions.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10 text-brand-dark">
                      <Award className="h-4 w-4" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-slate-950">Tier 1 Panels Only</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We exclusively install Tier 1 Bloomberg-rated solar panels (Jinko, Longi, Canadian Solar, Trina).
                    These offer the best balance of efficiency, durability, and manufacturer-backed 25-year warranties.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong>Pricing note:</strong> All prices are indicative averages for standard single-storey installations
                  in the Sydney metro area. Costs may vary for multi-storey homes, complex roof designs, switchboard upgrades,
                  or premium hardware selections. We recommend obtaining a free, tailored quote from Hujurat Solar for accurate pricing.
                </p>
              </div>
            </div>
          )}

          {/* ─── SOLAR + BATTERY ─── */}
          {activeTab === "battery" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center">
                <h3 className="font-display text-2xl font-extrabold text-slate-950">
                  Solar + Battery Storage Packages (2026)
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
                  Battery storage lets you use your solar energy at night and during peak tariff periods.
                  The Federal Cheaper Home Batteries Program can save you up to $3,500+ on eligible installations.
                </p>
              </div>

              {/* Battery Pricing Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {BATTERY_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.config}
                    className={`relative rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 ${
                      pkg.popular
                        ? "border-brand ring-2 ring-brand/20"
                        : "border-slate-200"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-6">
                        <span className="rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase text-slate-950 shadow-sm">
                          <Star className="inline h-3 w-3 mr-0.5 -mt-0.5" />
                          Best Value
                        </span>
                      </div>
                    )}
                    <h4 className="font-display text-base font-extrabold text-slate-950">{pkg.config}</h4>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-2xl font-extrabold text-slate-950">{pkg.price}</span>
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase">After rebates</span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Storage</p>
                        <p className="mt-0.5 text-xs font-extrabold text-slate-800">{pkg.stored}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Backup</p>
                        <p className="mt-0.5 text-xs font-extrabold text-slate-800">{pkg.backupHours}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Savings/yr</p>
                        <p className="mt-0.5 text-xs font-extrabold text-emerald-700">{pkg.annualSavings}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      <strong className="text-slate-700">Best for:</strong> {pkg.bestFor}
                    </p>

                    <Link
                      href="/contact"
                      className="mt-4 flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-dark transition"
                    >
                      Get a Quote <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Battery Brands We Install */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h4 className="font-display text-lg font-bold text-slate-950 mb-4">Popular Battery Brands We Install</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { brand: "Tesla Powerwall 3", capacity: "13.5 kWh", warranty: "10 Years", note: "All-in-one with inverter" },
                    { brand: "Sungrow SBR", capacity: "9.6–25.6 kWh", warranty: "10 Years", note: "Modular, expandable" },
                    { brand: "BYD HVS/HVM", capacity: "5.1–22.1 kWh", warranty: "10 Years", note: "High voltage, efficient" },
                    { brand: "Sigenergy", capacity: "5–20 kWh", warranty: "10 Years", note: "Integrated smart system" },
                  ].map((bat) => (
                    <div key={bat.brand} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                      <p className="font-display text-sm font-bold text-slate-950">{bat.brand}</p>
                      <p className="mt-1 text-xs text-slate-600">Capacity: {bat.capacity}</p>
                      <p className="text-xs text-slate-600">Warranty: {bat.warranty}</p>
                      <p className="mt-1 text-[10px] text-brand-dark font-semibold">{bat.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-start gap-3">
                <Battery className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                <p className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Federal Battery Rebate:</strong> The Cheaper Home Batteries Program provides approximately
                  $252 per usable kWh (up to 14kWh) as a point-of-sale discount — saving you over $3,500 on a
                  standard 14kWh battery. Our team handles all the paperwork and applies the discount automatically
                  to your invoice.
                </p>
              </div>
            </div>
          )}

          {/* ─── INVERTER GUIDE ─── */}
          {activeTab === "inverters" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center">
                <h3 className="font-display text-2xl font-extrabold text-slate-950">
                  Solar Inverter Types &amp; Comparison Guide
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
                  Your inverter converts DC solar energy to AC household power. Choosing the right type
                  impacts performance, future battery compatibility, and overall value.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {INVERTER_TYPES.map((inv) => {
                  const Icon = inv.icon;
                  return (
                    <div
                      key={inv.type}
                      className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                        inv.popular
                          ? "border-brand ring-2 ring-brand/20"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`grid h-12 w-12 place-items-center rounded-xl ${
                          inv.popular ? "bg-brand/20 text-brand-dark" : "bg-slate-100 text-slate-600"
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-display text-base font-extrabold text-slate-950 flex items-center gap-2">
                            {inv.type}
                            {inv.popular && (
                              <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[9px] font-bold uppercase text-brand-dark">
                                Recommended
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-500">{inv.brands}</p>
                        </div>
                      </div>

                      <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Typical Cost: </span>
                        <span className="text-sm font-extrabold text-slate-950">{inv.costRange}</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                          <span className="text-slate-700"><strong className="text-slate-900">Pros:</strong> {inv.pros}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
                          <span className="text-slate-700"><strong className="text-slate-900">Considerations:</strong> {inv.cons}</span>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        <strong className="text-slate-700">Best for:</strong> {inv.bestFor}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 flex items-start gap-3">
                <Cpu className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong>Our recommendation:</strong> For most Sydney homes, we recommend a <strong>Hybrid Inverter</strong> as
                  the best balance of cost and future-proofing. It handles your solar panels today and is ready for a
                  battery addition tomorrow — no rewiring or inverter replacement needed. All our inverters are CEC-approved
                  and carry a minimum 10-year manufacturer warranty.
                </p>
              </div>
            </div>
          )}

          {/* ─── COMMERCIAL ─── */}
          {activeTab === "commercial" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center">
                <h3 className="font-display text-2xl font-extrabold text-slate-950">
                  Commercial Solar Installation Costs (2026)
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
                  Commercial systems benefit from economies of scale — the larger the system, the lower
                  the cost per kilowatt. Businesses can also claim accelerated depreciation under ATO provisions.
                </p>
              </div>

              {/* Commercial Pricing Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="py-4 px-5 font-bold">System Size</th>
                      <th className="py-4 px-4 font-bold">Business Type</th>
                      <th className="py-4 px-4 font-bold">Cost per kW</th>
                      <th className="py-4 px-4 font-bold">Total Price Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {COMMERCIAL_TIERS.map((tier) => (
                      <tr key={tier.size} className="transition hover:bg-amber-50/50">
                        <td className="py-4 px-5 font-extrabold text-slate-950">{tier.size}</td>
                        <td className="py-4 px-4 text-slate-600">{tier.type}</td>
                        <td className="py-4 px-4 font-bold text-slate-800">{tier.pricePerKw}</td>
                        <td className="py-4 px-4 font-extrabold text-slate-950">{tier.totalRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Commercial Benefits */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10 text-brand-dark">
                      <TrendingDown className="h-4 w-4" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-slate-950">Instant Asset Write-Off</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Australian businesses can claim instant asset write-off (accelerated depreciation) for solar
                    systems, reducing taxable income in the financial year of installation.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10 text-brand-dark">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-slate-950">SRES Expanding to 1MW</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    From late 2026, the Small-scale Renewable Energy Scheme (SRES) is planned to expand eligibility
                    to systems up to 1MW — opening larger STC rebates for medium-to-large commercial installations.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10 text-brand-dark">
                      <Clock className="h-4 w-4" />
                    </div>
                    <h4 className="font-display text-sm font-bold text-slate-950">Fast ROI (2–4 Years)</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Commercial solar has the fastest ROI of any capital investment. Businesses consuming most power
                    during daytime peak hours see payback in as little as 2–3 years with reduced operational costs.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 flex items-start gap-3">
                <Building2 className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong>Commercial installations are custom-quoted.</strong> Pricing depends on roof condition,
                  electrical infrastructure, structural engineering, access requirements, and grid connection capacity.
                  Contact us for a free site assessment and detailed commercial proposal.
                </p>
              </div>
            </div>
          )}

          {/* ─── REBATES & INCENTIVES ─── */}
          {activeTab === "rebates" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center">
                <h3 className="font-display text-2xl font-extrabold text-slate-950">
                  Australian Government Solar Rebates &amp; Incentives (2026)
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
                  Federal and state incentives significantly reduce the upfront cost of solar. Here&apos;s what&apos;s
                  available for Sydney residents and businesses in 2026.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* STC Rebate */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Sun className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-extrabold text-slate-950">Federal STC Solar Rebate</h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">ACTIVE — Applied Automatically</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <p>
                      The <strong>Small-scale Technology Certificate (STC)</strong> scheme provides an upfront discount
                      based on your system size and location. Sydney is in <strong>Zone 3</strong>.
                    </p>
                    <div className="rounded-lg bg-slate-50 p-3 space-y-1">
                      <div className="flex justify-between"><span>6.6kW system:</span> <strong className="text-emerald-700">~$2,200 – $3,000 discount</strong></div>
                      <div className="flex justify-between"><span>10kW system:</span> <strong className="text-emerald-700">~$3,200 – $3,800 discount</strong></div>
                      <div className="flex justify-between"><span>13kW system:</span> <strong className="text-emerald-700">~$4,000 – $4,800 discount</strong></div>
                    </div>
                    <p className="text-slate-500">
                      ⚠️ The STC rebate <strong>reduces every year</strong> until the scheme ends in 2030. Installing
                      sooner locks in a higher discount value.
                    </p>
                  </div>
                </div>

                {/* Battery Rebate */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-700">
                      <Battery className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-extrabold text-slate-950">Federal Battery Rebate</h4>
                      <p className="text-[11px] text-blue-700 font-semibold">ACTIVE — Cheaper Home Batteries Program</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <p>
                      Launched mid-2025, this program provides approximately <strong>$252 per usable kWh</strong> (up to
                      14kWh) as a point-of-sale discount on eligible battery installations.
                    </p>
                    <div className="rounded-lg bg-slate-50 p-3 space-y-1">
                      <div className="flex justify-between"><span>5kWh battery:</span> <strong className="text-blue-700">~$1,260 discount</strong></div>
                      <div className="flex justify-between"><span>10kWh battery:</span> <strong className="text-blue-700">~$2,520 discount</strong></div>
                      <div className="flex justify-between"><span>14kWh battery:</span> <strong className="text-blue-700">~$3,528 discount</strong></div>
                    </div>
                    <p className="text-slate-500">
                      Available for both new battery installations and retrofits. Must use CEC-approved products and
                      accredited installers. Up to 30% discount for eligible households.
                    </p>
                  </div>
                </div>

                {/* NSW Specific */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-700">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-extrabold text-slate-950">NSW State Incentives</h4>
                      <p className="text-[11px] text-amber-700 font-semibold">Sydney &amp; Greater Western Sydney</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <p>
                      New South Wales offers additional support through various programs:
                    </p>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                        <span><strong>Peak Demand Reduction Scheme:</strong> Incentives for battery storage that helps reduce peak grid demand</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                        <span><strong>Feed-in Tariff:</strong> Earn 5–8c/kWh for excess solar exported to the grid (retailer-dependent)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                        <span><strong>Green Loans:</strong> Low-interest sustainability loans from participating NSW lenders</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Business Tax */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-100 text-purple-700">
                      <Landmark className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-extrabold text-slate-950">Business Tax Benefits</h4>
                      <p className="text-[11px] text-purple-700 font-semibold">ATO Provisions for Commercial Solar</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <p>
                      Australian businesses benefit from multiple tax advantages when investing in solar:
                    </p>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                        <span><strong>Instant Asset Write-Off:</strong> Deduct the full cost of solar in the year of installation (for eligible businesses)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                        <span><strong>GST Credits:</strong> Claim back the GST component (10%) on your solar investment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                        <span><strong>Accelerated Depreciation:</strong> Enhanced deductions for clean energy assets</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong>Important:</strong> The STC rebate decreases annually and is scheduled to end in 2030.
                  Every year you delay installation, the rebate value drops. Installing in 2026 locks in one of the
                  highest remaining discount values. Our team handles all government paperwork and applies all
                  eligible rebates directly to your invoice — you never need to lodge paperwork yourself.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-sm text-slate-500 mb-5">
            All pricing data is based on 2026 Australian market averages. For a precise, tailored quote for your property:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-dark hover:-translate-y-0.5"
            >
              Get Your Free Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/solar-calculator"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition hover:border-brand/40 hover:shadow-md"
            >
              <Calculator className="h-4 w-4 text-brand" />
              Try Solar Calculator
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
