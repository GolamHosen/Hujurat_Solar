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

interface GalleryImageItem {
  url: string;
  alt?: string | null;
  caption?: string | null;
  order?: number;
  isFeatured?: boolean;
}

function extractGalleryImages(formData: FormData, defaultTitle: string): GalleryImageItem[] {
  const galleryJson = String(formData.get("galleryImages") || "").trim();
  if (galleryJson) {
    try {
      const parsed: unknown = JSON.parse(galleryJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const items: GalleryImageItem[] = [];
        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i];
          if (!item) continue;
          
          let url = "";
          let alt = defaultTitle;
          let caption: string | null = null;
          let isFeatured = false;

          if (typeof item === "string") {
            url = item.trim();
          } else if (typeof item === "object") {
            const obj = item as Record<string, unknown>;
            url = String(obj.url || "").trim();
            if (obj.alt !== undefined && obj.alt !== null) {
              const customAlt = String(obj.alt).trim();
              if (customAlt) alt = customAlt;
            }
            if (obj.caption) {
              caption = String(obj.caption).trim();
            }
            isFeatured = Boolean(obj.isFeatured);
          }

          if (url) {
            items.push({
              url,
              alt,
              caption,
              order: i,
              isFeatured,
            });
          }
        }
        return items;
      }
    } catch (e) {
      console.error("Failed to parse galleryImages JSON:", e);
    }
  }

  // Fallback to newline-separated imageUrls if present
  const imageUrls = String(formData.get("imageUrls") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const fallbackItems: GalleryImageItem[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    fallbackItems.push({
      url: imageUrls[i],
      alt: defaultTitle,
      caption: null,
      order: i,
    });
  }

  return fallbackItems;
}


export async function createProjectAction(formData: FormData) {
  await requireAdminSession();

  assertFormData(formData);

  const values = buildProjectValues(formData);
  const gallery = extractGalleryImages(formData, values.title);

  // If featuredImage is empty, pick the one marked featured or the first gallery image
  if (!values.featuredImage && gallery.length > 0) {
    const featuredItem = gallery.find((g) => g.isFeatured) || gallery[0];
    values.featuredImage = featuredItem.url;
  }

  const [created] = await db.insert(projects).values(values).returning();

  if (gallery.length > 0) {
    await db.insert(projectImages).values(
      gallery.map((img, index) => ({
        projectId: created.id,
        url: img.url,
        alt: img.alt || created.title,
        caption: img.caption,
        order: img.order ?? index,
      }))
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
  const gallery = extractGalleryImages(formData, values.title);

  // If featuredImage is empty, pick the one marked featured or the first gallery image
  if (!values.featuredImage && gallery.length > 0) {
    const featuredItem = gallery.find((g) => g.isFeatured) || gallery[0];
    values.featuredImage = featuredItem.url;
  }

  await db.update(projects).set(values).where(eq(projects.id, projectId));

  // Sync project images when gallery data is provided
  const hasGallerySubmitted = formData.has("galleryImages") || formData.has("imageUrls");
  if (hasGallerySubmitted) {
    await db.delete(projectImages).where(eq(projectImages.projectId, projectId));
    if (gallery.length > 0) {
      await db.insert(projectImages).values(
        gallery.map((img, index) => ({
          projectId,
          url: img.url,
          alt: img.alt || values.title,
          caption: img.caption,
          order: img.order ?? index,
        }))
      );
    }
  }

  // Handle video update if provided
  const videoUrl = String(formData.get("videoUrl") || "").trim();
  if (videoUrl) {
    await db.delete(projectVideos).where(eq(projectVideos.projectId, projectId));
    await db.insert(projectVideos).values({
      projectId,
      url: videoUrl,
      thumbnailUrl: String(formData.get("videoThumbnail") || "") || values.featuredImage,
      title: String(formData.get("videoTitle") || values.title),
      description: String(formData.get("videoDescription") || ""),
      transcript: String(formData.get("videoTranscript") || ""),
    });
  }

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
