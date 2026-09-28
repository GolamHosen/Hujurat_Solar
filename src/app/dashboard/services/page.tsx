import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { getAllServices } from "@/lib/queries";
import { createServiceAction, deleteServiceAction } from "@/lib/actions/services";

export default async function DashboardServicesPage() {
  const services = await getAllServices();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-950">Services</h1>
      <p className="mt-1 text-sm text-slate-500">Manage the service pages shown across the site.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{service.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${service.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/dashboard/services/${service.id}/edit`} className="text-slate-500 hover:text-brand-dark">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={deleteServiceAction.bind(null, service.id)}>
                        <button type="submit" className="text-slate-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-base font-bold text-slate-950">Add new service</h2>
          <form action={createServiceAction} className="mt-4 space-y-3">
            <input name="title" required placeholder="Service title" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <input name="summary" placeholder="Short summary" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <textarea name="description" placeholder="Full description" rows={3} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input name="icon" placeholder="Icon (e.g. sun, battery)" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
              <input name="order" type="number" placeholder="Order" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            </div>
            <input name="heroImage" placeholder="Hero image URL" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <input name="seoTitle" placeholder="SEO title" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <input name="seoDescription" placeholder="SEO meta description" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" />
            <select name="status" className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
              Create service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
