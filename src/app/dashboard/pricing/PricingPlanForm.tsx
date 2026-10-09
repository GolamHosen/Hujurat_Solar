"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  DollarSign,
  Zap,
  Sparkles,
  Shield,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  Search,
  ExternalLink,
  Star,
  Sun,
  Loader2,
  FileText,
  Sliders,
  Tag,
  HelpCircle,
} from "lucide-react";
import ImageUploadField from "@/components/dashboard/ImageUploadField";
import type { pricingPlans } from "@/db/schema";

type PricingPlan = typeof pricingPlans.$inferSelect;

interface SpecItem {
  label: string;
  value: string;
}

const AUSTRALIAN_FEATURE_SUGGESTIONS = [
  "Clean Energy Council (CEC) Accredited Installation",
  "Federal STC Rebates Claimed at Point of Sale",
  "25-Year Linear Panel Performance Warranty",
  "10-Year Inverter Manufacturer Warranty",
  "10-Year Comprehensive Workmanship Guarantee",
  "Smart WiFi Solar & Consumption Monitoring App",
  "Battery-Ready Hybrid Inverter Architecture",
  "Tier-1 N-Type TOPCon High-Efficiency Modules",
  "Level 2 Smart Meter Grid Connection Coordination",
  "$0 Upfront Green Loan Finance Available",
];

const SYSTEM_SIZE_PRESETS = [
  { size: "6.6kW", panels: "15-16 Panels", desc: "Best for 3-4 Bedroom Sydney Homes" },
  { size: "10kW", panels: "23-24 Panels", desc: "For High Usage, Air Con & Pool" },
  { size: "13.2kW", panels: "30-32 Panels", desc: "Max Residential 3-Phase Solar" },
  { size: "15kW+", panels: "Commercial", desc: "Small Business & Commercial Roofs" },
];

function getWeeklyFinance(priceStr: string): string | null {
  const num = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  if (isNaN(num) || num <= 0) return null;
  const weekly = Math.round((num * 6) / 1000);
  return `From ~$${weekly}/wk ($0 upfront)`;
}

