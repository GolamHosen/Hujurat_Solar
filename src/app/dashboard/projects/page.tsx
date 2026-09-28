import Link from "next/link";
import { Plus, Trash2, Pencil, Star } from "lucide-react";
import { getAllProjects } from "@/lib/queries";
import { deleteProjectAction } from "@/lib/actions/projects";

export default async function DashboardProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Every completed install becomes an SEO-optimised case study.</p>
        </div>
        <Link href="/dashboard/projects/new" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="h-4 w-4" /> New Project
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Suburb</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Size</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="px-5 py-3 font-medium text-slate-900">
                  <span className="flex items-center gap-1.5">
                    {project.featured && <Star className="h-3.5 w-3.5 fill-brand text-brand" />}
                    {project.title}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-600">{project.suburb}, {project.state}</td>
                <td className="px-5 py-3 capitalize text-slate-600">{project.projectType}</td>
                <td className="px-5 py-3 text-slate-600">{project.systemSizeKw ? `${project.systemSizeKw}kW` : "-"}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${project.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/projects/${project.id}/edit`} className="text-slate-500 hover:text-brand-dark">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <form action={deleteProjectAction.bind(null, project.id)}>
                      <button type="submit" className="text-slate-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">
                  No projects yet. Create your first project to generate an SEO page automatically.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
