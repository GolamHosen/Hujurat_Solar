import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PricingPlanForm from "../PricingPlanForm";
import { createPricingPlanAction } from "@/lib/actions/pricing";

export default function NewPricingPlanPage() {
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
          <h1 className="font-display text-2xl font-bold text-slate-950">New Solar Pricing Package</h1>
          <p className="text-sm text-slate-500">
            Create a new residential, commercial, or battery package for the public pricing page.
          </p>
        </div>
      </div>

      <PricingPlanForm action={createPricingPlanAction} />
    </div>
  );
}
