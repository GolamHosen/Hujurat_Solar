import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogForm from "../BlogForm";
import { createBlogPostAction } from "@/lib/actions/blog";

export default function DashboardBlogNewPage() {
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
          <h1 className="font-display text-2xl font-bold text-slate-950">New Solar Article</h1>
          <p className="text-sm text-slate-500">
            Publish educational articles and guides to capture Australian solar search traffic on Google.
          </p>
        </div>
      </div>

      <BlogForm action={createBlogPostAction} />
    </div>
  );
}
