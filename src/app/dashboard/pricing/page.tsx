import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Star, DollarSign, Plus } from "lucide-react";
import { getAllPricingPlans } from "@/lib/queries";
import { createPricingPlanAction, deletePricingPlanAction } from "@/lib/actions/pricing";
import ImageUploadField from "@/components/dashboard/ImageUploadField";

export default async function DashboardPricingPage() {
  const plans = await getAllPricingPlans();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">Pricing Plans</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage solar package pricing shown on the public pricing page.
          </p>
        </div>
        <Link
          href="/dashboard/pricing/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-dark transition"
        >
          <Plus className="h-4 w-4" /> Add Package
        </Link>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        {/* Existing Plans Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No pricing plans yet. Create your first one →
                  </td>
                </tr>
              )}
              {plans.map((plan) => (
                <tr key={plan.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {plan.image ? (
                        <Image
                          src={plan.image}
                          alt={plan.title}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10">
                          <DollarSign className="h-5 w-5 text-brand-dark" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{plan.title}</p>
                        {plan.badge && (
                          <span className="text-[10px] font-bold uppercase text-brand-dark">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {plan.price || "—"}
                    {plan.priceSuffix && (
                      <span className="text-xs font-normal text-slate-400"> {plan.priceSuffix}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                        plan.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {plan.status}
                    </span>
                    {plan.featured && (
                      <Star className="ml-1.5 inline h-3.5 w-3.5 fill-brand text-brand" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/pricing/${plan.id}/edit`}
                        className="text-slate-500 hover:text-brand-dark"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={deletePricingPlanAction.bind(null, plan.id)}>
                        <button type="submit" className="text-slate-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create New Plan Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-base font-bold text-slate-950">Add new pricing plan</h2>
          <form action={createPricingPlanAction} className="mt-4 space-y-3">
            <input
              name="title"
              required
              placeholder="Plan title (e.g. Starter Solar Package)"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            />
            <input
              name="subtitle"
              placeholder="Subtitle (e.g. Perfect for small homes)"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            />
            <textarea
              name="description"
              placeholder="Full description of this plan"
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                name="price"
                required
                placeholder="Price (e.g. $4,990)"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
              <input
                name="priceSuffix"
                placeholder="Suffix (e.g. /system)"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="originalPrice"
                placeholder="Original price (e.g. $5,990)"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
              <input
                name="badge"
                placeholder="Badge (e.g. Most Popular)"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-xs font-semibold text-slate-600">System Details</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="systemSizeKw"
                  placeholder="System size (e.g. 6.6kW)"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
                />
                <input
                  name="panelCount"
                  placeholder="Panel count (e.g. 16)"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
                />
                <input
                  name="panelBrand"
                  placeholder="Panel brand"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
                />
                <input
                  name="inverterBrand"
                  placeholder="Inverter brand"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Features <span className="font-normal text-slate-400">(one per line)</span>
              </label>
              <textarea
                name="features"
                placeholder={"6.6kW Solar System\n25-Year Panel Warranty\nPremium Tier 1 Panels\nFree Monitoring App\nCEC Accredited Installation"}
                rows={5}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Specifications{" "}
                <span className="font-normal text-slate-400">(Label: Value, one per line)</span>
              </label>
              <textarea
                name="specifications"
                placeholder={"Panels: 16x 415W Jinko Tiger Neo\nInverter: Fronius Primo 5.0\nWarranty: 25 Years\nExpected Output: 25 kWh/day"}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <ImageUploadField name="image" label="Plan image" placeholder="Image URL for this plan" />

            <div className="grid grid-cols-2 gap-3">
              <input
                name="ctaText"
                placeholder="CTA text (default: Get a Free Quote)"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
              <input
                name="ctaLink"
                placeholder="CTA link (default: /contact)"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="order"
                type="number"
                placeholder="Display order"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
              />
              <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm cursor-pointer">
                <input type="checkbox" name="featured" className="accent-brand" />
                <span>Mark as featured / popular</span>
              </label>
            </div>

            <input
              name="seoTitle"
              placeholder="SEO title"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            />
            <input
              name="seoDescription"
              placeholder="SEO meta description"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            />

            <select
              name="status"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <button
              type="submit"
              className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Create pricing plan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
