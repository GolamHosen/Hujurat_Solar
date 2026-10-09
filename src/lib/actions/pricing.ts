"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { pricingPlans } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { slugify } from "@/lib/slug";
import { requireAdminSession } from "@/lib/auth";
import { assertFormData, toPositiveInt } from "@/lib/validation";

async function buildValuesWithUniqueSlug(formData: FormData, existingId?: number) {
  assertFormData(formData);

  const title = String(formData.get("title") || "").trim();
  if (!title) {
    throw new Error("Pricing plan title is required.");
  }

  const customSlug = String(formData.get("slug") || "").trim();
  let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
  if (!baseSlug) {
    baseSlug = existingId ? `plan-${existingId}` : `plan-${Date.now()}`;
  }

  // Ensure slug uniqueness across other plans
  let finalSlug = baseSlug;
  try {
    const existingWithSlug = await db
      .select({ id: pricingPlans.id })
      .from(pricingPlans)
      .where(
        existingId
          ? and(eq(pricingPlans.slug, finalSlug), ne(pricingPlans.id, existingId))
          : eq(pricingPlans.slug, finalSlug)
      )
      .limit(1);

    if (existingWithSlug.length > 0) {
      finalSlug = existingId ? `${baseSlug}-${existingId}` : `${baseSlug}-${Date.now().toString(36)}`;
    }
  } catch (err) {
    console.warn("[Pricing Action] Slug conflict check skipped or encountered error:", err);
  }

  // Parse features (handles both JSON array and newline-separated strings)
  let featuresArray: string[] = [];
  const featuresRaw = String(formData.get("features") || "").trim();
  if (featuresRaw) {
    if (featuresRaw.startsWith("[") && featuresRaw.endsWith("]")) {
      try {
        const parsed = JSON.parse(featuresRaw);
        if (Array.isArray(parsed)) {
          featuresArray = parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        featuresArray = featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean);
      }
    } else {
      featuresArray = featuresRaw.split("\n").map((f) => f.trim()).filter(Boolean);
    }
  }

  // Parse specifications (handles both JSON array and "Label: Value" lines)
  let specsArray: { label: string; value: string }[] = [];
  const specsRaw = String(formData.get("specifications") || "").trim();
  if (specsRaw) {
    if (specsRaw.startsWith("[") && specsRaw.endsWith("]")) {
      try {
        const parsed = JSON.parse(specsRaw);
        if (Array.isArray(parsed)) {
          specsArray = parsed
            .filter(
              (s: unknown): s is Record<string, unknown> =>
                typeof s === "object" && s !== null && "label" in s
            )
            .map((s) => ({
              label: String(s.label || "").trim(),
              value: String(s.value || "").trim(),
            }));
        }
      } catch {
        specsArray = [];
      }
    } else {
      specsArray = specsRaw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const colonIdx = line.indexOf(":");
          if (colonIdx === -1) return { label: line, value: "" };
          return {
            label: line.slice(0, colonIdx).trim(),
            value: line.slice(colonIdx + 1).trim(),
          };
        });
    }
  }

  const featuredVal = formData.get("featured");
  const isFeatured = featuredVal === "on" || featuredVal === "true" || featuredVal === "1";

  return {
    title,
    slug: finalSlug,
    subtitle: String(formData.get("subtitle") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    price: String(formData.get("price") || "").trim() || "$0",
    priceSuffix: String(formData.get("priceSuffix") || "").trim() || null,
    originalPrice: String(formData.get("originalPrice") || "").trim() || null,
    badge: String(formData.get("badge") || "").trim() || null,
    image: String(formData.get("image") || "").trim() || null,
    ctaText: String(formData.get("ctaText") || "Get a Free Quote").trim(),
    ctaLink: String(formData.get("ctaLink") || "/contact").trim(),
    features: JSON.stringify(featuresArray),
    specifications: JSON.stringify(specsArray),
    systemSizeKw: String(formData.get("systemSizeKw") || "").trim() || null,
    panelCount: String(formData.get("panelCount") || "").trim() || null,
    panelBrand: String(formData.get("panelBrand") || "").trim() || null,
    inverterBrand: String(formData.get("inverterBrand") || "").trim() || null,
    featured: isFeatured,
    order: Number(formData.get("order") || 0),
    seoTitle: String(formData.get("seoTitle") || "").trim() || null,
    seoDescription: String(formData.get("seoDescription") || "").trim() || null,
    status: ((formData.get("status") as string) === "published" ? "published" : "draft") as
      | "published"
      | "draft",
    updatedAt: new Date(),
  };
}

export async function createPricingPlanAction(formData: FormData) {
  await requireAdminSession();

  const values = await buildValuesWithUniqueSlug(formData);
  const [created] = await db.insert(pricingPlans).values(values).returning({ id: pricingPlans.id });

  console.log(`[Pricing Action] Created new plan #${created?.id ?? "unknown"} ("${values.title}")`);

  revalidatePath("/dashboard/pricing");
  revalidatePath("/pricing");
  revalidatePath("/");
  updateTag("pricing");
  updateTag("cms");
  redirect("/dashboard/pricing");
}

/**
 * Updates a pricing plan.
 * Supports both bound signature: updatePricingPlanAction(id, formData)
 * and direct form action: updatePricingPlanAction(formData) with hidden input "id".
 */
export async function updatePricingPlanAction(
  idOrFormData: number | FormData,
  maybeFormData?: FormData
) {
  await requireAdminSession();

  let planId: number | null = null;
  let formData: FormData;

  if (typeof idOrFormData === "number" || typeof idOrFormData === "string") {
    planId = toPositiveInt(idOrFormData);
    if (!maybeFormData) {
      throw new Error("Missing form data for pricing plan update.");
    }
    formData = maybeFormData;
  } else {
    formData = idOrFormData;
    planId = toPositiveInt(formData.get("id"));
  }

  if (!planId) {
    throw new Error("Invalid or missing pricing plan ID.");
  }

  const values = await buildValuesWithUniqueSlug(formData, planId);
  await db.update(pricingPlans).set(values).where(eq(pricingPlans.id, planId));

  console.log(
    `[Pricing Action] Successfully updated plan #${planId} ("${values.title}") — Price: ${values.price}, Status: ${values.status}`
  );

  revalidatePath("/dashboard/pricing");
  revalidatePath(`/dashboard/pricing/${planId}/edit`);
  revalidatePath("/pricing");
  revalidatePath("/");
  updateTag("pricing");
  updateTag("cms");
  redirect("/dashboard/pricing");
}

export async function deletePricingPlanAction(id: number) {
  await requireAdminSession();

  const planId = toPositiveInt(id);
  if (!planId) return;

  await db.delete(pricingPlans).where(eq(pricingPlans.id, planId));
  console.log(`[Pricing Action] Deleted plan #${planId}`);

  revalidatePath("/dashboard/pricing");
  revalidatePath("/pricing");
  revalidatePath("/");
  updateTag("pricing");
  updateTag("cms");
}
