import { notFound } from "next/navigation";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProjectForm from "../../ProjectForm";
import { updateProjectAction } from "@/lib/actions/projects";
import { getAllLocations } from "@/lib/queries";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
  const project = rows[0];
  if (!project) notFound();

  const locations = await getAllLocations();
  const action = updateProjectAction.bind(null, project.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-950">Edit Project</h1>
      <p className="mt-1 text-sm text-slate-500">{project.title}</p>
      <div className="mt-6 max-w-4xl rounded-2xl border border-slate-200 bg-white p-7">
        <ProjectForm action={action} project={project} locationOptions={locations} />
      </div>
    </div>
  );
}
