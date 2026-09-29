"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth";
import { assertFormData, toPositiveInt } from "@/lib/validation";

function buildValues(formData: FormData) {
  assertFormData(formData);

  return {
    customerName: String(formData.get("customerName") || ""),
    suburb: String(formData.get("suburb") || ""),
    rating: Number(formData.get("rating") || 5),
    content: String(formData.get("content") || ""),
    projectId: formData.get("projectId") ? Number(formData.get("projectId")) : null,
    featured: formData.get("featured") === "on",
    status: (formData.get("status") as "draft" | "published") || "published",
  };
}

export async function createTestimonialAction(formData: FormData) {
  await requireAdminSession();

  await db.insert(testimonials).values(buildValues(formData));
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
  updateTag("testimonials");
  updateTag("cms");
  redirect("/dashboard/testimonials");
}

export async function updateTestimonialAction(id: number, formData: FormData) {
  await requireAdminSession();

  const testimonialId = toPositiveInt(id);
  if (!testimonialId) return;

  await db.update(testimonials).set(buildValues(formData)).where(eq(testimonials.id, testimonialId));
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
  updateTag("testimonials");
  updateTag("cms");
  redirect("/dashboard/testimonials");
}

export async function deleteTestimonialAction(id: number) {
  await requireAdminSession();

  const testimonialId = toPositiveInt(id);
  if (!testimonialId) return;

  await db.delete(testimonials).where(eq(testimonials.id, testimonialId));
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
  updateTag("testimonials");
  updateTag("cms");
}
