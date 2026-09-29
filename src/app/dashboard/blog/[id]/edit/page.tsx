import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogForm from "../../BlogForm";
import { updateBlogPostAction } from "@/lib/actions/blog";
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
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog Posts
          </Link>
          <h1 className="font-display text-2xl font-bold text-slate-950">Edit Article</h1>
          <p className="text-sm text-slate-500">Update &ldquo;{post.title}&rdquo;</p>
        </div>
      </div>

      <BlogForm action={updateAction} post={post} />
    </div>
  );
}
