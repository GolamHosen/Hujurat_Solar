"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { leadFormSchema, type LeadFormValues } from "@/lib/validation";

const SERVICES = [
  "Solar Panels",
  "Solar Battery Storage",
  "Solar Installation",
  "Solar System Upgrade",
  "Commercial Solar",
  "Residential Solar",
  "Solar Maintenance",
  "Solar Repairs",
  "Solar Monitoring",
];

export default function LeadForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      propertyType: "residential",
      batteryRequired: false,
      source: "direct",
    },
  });

  const onSubmit = async (values: LeadFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
      reset();
    } catch {
      setSubmitError("Something went wrong sending your request. Please call us instead.");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-emerald-50 p-10 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <h3 className="font-display text-xl font-bold text-emerald-900">Thanks — we&apos;ve got your details</h3>
        <p className="max-w-sm text-sm text-emerald-800">
          A member of the Hujurat Solar team will be in touch within one business day with your free quote.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm font-semibold text-emerald-700 underline underline-offset-4"
        >
          Submit another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
          <input {...register("name")} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" placeholder="Jane Smith" />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
          <input {...register("phone")} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" placeholder="04xx xxx xxx" />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" {...register("email")} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" placeholder="jane@email.com" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Suburb</label>
          <input {...register("suburb")} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" placeholder="Parramatta" />
          {errors.suburb && <p className="mt-1 text-xs text-red-600">{errors.suburb.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Property type</label>
          <select {...register("propertyType")} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Interested in</label>
          <select {...register("interestedService")} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30">
            <option value="">Select a service</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!compact && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Average quarterly bill</label>
            <select {...register("electricityBill")} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30">
              <option value="">Not sure</option>
              <option value="Under $300">Under $300</option>
              <option value="$300 - $600">$300 - $600</option>
              <option value="$600 - $900">$600 - $900</option>
              <option value="Over $900">Over $900</option>
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" {...register("batteryRequired")} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
              I&apos;m interested in battery storage
            </label>
          </div>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Message (optional)</label>
        <textarea {...register("message")} rows={compact ? 2 : 4} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" placeholder="Tell us a bit about your project..." />
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-brand-dark disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit
      </button>
      <p className="text-center text-xs text-slate-500">No obligation. We respond within one business day.</p>
    </form>
  );
}
