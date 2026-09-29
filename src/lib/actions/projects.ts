"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { projects, projectImages, projectVideos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { projectSlug, slugify } from "@/lib/slug";
import { requireAdminSession } from "@/lib/auth";
import { assertFormData, toPositiveInt } from "@/lib/validation";

function parseNumeric(value: FormDataEntryValue | null): string | null {
  const str = String(value || "").trim();
  return str ? str : null;
}

function buildProjectValues(formData: FormData) {
  assertFormData(formData);

  const title = String(formData.get("title") || "").trim();
  const suburb = String(formData.get("suburb") || "").trim();
  const systemSizeKw = parseNumeric(formData.get("systemSizeKw"));
  const customSlug = String(formData.get("slug") || "").trim();
  const slug = customSlug ? slugify(customSlug) : projectSlug({ systemSizeKw, title, suburb });
  const status = (formData.get("status") as "draft" | "published") || "draft";

  return {
    slug,
    title,
    summary: String(formData.get("summary") || ""),
    description: String(formData.get("description") || ""),
    challenge: String(formData.get("challenge") || ""),
    outcome: String(formData.get("outcome") || ""),
    suburb,
    state: String(formData.get("state") || "NSW"),
    postcode: String(formData.get("postcode") || ""),
    locationId: formData.get("locationId") ? Number(formData.get("locationId")) : null,
    systemSizeKw,
    batterySizeKwh: parseNumeric(formData.get("batterySizeKwh")),
    panelBrand: String(formData.get("panelBrand") || ""),
    inverterBrand: String(formData.get("inverterBrand") || ""),
    batteryBrand: String(formData.get("batteryBrand") || ""),
    projectType: (formData.get("projectType") as "residential" | "commercial") || "residential",
    status,
    featured: formData.get("featured") === "on",
    featuredImage: String(formData.get("featuredImage") || ""),
    installDate: String(formData.get("installDate") || "") || null,
    customerName: String(formData.get("customerName") || ""),
    customerTestimonial: String(formData.get("customerTestimonial") || ""),
    seoTitle: String(formData.get("seoTitle") || ""),
    seoDescription: String(formData.get("seoDescription") || ""),
    publishedAt: status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };
}

export async function createProjectAction(formData: FormData) {
  await requireAdminSession();

  assertFormData(formData);

  const values = buildProjectValues(formData);
  const [created] = await db.insert(projects).values(values).returning();

  const imageUrls = String(formData.get("imageUrls") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (imageUrls.length > 0) {
    await db.insert(projectImages).values(
      imageUrls.map((url, index) => ({ projectId: created.id, url, alt: created.title, order: index }))
    );
  }

  const videoUrl = String(formData.get("videoUrl") || "").trim();
  if (videoUrl) {
    await db.insert(projectVideos).values({
      projectId: created.id,
      url: videoUrl,
      thumbnailUrl: String(formData.get("videoThumbnail") || "") || created.featuredImage,
      title: String(formData.get("videoTitle") || created.title),
      description: String(formData.get("videoDescription") || ""),
      transcript: String(formData.get("videoTranscript") || ""),
    });
  }

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  updateTag("projects");
  updateTag("cms");
  redirect("/dashboard/projects");
}

export async function updateProjectAction(id: number, formData: FormData) {
  await requireAdminSession();

  const projectId = toPositiveInt(id);
  if (!projectId) return;

  const values = buildProjectValues(formData);
  await db.update(projects).set(values).where(eq(projects.id, projectId));

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath(`/projects/${values.slug}`);
  revalidatePath("/");
  updateTag("projects");
  updateTag("cms");
  redirect("/dashboard/projects");
}

export async function deleteProjectAction(id: number) {
  await requireAdminSession();

  const projectId = toPositiveInt(id);
  if (!projectId) return;

  await db.delete(projects).where(eq(projects.id, projectId));
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  updateTag("projects");
  updateTag("cms");
}
