import ProjectForm from "../ProjectForm";
import { createProjectAction } from "@/lib/actions/projects";
import { getAllLocations } from "@/lib/queries";

export default async function NewProjectPage() {
  const locations = await getAllLocations();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-950">New Project</h1>
      <p className="mt-1 text-sm text-slate-500">
        Fill out the project details below — an SEO-optimised page will be published automatically.
      </p>
      <div className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-7">
        <ProjectForm action={createProjectAction} locationOptions={locations} />
      </div>
    </div>
  );
}
