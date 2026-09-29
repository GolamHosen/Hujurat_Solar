"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/slug";
import { requireAdminSession } from "@/lib/auth";
import { assertFormData, toPositiveInt } from "@/lib/validation";

function buildValues(formData: FormData) {
  assertFormData(formData);

  const name = String(formData.get("name") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  return {
    name,
    slug: customSlug ? slugify(customSlug) : slugify(name),
    region: String(formData.get("region") || ""),
    state: String(formData.get("state") || "NSW"),
    blurb: String(formData.get("blurb") || ""),
    description: String(formData.get("description") || ""),
    heroImage: String(formData.get("heroImage") || ""),
    seoTitle: String(formData.get("seoTitle") || ""),
    seoDescription: String(formData.get("seoDescription") || ""),
    status: (formData.get("status") as "draft" | "published") || "draft",
    updatedAt: new Date(),
  };
}

export async function createLocationAction(formData: FormData) {
  await requireAdminSession();

  await db.insert(locations).values(buildValues(formData));
  revalidatePath("/dashboard/locations");
  revalidatePath("/locations");
  revalidatePath("/");
  updateTag("locations");
  updateTag("cms");
  redirect("/dashboard/locations");
}

export async function updateLocationAction(id: number, formData: FormData) {
  await requireAdminSession();

  const locationId = toPositiveInt(id);
  if (!locationId) return;

  const values = buildValues(formData);
  await db.update(locations).set(values).where(eq(locations.id, locationId));
  revalidatePath("/dashboard/locations");
  revalidatePath("/locations");
  revalidatePath(`/locations/${values.slug}`);
  revalidatePath("/");
  updateTag("locations");
  updateTag("cms");
  redirect("/dashboard/locations");
}

export async function deleteLocationAction(id: number) {
  await requireAdminSession();

  const locationId = toPositiveInt(id);
  if (!locationId) return;

  await db.delete(locations).where(eq(locations.id, locationId));
  revalidatePath("/dashboard/locations");
  revalidatePath("/locations");
  revalidatePath("/");
  updateTag("locations");
  updateTag("cms");
}