export default function PricingPlanForm({
  action,
  plan,
}: {
  action: (formData: FormData) => Promise<void> | void;
  plan?: PricingPlan;
}) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  // Core fields
  const [title, setTitle] = useState(plan?.title || "");
  const [slug, setSlug] = useState(plan?.slug || "");
  const [subtitle, setSubtitle] = useState(plan?.subtitle || "");
  const [description, setDescription] = useState(plan?.description || "");
  const [price, setPrice] = useState(plan?.price || "");
  const [priceSuffix, setPriceSuffix] = useState(plan?.priceSuffix || "fully installed");
  const [originalPrice, setOriginalPrice] = useState(plan?.originalPrice || "");
  const [badge, setBadge] = useState(plan?.badge || "");
  const [ctaText, setCtaText] = useState(plan?.ctaText || "Get a Free Quote");
  const [ctaLink, setCtaLink] = useState(plan?.ctaLink || "/contact");
  const [featured, setFeatured] = useState<boolean>(plan?.featured ?? false);
  const [order, setOrder] = useState<number>(plan?.order ?? 0);
  const [status, setStatus] = useState<string>(plan?.status || "published");

  // System Details
  const [systemSizeKw, setSystemSizeKw] = useState(plan?.systemSizeKw || "6.6kW");
  const [panelCount, setPanelCount] = useState(plan?.panelCount || "16 panels (440W)");
  const [panelBrand, setPanelBrand] = useState(
    plan?.panelBrand || "Jinko Solar Tiger Neo N-Type"
  );
  const [inverterBrand, setInverterBrand] = useState(
    plan?.inverterBrand || "Fronius Primo 5.0kW Gen24"
  );

  // Features list
  const initialFeatures: string[] = (() => {
    if (!plan?.features) return ["CEC Accredited Installation", "25-Year Warranty", "Smart WiFi Monitoring"];
    try {
      const parsed = JSON.parse(plan.features);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    } catch {
      return plan.features.split("\n").filter(Boolean);
    }
  })();
  const [features, setFeatures] = useState<string[]>(initialFeatures);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [rawFeaturesMode, setRawFeaturesMode] = useState(false);

  // Specifications
  const initialSpecs: SpecItem[] = (() => {
    if (!plan?.specifications) {
      return [
        { label: "System Size", value: "6.6 kW" },
        { label: "Panels", value: "16x 415W Tier 1" },
        { label: "Inverter", value: "5.0kW Single Phase" },
        { label: "Estimated Output", value: "24–28 kWh / day" },
      ];
    }
    try {
      const parsed = JSON.parse(plan.specifications);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const [specs, setSpecs] = useState<SpecItem[]>(initialSpecs);

  // SEO fields
  const [seoTitle, setSeoTitle] = useState(plan?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(plan?.seoDescription || "");

  // Auto-slug generator preview
  const displaySlug = slug
    ? slug
    : title
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "6-6kw-solar-package";

  const displaySeoTitle =
    seoTitle || (title ? `${title} | Australian Solar Packages | Hujurat Solar` : "Solar Packages & Pricing Sydney");
  const displaySeoDesc =
    seoDescription ||
    (description
      ? description
      : "CEC-accredited solar panel and inverter packages installed across Sydney & NSW. STC rebates included, 25-year warranty, free on-site assessment.");

  const weeklyEstimate = getWeeklyFinance(price);

  // Feature item handlers
  const handleAddFeature = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
    }
    setNewFeatureText("");
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Spec handlers
  const handleAddSpec = () => {
    setSpecs([...specs, { label: "", value: "" }]);
  };

  const handleUpdateSpec = (index: number, key: "label" | "value", val: string) => {
    const updated = [...specs];
    updated[index][key] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Sync features and specifications into formData
    formData.set("features", JSON.stringify(features));
    formData.set("specifications", JSON.stringify(specs.filter((s) => s.label.trim())));

    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        // Next.js redirect throws a digest error which is expected on success
        if (err && typeof err === "object" && "digest" in err && String((err as { digest: string }).digest).startsWith("NEXT_REDIRECT")) {
          return;
        }
        setFormError(err instanceof Error ? err.message : "Failed to save pricing plan.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-[1fr_400px]">
      {/* Hidden Plan ID field for non-bound and bound actions */}
      {plan?.id && <input type="hidden" name="id" value={plan.id} />}

      {/* LEFT COLUMN: Main Form Editor */}
      <div className="space-y-6 lg:col-span-2">
        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* Card 1: Plan Core Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-500" />
              <h2 className="font-display text-base font-bold text-slate-950">Package Overview</h2>
            </div>
            <span className="text-xs text-slate-400">Australian Market Spec</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Package Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 6.6kW Premium Residential Solar Package"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Custom URL Slug <span className="font-normal text-slate-400">(auto-generated if left blank)</span>
              </label>
              <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-slate-50 text-sm focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <span className="flex items-center border-r border-slate-200 bg-slate-100 px-3 text-xs text-slate-500">
                  /pricing/
                </span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={displaySlug}
                  className="w-full bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Subtitle / Marketing Hook
              </label>
              <input
                name="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Australia's most popular system size for standard 3–4 bedroom homes"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full Description</label>
              <textarea
                name="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is included, who this system is best for, expected annual savings, and grid feed-in benefits..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Commercial Pricing & Rebates */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <h2 className="font-display text-base font-bold text-slate-950">Pricing & Commercial Terms</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Display Price <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. $4,990 or From $5,500"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Australian benchmark for 6.6kW: ~$5,500 after STC rebate
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Price Suffix
              </label>
              <input
                name="priceSuffix"
                value={priceSuffix}
                onChange={(e) => setPriceSuffix(e.target.value)}
                placeholder="e.g. fully installed / inc. GST & STC"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Original Price <span className="font-normal text-slate-400">(Strikethrough)</span>
              </label>
              <input
                name="originalPrice"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="e.g. $6,490 (optional)"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Badge / Tag Text
              </label>
              <input
                name="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Most Popular, Best Value, 2026 Choice"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Solar Hardware & System Sizing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-dark" />
              <h2 className="font-display text-base font-bold text-slate-950">Solar Hardware Specifications</h2>
            </div>
            <span className="text-xs text-slate-400">CEC Approved Equipment</span>
          </div>

          {/* Quick presets */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold text-slate-600">Quick System Size Presets</p>
            <div className="flex flex-wrap gap-2">
              {SYSTEM_SIZE_PRESETS.map((p) => (
                <button
                  key={p.size}
                  type="button"
                  onClick={() => {
                    setSystemSizeKw(p.size);
                    setPanelCount(p.panels);
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    systemSizeKw === p.size
                      ? "border-brand bg-brand/10 text-brand-dark font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p.size} ({p.panels})
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">System Size (kW)</label>
              <input
                name="systemSizeKw"
                value={systemSizeKw}
                onChange={(e) => setSystemSizeKw(e.target.value)}
                placeholder="e.g. 6.6kW or 10kW"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Panel Count</label>
              <input
                name="panelCount"
                value={panelCount}
                onChange={(e) => setPanelCount(e.target.value)}
                placeholder="e.g. 16 panels (440W each)"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Panel Brand</label>
              <input
                name="panelBrand"
                value={panelBrand}
                onChange={(e) => setPanelBrand(e.target.value)}
                placeholder="e.g. Jinko Solar Tiger Neo N-Type"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Inverter Brand</label>
              <input
                name="inverterBrand"
                value={inverterBrand}
                onChange={(e) => setInverterBrand(e.target.value)}
                placeholder="e.g. Fronius Primo / Sungrow Hybrid"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Key Features & Inclusions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              <h2 className="font-display text-base font-bold text-slate-950">Key Features & Inclusions</h2>
            </div>
            <button
              type="button"
              onClick={() => setRawFeaturesMode(!rawFeaturesMode)}
              className="text-xs font-medium text-brand-dark hover:underline"
            >
              {rawFeaturesMode ? "Switch to Interactive List" : "Edit as Raw Text"}
            </button>
          </div>

          {rawFeaturesMode ? (
            <div>
              <p className="mb-2 text-xs text-slate-500">One feature per line:</p>
              <textarea
                rows={6}
                value={features.join("\n")}
                onChange={(e) =>
                  setFeatures(
                    e.target.value
                      .split("\n")
                      .map((f) => f.trim())
                      .filter(Boolean)
                  )
                }
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Feature input */}
              <div className="flex gap-2">
                <input
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature(newFeatureText);
                    }
                  }}
                  placeholder="Type a feature and press Enter (e.g. 25-Year Panel Performance Warranty)"
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddFeature(newFeatureText)}
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark transition"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              {/* Current feature chips */}
              <div className="space-y-1.5 pt-2">
                {features.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800"
                  >
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-red-600 transition"
                      title="Remove feature"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick suggestions */}
              <div className="pt-3">
                <p className="mb-2 text-xs font-semibold text-slate-500">Australian Solar Inclusions (Click to add):</p>
                <div className="flex flex-wrap gap-1.5">
                  {AUSTRALIAN_FEATURE_SUGGESTIONS.filter((s) => !features.includes(s)).map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleAddFeature(sug)}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 hover:border-brand hover:bg-brand/5 hover:text-brand-dark transition"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card 5: Technical Specifications (Key-Value) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              <h2 className="font-display text-base font-bold text-slate-950">Technical Specifications</h2>
            </div>
            <button
              type="button"
              onClick={handleAddSpec}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-dark hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> Add Row
            </button>
          </div>

          <div className="space-y-2">
            {specs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={item.label}
                  onChange={(e) => handleUpdateSpec(idx, "label", e.target.value)}
                  placeholder="Label (e.g. Expected Output)"
                  className="w-1/3 rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 focus:border-brand focus:outline-none"
                />
                <input
                  value={item.value}
                  onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                  placeholder="Value (e.g. 24–28 kWh / day)"
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-brand focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Remove spec"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card 6: Image & CTA */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Tag className="h-5 w-5 text-slate-700" />
            <h2 className="font-display text-base font-bold text-slate-950">Card Visual & Call to Action</h2>
          </div>

          <div className="space-y-4">
            <ImageUploadField
              name="image"
              label="Package Hero Image"
              defaultValue={plan?.image ?? ""}
              placeholder="https://... or upload solar package render"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">CTA Button Text</label>
                <input
                  name="ctaText"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Get a Free Quote"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">CTA Button Link</label>
                <input
                  name="ctaLink"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="e.g. /contact or /solar-calculator"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Changes will immediately update the live public pricing page and comparison tables.
          </p>
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/pricing"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-2.5 text-xs font-semibold text-white shadow hover:bg-brand-dark transition active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  Saving changes…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {plan ? "Save Changes" : "Create Pricing Plan"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Card Preview, Status & SEO */}
      <div className="space-y-6">
        {/* Card: Publishing Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-bold text-slate-950">Publishing Status</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                status === "published"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Visibility</label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none"
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <label className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  name="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded accent-brand"
                />
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-brand text-brand" />
                  Mark as Featured / Most Popular
                </span>
              </label>
              <p className="mt-1 text-[11px] text-slate-500 pl-6">
                Featured plans receive an elevated gold highlight border on the pricing page.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Display Order</label>
              <input
                type="number"
                name="order"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-400">Lower numbers appear first (e.g. 0, 1, 2).</p>
            </div>
          </div>
        </div>

        {/* Card: Real-time Public Card Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-brand-dark" />
              <h3 className="font-display text-sm font-bold text-slate-950">Live Website Preview</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Card View</span>
          </div>

          <div
            className={`relative rounded-2xl border transition-all p-5 ${
              featured
                ? "border-amber-400 bg-gradient-to-b from-amber-500/5 via-white to-white shadow-md ring-1 ring-amber-400/30"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            {badge && (
              <span className="mb-3 inline-block rounded-full bg-brand px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-sm">
                {badge}
              </span>
            )}

            <div className="flex items-baseline justify-between gap-2">
              <h4 className="font-display text-base font-bold text-slate-950">
                {title || "Untitled Package"}
              </h4>
              {systemSizeKw && (
                <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                  {systemSizeKw}
                </span>
              )}
            </div>

            {subtitle && (
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">{subtitle}</p>
            )}

            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-950">
                  {price || "$0"}
                </span>
                {priceSuffix && (
                  <span className="text-xs text-slate-500">{priceSuffix}</span>
                )}
              </div>

              {originalPrice && (
                <p className="mt-0.5 text-[11px] text-slate-400 line-through">
                  Was {originalPrice}
                </p>
              )}

              {weeklyEstimate && (
                <p className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {weeklyEstimate}
                </p>
              )}
            </div>

            {/* Hardware highlights */}
            {(panelBrand || inverterBrand) && (
              <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[11px] space-y-1">
                {panelBrand && (
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Panels:</span> {panelBrand}{" "}
                    {panelCount ? `(${panelCount})` : ""}
                  </p>
                )}
                {inverterBrand && (
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-900">Inverter:</span> {inverterBrand}
                  </p>
                )}
              </div>
            )}

            {/* Inclusions count */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{features.length} Premium Inclusions</span>
            </div>

            <div className="mt-4">
              <div className="w-full rounded-xl bg-slate-950 py-2.5 text-center text-xs font-semibold text-white shadow">
                {ctaText}
              </div>
            </div>
          </div>
        </div>

        {/* Card: SEO Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Search className="h-4 w-4 text-brand-dark" />
            <h3 className="font-display text-sm font-bold text-slate-950">Google Search Preview</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <label>SEO Title Tag</label>
                <span className={`text-[10px] ${seoTitle.length > 60 ? "text-amber-600" : "text-slate-400"}`}>
                  {seoTitle.length}/60 chars
                </span>
              </div>
              <input
                name="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={displaySeoTitle}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <label>Meta Description</label>
                <span className={`text-[10px] ${seoDescription.length > 160 ? "text-amber-600" : "text-slate-400"}`}>
                  {seoDescription.length}/160 chars
                </span>
              </div>
              <textarea
                name="seoDescription"
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={displaySeoDesc}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            {/* Google SERP Snippet Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>hujuratsolar.com.au</span>
                <span>›</span>
                <span>pricing</span>
                <span>›</span>
                <span className="text-slate-700 font-medium">{displaySlug}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-blue-700 line-clamp-1 hover:underline">
                {displaySeoTitle}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                {displaySeoDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
