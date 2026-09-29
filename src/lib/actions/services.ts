"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/slug";
import { requireAdminSession } from "@/lib/auth";
import { assertFormData, toPositiveInt } from "@/lib/validation";

function buildValues(formData: FormData) {
  assertFormData(formData);

  const title = String(formData.get("title") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  return {
    title,
    slug: customSlug ? slugify(customSlug) : slugify(title),
    summary: String(formData.get("summary") || ""),
    description: String(formData.get("description") || ""),
    icon: String(formData.get("icon") || "sun"),
    heroImage: String(formData.get("heroImage") || ""),
    order: Number(formData.get("order") || 0),
    seoTitle: String(formData.get("seoTitle") || ""),
    seoDescription: String(formData.get("seoDescription") || ""),
    status: (formData.get("status") as "draft" | "published") || "draft",
    updatedAt: new Date(),
  };
}

export async function createServiceAction(formData: FormData) {
  await requireAdminSession();

  await db.insert(services).values(buildValues(formData));
  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidateTag("services");
  revalidateTag("cms");
  redirect("/dashboard/services");
}

export async function updateServiceAction(id: number, formData: FormData) {
  await requireAdminSession();

  const serviceId = toPositiveInt(id);
  if (!serviceId) return;

  await db.update(services).set(buildValues(formData)).where(eq(services.id, serviceId));
  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidateTag("services");
  revalidateTag("cms");
  redirect("/dashboard/services");
}

export async function deleteServiceAction(id: number) {
  await requireAdminSession();

  const serviceId = toPositiveInt(id);
  if (!serviceId) return;

  await db.delete(services).where(eq(services.id, serviceId));
  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidateTag("services");
  revalidateTag("cms");
}
