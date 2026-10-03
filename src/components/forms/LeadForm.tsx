"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Calendar, Clock, Download, ExternalLink } from "lucide-react";
import { leadFormSchema, type LeadFormValues } from "@/lib/validation";
import { createGoogleCalendarUrl, createIcsCalendarContent } from "@/lib/calendar";
import { siteConfig } from "@/lib/site";

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

const CONSULTATION_TYPES = [
  "On-Site Solar Roof Assessment",
  "Phone Consultation",
  "Video Meeting",
];

const TIME_SLOTS = [
  "Morning (9:00 AM - 12:00 PM)",
  "Midday (12:00 PM - 3:00 PM)",
  "Afternoon (3:00 PM - 6:00 PM)",
];

export default function LeadForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wantsBooking, setWantsBooking] = useState(false);
  const [submittedData, setSubmittedData] = useState<LeadFormValues | null>(null);

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      propertyType: "residential",
      batteryRequired: false,
      consultationType: "On-Site Solar Roof Assessment",
      preferredTimeSlot: "Morning (9:00 AM - 12:00 PM)",
      source: "direct",
    },
  });

  const onSubmit = async (values: LeadFormValues) => {
    setSubmitError(null);
    try {
      // If user did not check the booking box, clear date/time fields
      const payload: LeadFormValues = {
        ...values,
        preferredDate: wantsBooking ? values.preferredDate : "",
        preferredTimeSlot: wantsBooking ? values.preferredTimeSlot : "",
        consultationType: wantsBooking ? values.consultationType : "",
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");

      setSubmittedData(payload);
      setSubmitted(true);
      reset();
    } catch {
      setSubmitError("Something went wrong sending your request. Please call us instead.");
    }
  };

  const handleDownloadIcs = (data: LeadFormValues) => {
    const calEvent = {
      title: `Hujurat Solar Consultation (${data.consultationType || "Assessment"})`,
      description: `Solar consultation with Hujurat Solar.\nType: ${data.consultationType || "On-Site Solar Assessment"}\nService: ${data.interestedService || "Solar & Battery Package"}\nPhone: ${siteConfig.phoneDisplay} / ${siteConfig.phoneMobileDisplay}\nEmail: ${siteConfig.email}`,
      dateStr: data.preferredDate || undefined,
      timeSlot: data.preferredTimeSlot || undefined,
      location: data.suburb ? `${data.suburb}, NSW, Australia` : siteConfig.address,
    };
    const icsString = createIcsCalendarContent(calEvent);
    const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hujurat-solar-consultation.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (submitted && submittedData) {
    const hasBooking = Boolean(submittedData.preferredDate);
    const calEvent = {
      title: `Hujurat Solar Consultation (${submittedData.consultationType || "Assessment"})`,
      description: `Solar consultation with Hujurat Solar.\nType: ${submittedData.consultationType || "On-Site Solar Assessment"}\nService: ${submittedData.interestedService || "Solar & Battery Package"}\nPhone: ${siteConfig.phoneDisplay} / ${siteConfig.phoneMobileDisplay}\nEmail: ${siteConfig.email}`,
      dateStr: submittedData.preferredDate || undefined,
      timeSlot: submittedData.preferredTimeSlot || undefined,
      location: submittedData.suburb ? `${submittedData.suburb}, NSW, Australia` : siteConfig.address,
    };
    const googleCalUrl = createGoogleCalendarUrl(calEvent);

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-emerald-50/80 p-8 text-center border border-emerald-100"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-emerald-950">
            Thanks, {submittedData.name.split(" ")[0]} — we&apos;ve got your details!
          </h3>
          <p className="mt-1 max-w-sm text-sm text-emerald-800">
            Our solar and energy storage experts are reviewing your enquiry and will contact you very soon.
          </p>
        </div>

        {/* Google Calendar Card */}
        <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Calendar className="h-4 w-4 text-emerald-600" />
            {hasBooking ? "Consultation Scheduled" : "Add to Your Calendar"}
          </div>

          {hasBooking ? (
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p>
                <strong>Date:</strong> {submittedData.preferredDate} ({submittedData.preferredTimeSlot})
              </p>
              <p>
                <strong>Type:</strong> {submittedData.consultationType}
              </p>
              <p className="text-xs text-slate-500 pt-1">
                A calendar invitation (.ics) has also been attached to your confirmation email.
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-slate-600">
              Save a reminder to your Google Calendar so you know when our specialist will reach out.
            </p>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
              </svg>
              Add to Google Calendar
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>

            <button
              type="button"
              onClick={() => handleDownloadIcs(submittedData)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              Download .ICS
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setSubmittedData(null);
          }}
          className="text-xs font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-950"
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
          <input
            {...register("name")}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder="Jane Smith"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
          <input
            {...register("phone")}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder="04xx xxx xxx"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder="jane@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Suburb</label>
          <input
            {...register("suburb")}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            placeholder="Parramatta"
          />
          {errors.suburb && <p className="mt-1 text-xs text-red-600">{errors.suburb.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Property type</label>
          <select
            {...register("propertyType")}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Interested in</label>
          <select
            {...register("interestedService")}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
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
            <select
              {...register("electricityBill")}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="">Not sure</option>
              <option value="Under $300">Under $300</option>
              <option value="$300 - $600">$300 - $600</option>
              <option value="$600 - $900">$600 - $900</option>
              <option value="Over $900">Over $900</option>
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                {...register("batteryRequired")}
                className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              I&apos;m interested in battery storage
            </label>
          </div>
        </div>
      )}

      {/* Google Calendar Consultation Booking Toggle */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={wantsBooking}
            onChange={(e) => {
              const checked = e.target.checked;
              setWantsBooking(checked);
              if (checked) {
                setValue("preferredDate", tomorrowStr);
              }
            }}
            className="h-4 w-4 mt-0.5 rounded border-slate-300 text-brand focus:ring-brand"
          />
          <div>
            <span className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-dark" />
              Schedule a Free Consultation / On-Site Assessment
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Pick your preferred date & time. You will receive an instant 1-click Google Calendar invite!
            </p>
          </div>
        </label>

        {wantsBooking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 pt-3.5 border-t border-slate-200 grid gap-3 sm:grid-cols-3"
          >
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Consultation Type
              </label>
              <select
                {...register("consultationType")}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {CONSULTATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Preferred Date
              </label>
              <input
                type="date"
                min={tomorrowStr}
                {...register("preferredDate")}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Time Slot
              </label>
              <select
                {...register("preferredTimeSlot")}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Message (optional)</label>
        <textarea
          {...register("message")}
          rows={compact ? 2 : 3}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="Tell us a bit about your roof, current electricity usage, or requirements..."
        />
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-brand-dark disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {wantsBooking ? "Confirm Booking & Submit" : "Submit Enquiry"}
      </button>
      <p className="text-center text-xs text-slate-500">
        No obligation. Instant confirmation &amp; Google Calendar sync.
      </p>
    </form>
  );
}

