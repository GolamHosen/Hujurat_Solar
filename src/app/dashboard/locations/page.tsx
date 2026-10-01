import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { getAllLocations } from "@/lib/queries";
import { createLocationAction, deleteLocationAction } from "@/lib/actions/locations";
import ImageUploadField from "@/components/dashboard/ImageUploadField";

export default async function DashboardLocationsPage() {
  const locations = await getAllLocations();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-950">Locations</h1>
      <p className="mt-1 text-sm text-slate-500">Manage local SEO landing pages for each service area.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => {
                const hasImage = Boolean(
                  location.heroImage &&
                  location.heroImage !== "/images/location-suburb.jpg"
                );

                return (
                  <tr key={location.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{location.name}</td>
                    <td className="px-4 py-3">
                      {hasImage ? (
                        <div className="relative h-9 w-14 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          <Image
                            src={location.heroImage!}
                            alt={location.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <ImageIcon className="h-3.5 w-3.5" /> No image
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${location.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {location.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/dashboard/locations/${location.id}/edit`} className="text-slate-500 hover:text-brand-dark" title="Edit location">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={deleteLocationAction.bind(null, location.id)}>
                          <button type="submit" className="text-slate-500 hover:text-red-600" title="Delete location">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-base font-bold text-slate-950">Add new location</h2>
          <form action={createLocationAction} className="mt-4 space-y-3">
            <input name="name" required placeholder="Suburb / area name" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input name="region" placeholder="Region (e.g. Western Sydney)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
              <input name="state" placeholder="State" defaultValue="NSW" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            </div>
            <input name="blurb" placeholder="Short blurb" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <textarea name="description" placeholder="Full description" rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <div>
              <ImageUploadField name="heroImage" label="Hero image (optional)" placeholder="Upload or paste image URL" />
              <p className="mt-1 text-[11px] text-slate-500">Only locations with an image will show a photo banner on the frontend card.</p>
            </div>
            <input name="seoTitle" placeholder="SEO title" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <input name="seoDescription" placeholder="SEO meta description" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <select name="status" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
              Create location
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
