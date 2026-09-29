import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateLocationAction } from "@/lib/actions/locations";
import ImageUploadField from "@/components/dashboard/ImageUploadField";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(locations)
    .where(eq(locations.id, Number(id)))
    .limit(1);

  const location = rows[0];
  if (!location) notFound();

  const action = updateLocationAction.bind(null, location.id);

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/locations"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Locations
      </Link>

      <h1 className="font-display text-2xl font-bold text-slate-950">
        Edit Location: {location.name}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Update local suburb landing page for SEO targeting in NSW.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Suburb / Area Name *
            </label>
            <input
              name="name"
              required
              defaultValue={location.name}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL Slug
            </label>
            <input
              name="slug"
              defaultValue={location.slug}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Region
              </label>
              <input
                name="region"
                defaultValue={location.region ?? ""}
                placeholder="e.g. Western Sydney"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                name="state"
                defaultValue={location.state}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Blurb
            </label>
            <input
              name="blurb"
              defaultValue={location.blurb ?? ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Description
            </label>
            <textarea
              name="description"
              defaultValue={location.description ?? ""}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hero Image
            </label>
            <ImageUploadField
              name="heroImage"
              defaultValue={location.heroImage ?? ""}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              SEO Title
            </label>
            <input
              name="seoTitle"
              defaultValue={location.seoTitle ?? ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              SEO Meta Description
            </label>
            <input
              name="seoDescription"
              defaultValue={location.seoDescription ?? ""}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={location.status}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Save Changes
            </button>
            <Link
              href="/dashboard/locations"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
