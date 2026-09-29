"use client";

import ImageUploadField from "@/components/dashboard/ImageUploadField";
import type { projects, locations } from "@/db/schema";

type Project = typeof projects.$inferSelect;
type Location = typeof locations.$inferSelect;

export default function ProjectForm({
  action,
  project,
  locationOptions,
}: {
  action: (formData: FormData) => void;
  project?: Project;
  locationOptions: Location[];
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Project title</label>
          <input name="title" required defaultValue={project?.title} placeholder="12.6kW Solar Installation in Parramatta" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Custom URL slug (optional)</label>
          <input name="slug" defaultValue={project?.slug} placeholder="auto-generated if left blank" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Summary</label>
        <textarea name="summary" rows={2} defaultValue={project?.summary ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <textarea name="description" rows={4} defaultValue={project?.description ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Challenge</label>
          <textarea name="challenge" rows={3} defaultValue={project?.challenge ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Outcome</label>
          <textarea name="outcome" rows={3} defaultValue={project?.outcome ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Suburb</label>
          <input name="suburb" required defaultValue={project?.suburb} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
          <input name="state" defaultValue={project?.state ?? "NSW"} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Postcode</label>
          <input name="postcode" defaultValue={project?.postcode ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Location page</label>
          <select name="locationId" defaultValue={project?.locationId ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
            <option value="">None</option>
            {locationOptions.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">System size (kW)</label>
          <input name="systemSizeKw" defaultValue={project?.systemSizeKw ?? ""} placeholder="10.00" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Battery size (kWh)</label>
          <input name="batterySizeKwh" defaultValue={project?.batterySizeKwh ?? ""} placeholder="13.50" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Panel brand</label>
          <input name="panelBrand" defaultValue={project?.panelBrand ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Inverter brand</label>
          <input name="inverterBrand" defaultValue={project?.inverterBrand ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Battery brand</label>
          <input name="batteryBrand" defaultValue={project?.batteryBrand ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Project type</label>
          <select name="projectType" defaultValue={project?.projectType ?? "residential"} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select name="status" defaultValue={project?.status ?? "draft"} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Install date</label>
          <input type="date" name="installDate" defaultValue={project?.installDate ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" name="featured" defaultChecked={project?.featured} className="h-4 w-4 rounded border-slate-300" />
            Feature on homepage
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Customer name</label>
          <input name="customerName" defaultValue={project?.customerName ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <ImageUploadField
            name="featuredImage"
            label="Featured image"
            defaultValue={project?.featuredImage ?? ""}
            placeholder="/uploads/your-image.jpg"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Customer testimonial</label>
        <textarea name="customerTestimonial" rows={2} defaultValue={project?.customerTestimonial ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
      </div>

      {!project && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Additional gallery image URLs (one per line)</label>
          <textarea name="imageUrls" rows={3} placeholder={"/uploads/photo-1.jpg\n/uploads/photo-2.jpg"} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
      )}

      {!project && (
        <div className="rounded-xl border border-dashed border-slate-300 p-4">
          <p className="text-sm font-semibold text-slate-700">Project video (optional)</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input name="videoUrl" placeholder="Video URL (/uploads/video.mp4)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <input name="videoThumbnail" placeholder="Thumbnail URL" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <input name="videoTitle" placeholder="Video title" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <input name="videoTranscript" placeholder="Video transcript (for SEO)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">SEO title</label>
          <input name="seoTitle" defaultValue={project?.seoTitle ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">SEO meta description</label>
          <input name="seoDescription" defaultValue={project?.seoDescription ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
      </div>

      <button type="submit" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
        {project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}
