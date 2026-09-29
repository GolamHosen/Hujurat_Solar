import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "../ProjectForm";
import { createProjectAction } from "@/lib/actions/projects";
import { getAllLocations } from "@/lib/queries";

export default async function NewProjectPage() {
  const locations = await getAllLocations();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
          </Link>
          <h1 className="font-display text-2xl font-bold text-slate-950">New Solar Project</h1>
          <p className="text-sm text-slate-500">
            Publish a completed solar case study. It automatically generates a Google-optimised showcase page.
          </p>
        </div>
      </div>

      <ProjectForm action={createProjectAction} locationOptions={locations} />
    </div>
  );
}
