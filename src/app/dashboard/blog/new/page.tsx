import { createBlogPostAction } from "@/lib/actions/blog";

export default function DashboardBlogNewPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-950">New Blog Post</h1>
      <p className="mt-1 text-sm text-slate-500">Create a new article for your solar blog.</p>

      <form action={createBlogPostAction} className="mt-6 max-w-2xl space-y-4">
        <input name="title" required placeholder="Post title" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="slug" placeholder="Custom slug (auto-generated if empty)" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="excerpt" placeholder="Short excerpt" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <textarea name="content" placeholder="Full article content (Markdown supported)" rows={10} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input name="category" placeholder="Category (e.g. Solar Tips)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <input name="tags" placeholder="Tags (comma separated)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <input name="coverImage" placeholder="Cover image URL" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="authorName" placeholder="Author name" defaultValue="Hujurat Solar Team" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="seoTitle" placeholder="SEO title" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="seoDescription" placeholder="SEO meta description" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <select name="status" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          Create post
        </button>
      </form>
    </div>
  );
}
