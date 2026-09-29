import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/queries";
import { updateBlogPostAction } from "@/lib/actions/blog";
import ImageUploadField from "@/components/dashboard/ImageUploadField";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getBlogPostById(id: number) {
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return rows[0] ?? null;
}

export default async function DashboardBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(Number(id));
  if (!post) return notFound();

  const updateAction = updateBlogPostAction.bind(null, post.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-950">Edit Blog Post</h1>
      <p className="mt-1 text-sm text-slate-500">Update &ldquo;{post.title}&rdquo;</p>

      <form action={updateAction} className="mt-6 max-w-2xl space-y-4">
        <input name="title" required defaultValue={post.title} placeholder="Post title" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="slug" defaultValue={post.slug} placeholder="Slug" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="excerpt" defaultValue={post.excerpt ?? ""} placeholder="Short excerpt" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <textarea name="content" defaultValue={post.content ?? ""} placeholder="Full article content" rows={10} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input name="category" defaultValue={post.category ?? ""} placeholder="Category" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <input name="tags" defaultValue={(post.tags ?? []).join(", ")} placeholder="Tags (comma separated)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        </div>
        <ImageUploadField name="coverImage" label="Cover image" defaultValue={post.coverImage ?? ""} placeholder="Cover image URL" />
        <input name="authorName" defaultValue={post.authorName} placeholder="Author name" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="seoTitle" defaultValue={post.seoTitle ?? ""} placeholder="SEO title" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <input name="seoDescription" defaultValue={post.seoDescription ?? ""} placeholder="SEO meta description" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
        <select name="status" defaultValue={post.status} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          Save changes
        </button>
      </form>
    </div>
  );
}
