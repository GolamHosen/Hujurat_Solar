import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";
import { getAllBlogPosts } from "@/lib/queries";
import { deleteBlogPostAction } from "@/lib/actions/blog";

export default async function DashboardBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">Blog Posts</h1>
          <p className="mt-1 text-sm text-slate-500">Publish articles to boost your organic search presence.</p>
        </div>
        <Link
          href="/dashboard/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Author</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-slate-100">
                <td className="px-5 py-3 font-medium text-slate-900">{post.title}</td>
                <td className="px-5 py-3 text-slate-600">{post.category || "—"}</td>
                <td className="px-5 py-3 text-slate-600">{post.authorName}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/blog/${post.id}/edit`} className="text-slate-500 hover:text-brand-dark">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={deleteBlogPostAction.bind(null, post.id)}>
                      <button type="submit" className="text-slate-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">
                  No blog posts yet. Create your first article to start driving organic traffic.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
