"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth";
import { assertFormData, toPositiveInt } from "@/lib/validation";

const VALID_STATUSES = ["new", "contacted", "quote_sent", "follow_up", "won", "lost"] as const;

export async function updateLeadStatusAction(id: number, formData: FormData) {
  await requireAdminSession();
  assertFormData(formData);

  const leadId = toPositiveInt(id);
  if (!leadId) return;

  const status = String(formData.get("status") || "new");
  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) return;

  await db
    .update(leads)
    .set({ status: status as (typeof VALID_STATUSES)[number], updatedAt: new Date() })
    .where(eq(leads.id, leadId));

  revalidatePath("/dashboard/leads");
}

export async function deleteLeadAction(id: number) {
  await requireAdminSession();

  const leadId = toPositiveInt(id);
  if (!leadId) return;

  await db.delete(leads).where(eq(leads.id, leadId));
  revalidatePath("/dashboard/leads");
}
