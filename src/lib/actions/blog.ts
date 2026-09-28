"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/slug";
import { requireAdminSession } from "@/lib/auth";
import { assertFormData, toPositiveInt } from "@/lib/validation";

function buildValues(formData: FormData) {
  assertFormData(formData);

  const title = String(formData.get("title") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const status = (formData.get("status") as "draft" | "published") || "draft";
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    title,
    slug: customSlug ? slugify(customSlug) : slugify(title),
    excerpt: String(formData.get("excerpt") || ""),
    content: String(formData.get("content") || ""),
    coverImage: String(formData.get("coverImage") || ""),
    category: String(formData.get("category") || ""),
    tags,
    authorName: String(formData.get("authorName") || "Hujurat Solar Team"),
    seoTitle: String(formData.get("seoTitle") || ""),
    seoDescription: String(formData.get("seoDescription") || ""),
    status,
    publishedAt: status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };
}

export async function createBlogPostAction(formData: FormData) {
  await requireAdminSession();

  await db.insert(blogPosts).values(buildValues(formData));
  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  redirect("/dashboard/blog");
}

export async function updateBlogPostAction(id: number, formData: FormData) {
  await requireAdminSession();

  const postId = toPositiveInt(id);
  if (!postId) return;

  await db.update(blogPosts).set(buildValues(formData)).where(eq(blogPosts.id, postId));
  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  redirect("/dashboard/blog");
}

export async function deleteBlogPostAction(id: number) {
  await requireAdminSession();

  const postId = toPositiveInt(id);
  if (!postId) return;

  await db.delete(blogPosts).where(eq(blogPosts.id, postId));
  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
}
