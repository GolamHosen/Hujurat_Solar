import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProjectForm from "../../ProjectForm";
import { updateProjectAction } from "@/lib/actions/projects";
import { getAllLocations, getProjectImages, getProjectVideos } from "@/lib/queries";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
  const project = rows[0];
  if (!project) notFound();

  const [locations, existingImages, existingVideos] = await Promise.all([
    getAllLocations(),
    getProjectImages(project.id),
    getProjectVideos(project.id),
  ]);
  const action = updateProjectAction.bind(null, project.id);

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
          <h1 className="font-display text-2xl font-bold text-slate-950">Edit Project</h1>
          <p className="text-sm text-slate-500">{project.title}</p>
        </div>
      </div>

      <ProjectForm
        action={action}
        project={project}
        locationOptions={locations}
        initialImages={existingImages}
        initialVideos={existingVideos}
      />
    </div>
  );
}

