"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Save,
  Search,
  FileText,
  User,
  Tag,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import ImageUploadField from "@/components/dashboard/ImageUploadField";
import type { blogPosts } from "@/db/schema";

type BlogPost = typeof blogPosts.$inferSelect;

export default function BlogForm({
  action,
  post,
}: {
  action: (formData: FormData) => void;
  post?: BlogPost;
}) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(post?.seoDescription || "");
  const [status, setStatus] = useState<string>(post?.status || "published");

  // Computed slug preview for Google SERP
  const displaySlug = slug
    ? slug
    : title
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "complete-guide-to-sydney-solar-rebates-2025";

  const displayTitle =
    seoTitle || (title ? `${title} | Hujurat Solar Blog` : "Solar Energy Insights & Guides | Hujurat Solar Sydney");
  const displayDesc =
    seoDesc ||
    (post?.excerpt
      ? post.excerpt
      : "Expert solar installation advice, Australian government rebate guides, inverter troubleshooting, and clean energy tips from Hujurat Solar Sydney.");

  return (
    <form action={action} className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-[1fr_380px]">
      {/* LEFT COLUMN: Main Article Writing Area */}
      <div className="space-y-6 lg:col-span-2">
        {/* Card 1: Article Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand" />
              <h2 className="font-display text-base font-bold text-slate-950">Article Editor</h2>
            </div>
            <span className="text-xs text-slate-400">Markdown formatting supported</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 7 Critical Questions to Ask Before Installing Solar Panels in Western Sydney"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Custom URL Slug <span className="text-slate-400 font-normal">(optional, auto-generated from title)</span>
              </label>
              <div className="flex rounded-xl border border-slate-300 bg-slate-50 text-sm overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <span className="flex items-center px-3 text-xs text-slate-500 border-r border-slate-200 bg-slate-100">
                  /blog/
                </span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-slug"
                  className="w-full bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Short Excerpt / Lead Paragraph</label>
              <textarea
                name="excerpt"
                rows={2}
                defaultValue={post?.excerpt ?? ""}
                placeholder="Compelling opening hook shown on the blog listing page and social share snippets."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Full Article Body <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Headings (##, ###), bullet points, and links</span>
              </div>
              <textarea
                name="content"
                rows={16}
                required
                defaultValue={post?.content ?? ""}
                placeholder="Write or paste your comprehensive solar article here...&#10;&#10;## Understanding Australian Solar Feed-in Tariffs&#10;Solar power in Sydney has evolved significantly..."
                className="w-full font-sans rounded-xl border border-slate-300 p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Categorization & Author */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Tag className="h-5 w-5 text-indigo-500" />
            <h2 className="font-display text-base font-bold text-slate-950">Category, Tags & Author</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Category</label>
              <input
                name="category"
                defaultValue={post?.category ?? ""}
                placeholder="e.g. Solar Buying Guides, Battery Storage, NSW Rebates"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Tags <span className="font-normal text-slate-400">(comma separated)</span>
              </label>
              <input
                name="tags"
                defaultValue={(post?.tags ?? []).join(", ")}
                placeholder="sydney solar, fronius inverter, battery rebate, nsw"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Author Name</label>
              <div className="relative">
                <input
                  name="authorName"
                  defaultValue={post?.authorName || "Hujurat Solar Team"}
                  placeholder="e.g. Hujurat Solar Engineering Team"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Save Action Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-500">
            Make sure your article title and content body are filled before publishing.
          </p>
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/blog"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-brand-dark transition active:scale-[0.98]"
            >
              <Save className="h-3.5 w-3.5" />
              {post ? "Save Changes" : "Publish Article"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Publishing Controls, Cover Image, Google SERP */}
      <div className="space-y-6">
        {/* Card: Publishing Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-bold text-slate-950">Publishing Status</h3>
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
              <label className="mb-1 block text-xs font-semibold text-slate-700">Visibility</label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none"
              >
                <option value="published">Published (Live on site)</option>
                <option value="draft">Draft (Work in progress)</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-brand-dark transition active:scale-[0.98]"
              >
                <Save className="h-4 w-4" />
                {post ? "Save Changes" : "Publish Article"}
              </button>

              <Link
                href="/dashboard/blog"
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel & Return
              </Link>
            </div>
          </div>
        </div>

        {/* Card: Cover Image */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-bold text-slate-950">Featured Cover Image</h3>
            <span className="text-[10px] text-slate-400">16:9 Landscape</span>
          </div>

          <ImageUploadField
            name="coverImage"
            label="Article Header Photo"
            defaultValue={post?.coverImage ?? ""}
            placeholder="/uploads/article-cover.jpg or Cloudinary URL"
          />
        </div>

        {/* Card: Google Australia SEO Preview & Meta Inputs */}
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
              <span className="truncate text-slate-500">blog › {displaySlug}</span>
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
                placeholder="Recommended: 50-60 characters for Google top 3"
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
                placeholder="Compelling 140-160 character summary enticing Australian homeowners to click."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card: Australian SEO Tips */}
        <div className="rounded-2xl border border-brand/20 bg-brand/5 p-5">
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            <Sparkles className="h-4 w-4 text-brand" />
            Top 3 Ranking Strategy (Australia)
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-1.5">
              <span className="text-brand font-bold">✓</span> Mention Sydney / NSW suburbs to win high-intent local queries
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand font-bold">✓</span> Reference NSW government battery incentives & STC rebates
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-brand font-bold">✓</span> Include specific hardware comparisons (Fronius vs Sungrow, N-Type panels)
            </li>
          </ul>
        </div>
      </div>
    </form>
  );
}
