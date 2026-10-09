import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { pricingPlans } from "@/db/schema";
import { eq } from "drizzle-orm";
import PricingPlanForm from "../../PricingPlanForm";
import { updatePricingPlanAction } from "@/lib/actions/pricing";

export default async function EditPricingPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.id, Number(id)))
    .limit(1);
  const plan = rows[0];
  if (!plan) notFound();

  const action = updatePricingPlanAction.bind(null, plan.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/pricing"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Pricing Plans
          </Link>
          <h1 className="font-display text-2xl font-bold text-slate-950">Edit Pricing Plan</h1>
          <p className="text-sm text-slate-500">
            Update &ldquo;{plan.title}&rdquo; &bull; {plan.systemSizeKw || "Solar System"} &bull;{" "}
            {plan.price}
          </p>
        </div>
      </div>

      <PricingPlanForm action={action} plan={plan} />
    </div>
  );
}

