import { notFound } from "next/navigation";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateServiceAction } from "@/lib/actions/services";
import ImageUploadField from "@/components/dashboard/ImageUploadField";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(services).where(eq(services.id, Number(id))).limit(1);
  const service = rows[0];
  if (!service) notFound();

  const action = updateServiceAction.bind(null, service.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-950">Edit Service</h1>
      <div className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-7">
        <form action={action} className="space-y-4">
          <input name="title" required defaultValue={service.title} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <input name="slug" defaultValue={service.slug} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <input name="summary" defaultValue={service.summary ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <textarea name="description" defaultValue={service.description ?? ""} rows={4} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input name="icon" defaultValue={service.icon} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <input name="order" type="number" defaultValue={service.order} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          </div>
          <ImageUploadField name="heroImage" label="Hero image" defaultValue={service.heroImage ?? ""} />
          <input name="seoTitle" defaultValue={service.seoTitle ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <input name="seoDescription" defaultValue={service.seoDescription ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
          <select name="status" defaultValue={service.status} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}
