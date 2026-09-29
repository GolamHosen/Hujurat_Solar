"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Save,
  Search,
  Zap,
  MapPin,
  User,
  Video,
  FileText,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Star,
  Layers,
} from "lucide-react";
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
  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [suburb, setSuburb] = useState(project?.suburb || "");
  const [seoTitle, setSeoTitle] = useState(project?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(project?.seoDescription || "");
  const [status, setStatus] = useState<string>(project?.status || "published");

  // Computed slug preview for Google SERP
  const displaySlug = slug
    ? slug
    : title
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "parramatta-12kw-solar-installation";

  const displayTitle = seoTitle || (title ? `${title} | Hujurat Solar` : "Residential & Commercial Solar Installation | Hujurat Solar");
  const displayDesc =
    seoDesc ||
    (suburb
      ? `High-efficiency Clean Energy Council accredited solar system installation in ${suburb}, NSW. Learn more about specs, savings, and warranty with Hujurat Solar.`
      : "Clean Energy Council accredited solar & battery installation across Sydney & NSW. Premium panels, European inverters, and guaranteed workmanship.");

  return (
    <form action={action} className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-[1fr_380px]">
      {/* LEFT COLUMN: Main Project Content */}
      <div className="space-y-6 lg:col-span-2">
        {/* Card 1: Project Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="h-5 w-5 text-brand" />
            <h2 className="font-display text-base font-bold text-slate-950">Project Overview</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 12.6kW Commercial Solar Installation in Parramatta"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Custom URL Slug <span className="text-slate-400 font-normal">(optional, auto-generated if blank)</span>
              </label>
              <div className="flex rounded-xl border border-slate-300 bg-slate-50 text-sm overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <span className="flex items-center px-3 text-xs text-slate-500 border-r border-slate-200 bg-slate-100">
                  /projects/
                </span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="w-full bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Short Summary</label>
              <textarea
                name="summary"
                rows={2}
                defaultValue={project?.summary ?? ""}
                placeholder="Quick 1-2 sentence overview of the installation, location, and target energy offset."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Detailed Description</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={project?.description ?? ""}
                placeholder="Comprehensive breakdown of roof architecture, orientation, energy demand analysis, and engineering approach."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Card 2: System Specifications */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-base font-bold text-slate-950">Technical Specifications</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">System Size (kW)</label>
              <div className="relative">
                <input
                  name="systemSizeKw"
                  defaultValue={project?.systemSizeKw ?? ""}
                  placeholder="10.50"
                  type="number"
                  step="0.01"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">kW</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Battery Storage (kWh)</label>
              <div className="relative">
                <input
                  name="batterySizeKwh"
                  defaultValue={project?.batterySizeKwh ?? ""}
                  placeholder="13.50"
                  type="number"
                  step="0.01"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">kWh</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Panel Brand & Model</label>
              <input
                name="panelBrand"
                defaultValue={project?.panelBrand ?? ""}
                placeholder="e.g. Jinko Tiger Neo 440W N-Type"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Inverter Brand</label>
              <input
                name="inverterBrand"
                defaultValue={project?.inverterBrand ?? ""}
                placeholder="e.g. Fronius Primo GEN24 / Sungrow"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Battery Brand (if applicable)</label>
              <input
                name="batteryBrand"
                defaultValue={project?.batteryBrand ?? ""}
                placeholder="e.g. Tesla Powerwall 3 / BYD Battery-Box"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Challenge & Outcome */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="h-5 w-5 text-indigo-500" />
            <h2 className="font-display text-base font-bold text-slate-950">Site Challenges & Proven Results</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Challenge Faced</label>
              <textarea
                name="challenge"
                rows={3}
                defaultValue={project?.challenge ?? ""}
                placeholder="e.g. Multi-pitch tiled roof with partial afternoon shading from neighbouring gum trees."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Engineered Outcome</label>
              <textarea
                name="outcome"
                rows={3}
                defaultValue={project?.outcome ?? ""}
                placeholder="e.g. Micro-inverters installed to optimise per-panel output, delivering 85% reduction in electricity bills."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Customer Feedback */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="h-5 w-5 text-emerald-600" />
            <h2 className="font-display text-base font-bold text-slate-950">Customer Testimonial & Quote</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Customer Name</label>
              <input
                name="customerName"
                defaultValue={project?.customerName ?? ""}
                placeholder="e.g. David & Sarah M."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Customer Testimonial Quote</label>
              <textarea
                name="customerTestimonial"
                rows={3}
                defaultValue={project?.customerTestimonial ?? ""}
                placeholder="&ldquo;Hujurat Solar made the transition completely seamless. Our quarterly bill dropped from $1,200 to $180!&rdquo;"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Gallery & Video (only for new creation) */}
        {!project && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Video className="h-5 w-5 text-rose-500" />
              <h2 className="font-display text-base font-bold text-slate-950">Additional Gallery & Video Showcase</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Additional Gallery Images <span className="font-normal text-slate-400">(one URL per line)</span>
                </label>
                <textarea
                  name="imageUrls"
                  rows={3}
                  placeholder={"https://res.cloudinary.com/.../photo-1.jpg\nhttps://res.cloudinary.com/.../photo-2.jpg"}
                  className="w-full font-mono rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
                <p className="text-xs font-bold text-slate-800">Project Walkthrough Video (Optional)</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    name="videoUrl"
                    placeholder="Video URL (/uploads/video.mp4 or YouTube)"
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs"
                  />
                  <input
                    name="videoThumbnail"
                    placeholder="Thumbnail image URL"
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs"
                  />
                  <input
                    name="videoTitle"
                    placeholder="Video title"
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs"
                  />
                  <input
                    name="videoTranscript"
                    placeholder="Video transcript for Australian SEO"
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Bottom Save Action Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">
            Mandatory fields marked with <span className="text-red-500 font-bold">*</span> are required to save.
          </p>
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/projects"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-brand-dark transition active:scale-[0.98]"
            >
              <Save className="h-3.5 w-3.5" />
              {project ? "Save Changes" : "Publish Project"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Publishing, Media, Location & SEO */}
      <div className="space-y-6">
        {/* Card: Publishing Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-bold text-slate-950">Publishing Controls</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Status</label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none"
              >
                <option value="published">Published (Visible on site)</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Project Type</label>
              <select
                name="projectType"
                defaultValue={project?.projectType ?? "residential"}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none"
              >
                <option value="residential">Residential Solar</option>
                <option value="commercial">Commercial Solar</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Installation Date</label>
              <input
                type="date"
                name="installDate"
                defaultValue={project?.installDate ?? ""}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
              >
              </input>
            </div>

            <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-amber-950 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={project?.featured}
                  className="h-4 w-4 rounded border-amber-300 text-brand focus:ring-brand"
                />
                <Star className="h-4 w-4 text-brand fill-brand shrink-0" />
                Feature on Homepage Case Studies
              </label>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark transition active:scale-[0.98]"
              >
                <Save className="h-4 w-4" />
                {project ? "Save Changes" : "Publish Project"}
              </button>

              <Link
                href="/dashboard/projects"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel & Return
              </Link>
            </div>
          </div>
        </div>

        {/* Card: Featured Image */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-bold text-slate-950">Featured Project Photo</h3>
            <span className="text-[10px] text-slate-400">High Resolution</span>
          </div>

          <ImageUploadField
            name="featuredImage"
            label="Hero Showcase Image"
            defaultValue={project?.featuredImage ?? ""}
            placeholder="/uploads/project-photo.jpg or Cloudinary URL"
          />
        </div>

        {/* Card: Location & NSW Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="h-4 w-4 text-rose-500" />
            <h3 className="font-display text-sm font-bold text-slate-950">Target Location (NSW)</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Suburb <span className="text-red-500">*</span>
              </label>
              <input
                name="suburb"
                required
                value={suburb}
                onChange={(e) => setSuburb(e.target.value)}
                placeholder="e.g. Parramatta"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">State</label>
                <input
                  name="state"
                  defaultValue={project?.state ?? "NSW"}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">Postcode</label>
                <input
                  name="postcode"
                  defaultValue={project?.postcode ?? ""}
                  placeholder="2150"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Link to Suburb Landing Page</label>
              <select
                name="locationId"
                defaultValue={project?.locationId ?? ""}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-brand focus:outline-none"
              >
                <option value="">None (Independent Suburb)</option>
                {locationOptions.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.state})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card: Google Australia SEO Preview & Inputs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <Search className="h-4 w-4 text-brand" />
              <h3 className="font-display text-sm font-bold text-slate-950">Google Australia SEO</h3>
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-bold text-blue-700">
              SERP Preview
            </span>
          </div>

          {/* SERP Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-left mb-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand text-[8px] font-extrabold text-slate-950">
                H
              </span>
              <span className="font-medium text-slate-700">hujuratsolar.com</span>
              <span className="text-slate-400">›</span>
              <span className="truncate text-slate-500">projects › {displaySlug}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-blue-700 leading-snug">
              {displayTitle}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-slate-600 leading-relaxed">
              {displayDesc}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">SEO Meta Title</label>
                <span className="text-[10px] text-slate-400">{seoTitle.length}/60</span>
              </div>
              <input
                name="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Recommended: 50-60 characters"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">SEO Meta Description</label>
                <span className="text-[10px] text-slate-400">{seoDesc.length}/160</span>
              </div>
              <textarea
                name="seoDescription"
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Recommended: 140-160 characters describing the solar project for searchers."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card: Solar SEO Checklist */}
        <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Sydney Solar Ranking Tips
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-1.5">
              <span className="text-brand font-bold">✓</span> Include the target NSW suburb in the title
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand font-bold">✓</span> State the kW size and battery kWh for technical intent
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand font-bold">✓</span> Upload high-res roof installation photos for image SEO
            </li>
          </ul>
        </div>
      </div>
    </form>
  );
}
