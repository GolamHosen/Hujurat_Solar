import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAllProjects } from "@/lib/queries";
import { updateTestimonialAction } from "@/lib/actions/testimonials";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [rows, projects] = await Promise.all([
    db.select().from(testimonials).where(eq(testimonials.id, Number(id))).limit(1),
    getAllProjects(),
  ]);

  const testimonial = rows[0];
  if (!testimonial) notFound();

  const action = updateTestimonialAction.bind(null, testimonial.id);

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/testimonials"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Testimonials
      </Link>

      <h1 className="font-display text-2xl font-bold text-slate-950">
        Edit Testimonial
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Update customer feedback from {testimonial.customerName}.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name *
            </label>
            <input
              name="customerName"
              required
              defaultValue={testimonial.customerName}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suburb
              </label>
              <input
                name="suburb"
                defaultValue={testimonial.suburb ?? ""}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rating (1 - 5)
              </label>
              <select
                name="rating"
                defaultValue={String(testimonial.rating)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
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
              rows={5}
              defaultValue={testimonial.content}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Linked Project (Optional)
            </label>
            <select
              name="projectId"
              defaultValue={testimonial.projectId ? String(testimonial.projectId) : ""}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
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
              defaultChecked={testimonial.featured}
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
              defaultValue={testimonial.status}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Save Changes
            </button>
            <Link
              href="/dashboard/testimonials"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
