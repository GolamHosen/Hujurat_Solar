import Link from "next/link";
import { Pencil, Trash2, Star, Quote } from "lucide-react";
import { getAllTestimonials, getAllProjects } from "@/lib/queries";
import {
  createTestimonialAction,
  deleteTestimonialAction,
} from "@/lib/actions/testimonials";

export default async function DashboardTestimonialsPage() {
  const [testimonialsList, projects] = await Promise.all([
    getAllTestimonials(),
    getAllProjects(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">
            Testimonials & Reviews
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage customer feedback, ratings, and featured reviews for social proof.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Testimonials Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Rating</th>
                <th className="px-5 py-3">Review</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonialsList.map((t) => (
                <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900 flex items-center gap-1.5">
                      {t.featured && (
                        <span title="Featured">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        </span>
                      )}
                      {t.customerName}
                    </div>
                    {t.suburb && (
                      <div className="text-xs text-slate-500">{t.suburb}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="font-bold text-slate-800">{t.rating}</span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 max-w-xs">
                    <p className="line-clamp-2 text-xs text-slate-600 italic">
                      &ldquo;{t.content}&rdquo;
                    </p>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        t.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2.5">
                      <Link
                        href={`/dashboard/testimonials/${t.id}/edit`}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-dark"
                        title="Edit Testimonial"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={deleteTestimonialAction.bind(null, t.id)}>
                        <button
                          type="submit"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonialsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                    <Quote className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    No testimonials recorded yet. Add customer quotes using the form.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add New Testimonial Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <h2 className="font-display text-base font-bold text-slate-950">
            Add New Testimonial
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Showcase satisfied Sydney solar clients.
          </p>

          <form action={createTestimonialAction} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name *
              </label>
              <input
                name="customerName"
                required
                placeholder="e.g. David M."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Suburb
                </label>
                <input
                  name="suburb"
                  placeholder="e.g. Castle Hill"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rating (1 - 5)
                </label>
                <select
                  name="rating"
                  defaultValue="5"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                >
                  <option value="5">5 Stars ★★★★★</option>
                  <option value="4">4 Stars ★★★★☆</option>
                  <option value="3">3 Stars ★★★☆☆</option>
                  <option value="2">2 Stars ★★☆☆☆</option>
                  <option value="1">1 Star ★☆☆☆☆</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Review Content *
              </label>
              <textarea
                name="content"
                required
                rows={4}
                placeholder="What did the customer say about their install, energy savings, or service?"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Linked Project (Optional)
              </label>
              <select
                name="projectId"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
              >
                <option value="">None (Independent Review)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.suburb})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              <label htmlFor="featured" className="text-xs font-medium text-slate-700">
                Feature on Homepage & Landing Pages
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue="published"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-slate-950 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Add Testimonial
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
