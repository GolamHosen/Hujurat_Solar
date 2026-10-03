"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sun,
  MapPin,
  Video,
  Phone,
  Download,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Smartphone,
  Home,
  Zap,
} from "lucide-react";
import { leadFormSchema, type LeadFormValues } from "@/lib/validation";
import { createGoogleCalendarUrl, createIcsCalendarContent } from "@/lib/calendar";
import { siteConfig } from "@/lib/site";

const CONSULTATION_TYPES = [
  {
    id: "On-Site Solar Roof Assessment",
    label: "On-Site Roof Assessment",
    description: "We visit your property to inspect roof orientation, shading & solar exposure",
    icon: MapPin,
    duration: "45-60 min",
  },
  {
    id: "Phone Consultation",
    label: "Phone Consultation",
    description: "Quick phone call to discuss your solar requirements and get a ballpark estimate",
    icon: Phone,
    duration: "15-20 min",
  },
  {
    id: "Video Meeting",
    label: "Video Meeting",
    description: "Virtual meeting via Zoom or Google Meet to review your property details remotely",
    icon: Video,
    duration: "30 min",
  },
];

const TIME_SLOTS = [
  { id: "Morning (9:00 AM - 12:00 PM)", label: "Morning", time: "9:00 AM – 12:00 PM", icon: "🌅" },
  { id: "Midday (12:00 PM - 3:00 PM)", label: "Midday", time: "12:00 PM – 3:00 PM", icon: "☀️" },
  { id: "Afternoon (3:00 PM - 6:00 PM)", label: "Afternoon", time: "3:00 PM – 6:00 PM", icon: "🌇" },
];

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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isWeekday(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day).getDay();
  return d !== 0; // Only exclude Sunday
}

function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

function isPast(year: number, month: number, day: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(year, month, day);
  return date <= today;
}

export default function BookConsultationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<LeadFormValues | null>(null);

  // Calendar state
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedConsultationType, setSelectedConsultationType] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<
    Array<{
      id: string;
      label: string;
      time: string;
      icon: string;
      available: boolean;
      remaining?: number;
    }>
  >(TIME_SLOTS.map((s) => ({ ...s, available: true, remaining: 3 })));
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      propertyType: "residential",
      batteryRequired: false,
      source: "direct",
    },
  });

  // Calendar computation
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const monthName = new Date(viewYear, viewMonth).toLocaleString("en-AU", { month: "long" });

  const calendarDays = useMemo(() => {
    const days: Array<{ day: number; isCurrentMonth: boolean; disabled: boolean; isToday: boolean }> = [];

    // Previous month padding
    const prevMonthDays = getDaysInMonth(
      viewMonth === 0 ? viewYear - 1 : viewYear,
      viewMonth === 0 ? 11 : viewMonth - 1
    );
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, disabled: true, isToday: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const past = isPast(viewYear, viewMonth, d);
      const weekday = isWeekday(viewYear, viewMonth, d);
      days.push({
        day: d,
        isCurrentMonth: true,
        disabled: past || !weekday,
        isToday: isToday(viewYear, viewMonth, d),
      });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, isCurrentMonth: false, disabled: true, isToday: false });
    }

    return days;
  }, [viewYear, viewMonth, daysInMonth, firstDay]);

  const navigateMonth = (dir: -1 | 1) => {
    let newMonth = viewMonth + dir;
    let newYear = viewYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    // Don't allow navigating to past months
    const now = new Date();
    if (newYear < now.getFullYear() || (newYear === now.getFullYear() && newMonth < now.getMonth())) return;
    // Limit to 3 months ahead
    const maxDate = new Date(now.getFullYear(), now.getMonth() + 3, 1);
    if (new Date(newYear, newMonth, 1) > maxDate) return;
    setViewYear(newYear);
    setViewMonth(newMonth);
  };

  const handleDateSelect = async (day: number) => {
    const dateStr = formatDate(new Date(viewYear, viewMonth, day));
    setSelectedDate(dateStr);
    setValue("preferredDate", dateStr);
    setSelectedTimeSlot("");
    setValue("preferredTimeSlot", "");
    setIsLoadingSlots(true);
    try {
      const res = await fetch(`/api/calendar/availability?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.slots)) {
          setAvailableSlots(data.slots);
        }
      }
    } catch {
      // Fallback gracefully to default slots
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
    setValue("preferredTimeSlot", slotId);
  };

  const handleConsultationTypeSelect = (typeId: string) => {
    setSelectedConsultationType(typeId);
    setValue("consultationType", typeId);
  };

  const canProceedStep1 = Boolean(selectedConsultationType);
  const canProceedStep2 = Boolean(selectedDate && selectedTimeSlot);

  const onSubmit = async (values: LeadFormValues) => {
    setSubmitError(null);
    try {
      const payload: LeadFormValues = {
        ...values,
        preferredDate: selectedDate,
        preferredTimeSlot: selectedTimeSlot,
        consultationType: selectedConsultationType,
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
      setSubmitError("Something went wrong. Please call us instead.");
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

  // Success screen
  if (submitted && submittedData) {
    const calEvent = {
      title: `Hujurat Solar Consultation (${submittedData.consultationType || "Assessment"})`,
      description: `Solar consultation with Hujurat Solar.\nType: ${submittedData.consultationType || "On-Site Solar Assessment"}\nService: ${submittedData.interestedService || "Solar & Battery Package"}\nPhone: ${siteConfig.phoneDisplay} / ${siteConfig.phoneMobileDisplay}\nEmail: ${siteConfig.email}`,
      dateStr: submittedData.preferredDate || undefined,
      timeSlot: submittedData.preferredTimeSlot || undefined,
      location: submittedData.suburb ? `${submittedData.suburb}, NSW, Australia` : siteConfig.address,
    };
    const googleCalUrl = createGoogleCalendarUrl(calEvent);

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50/30">
        <div className="section-container py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-lg"
          >
            <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-10 shadow-xl shadow-emerald-100/50 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>

              <h1 className="mt-5 font-display text-2xl font-extrabold text-emerald-950">
                Booking Confirmed!
              </h1>
              <p className="mt-2 text-sm text-emerald-800">
                Thanks {submittedData.name.split(" ")[0]}! Your consultation has been booked. We&apos;ll reach out to confirm shortly.
              </p>

              {/* Booking summary card */}
              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-left">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <Calendar className="h-4 w-4" />
                  Booking Details
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p><strong>Date:</strong> {submittedData.preferredDate ? formatDisplayDate(submittedData.preferredDate) : "TBD"}</p>
                  <p><strong>Time:</strong> {submittedData.preferredTimeSlot}</p>
                  <p><strong>Type:</strong> {submittedData.consultationType}</p>
                  {submittedData.suburb && <p><strong>Location:</strong> {submittedData.suburb}, NSW</p>}
                </div>
              </div>

              {/* Calendar action buttons */}
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                  </svg>
                  Add to Google Calendar
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>

                <button
                  type="button"
                  onClick={() => handleDownloadIcs(submittedData)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" />
                  Download .ICS (Outlook / Apple)
                </button>
              </div>

              <p className="mt-5 text-xs text-slate-400">
                A confirmation email with calendar invite has been sent to {submittedData.email}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#061225] py-16 sm:py-20">
        <div className="absolute inset-0 opacity-8">
          <div className="hero-section bg-grid absolute inset-0" />
        </div>
        <div className="section-container relative text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest ring-1 ring-amber-400/20">
            <Calendar className="h-3.5 w-3.5" />
            Free Consultation
          </div>
          <h1 className="mt-5 font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Book Your Free Solar<br />
            <span className="text-[#FFB71B]">Consultation</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-300">
            Choose a date and time that works for you. Our certified solar specialists will help you design the perfect system for your property.
          </p>
        </div>
      </section>

      {/* Step Progress */}
      <div className="section-container py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[
              { num: 1, label: "Consultation Type" },
              { num: 2, label: "Date & Time" },
              { num: 3, label: "Your Details" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                  className={`flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition ${
                    step === s.num
                      ? "bg-[#061225] text-white shadow-lg"
                      : step > s.num
                      ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                      : "bg-slate-100 text-slate-400"
                  }`}
                  disabled={s.num > step}
                >
                  {step > s.num ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                      step === s.num ? "bg-[#FFB71B] text-[#061225]" : "bg-slate-200 text-slate-500"
                    }`}>
                      {s.num}
                    </span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < 2 && <div className={`h-px w-6 sm:w-12 ${step > s.num ? "bg-emerald-300" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="section-container pb-16">
        <div className="mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Consultation Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 text-center mb-2">
                  How would you like to consult?
                </h2>
                <p className="text-center text-sm text-slate-500 mb-8">
                  Select the consultation type that suits you best
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {CONSULTATION_TYPES.map((type) => {
                    const selected = selectedConsultationType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleConsultationTypeSelect(type.id)}
                        className={`relative rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                          selected
                            ? "border-[#FFB71B] bg-amber-50/50 shadow-lg shadow-amber-100/50 ring-2 ring-[#FFB71B]/20"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                        }`}
                      >
                        {selected && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="h-5 w-5 text-[#FFB71B]" />
                          </div>
                        )}
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          selected ? "bg-[#FFB71B]/20 text-[#b47f00]" : "bg-slate-100 text-slate-600"
                        }`}>
                          <type.icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-3 font-display text-sm font-bold text-slate-900">{type.label}</h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">{type.description}</p>
                        <div className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          selected ? "bg-[#FFB71B]/20 text-[#8a6200]" : "bg-slate-100 text-slate-500"
                        }`}>
                          <Clock className="h-3 w-3" />
                          {type.duration}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => canProceedStep1 && setStep(2)}
                    disabled={!canProceedStep1}
                    className="inline-flex items-center gap-2 rounded-full bg-[#061225] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#FFB71B] hover:text-[#061225] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Choose Date & Time
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 text-center mb-2">
                  Pick your preferred date & time
                </h2>
                <p className="text-center text-sm text-slate-500 mb-8">
                  Available Monday – Saturday. Times shown in Australian Eastern Time.
                </p>

                <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                  {/* Calendar */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <button
                        type="button"
                        onClick={() => navigateMonth(-1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {monthName} {viewYear}
                      </h3>
                      <button
                        type="button"
                        onClick={() => navigateMonth(1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {DAYS.map((d) => (
                        <div key={d} className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 py-1">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Date grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((cell, idx) => {
                        const cellDateStr = cell.isCurrentMonth
                          ? formatDate(new Date(viewYear, viewMonth, cell.day))
                          : "";
                        const isSelected = cellDateStr === selectedDate;

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={cell.disabled || !cell.isCurrentMonth}
                            onClick={() => cell.isCurrentMonth && !cell.disabled && handleDateSelect(cell.day)}
                            className={`relative flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 ${
                              !cell.isCurrentMonth
                                ? "text-slate-200 cursor-default"
                                : cell.disabled
                                ? "text-slate-300 cursor-not-allowed"
                                : isSelected
                                ? "bg-[#061225] text-white font-bold shadow-lg scale-105"
                                : cell.isToday
                                ? "bg-amber-100 text-amber-800 font-bold hover:bg-amber-200"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {cell.day}
                            {cell.isToday && !isSelected && (
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Today
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#061225]" /> Selected
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Unavailable
                      </span>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="lg:w-64">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {selectedDate ? `Time Slots · ${formatDisplayDate(selectedDate).split(",")[0]}` : "Select a date first"}
                      </h4>
                      {isLoadingSlots && <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />}
                    </div>

                    <div className="space-y-3">
                      {availableSlots.map((slot) => {
                        const selected = selectedTimeSlot === slot.id;
                        const isUnavailable = !selectedDate || !slot.available;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() => handleTimeSlotSelect(slot.id)}
                            className={`w-full rounded-xl border-2 p-3.5 text-left transition-all duration-200 ${
                              !selectedDate
                                ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                                : !slot.available
                                ? "border-red-100 bg-red-50/40 text-slate-400 cursor-not-allowed opacity-60"
                                : selected
                                ? "border-[#FFB71B] bg-amber-50 shadow-md ring-2 ring-[#FFB71B]/20"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg">{slot.icon}</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className={`text-sm font-bold ${selected ? "text-[#8a6200]" : "text-slate-800"}`}>
                                      {slot.label}
                                    </p>
                                    {selectedDate && !slot.available && (
                                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 uppercase">
                                        Full
                                      </span>
                                    )}
                                    {selectedDate && slot.available && slot.remaining !== undefined && slot.remaining <= 1 && (
                                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                                        1 spot left
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-xs ${selected ? "text-[#b47f00]" : "text-slate-400"}`}>
                                    {slot.time}
                                  </p>
                                </div>
                              </div>
                              {selected && <CheckCircle2 className="h-5 w-5 text-[#FFB71B]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected summary */}
                    {selectedDate && selectedTimeSlot && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Selected Slot
                        </div>
                        <p className="mt-1 text-emerald-700">
                          {formatDisplayDate(selectedDate)}
                        </p>
                        <p className="text-emerald-600">
                          {TIME_SLOTS.find((s) => s.id === selectedTimeSlot)?.time}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => canProceedStep2 && setStep(3)}
                    disabled={!canProceedStep2}
                    className="inline-flex items-center gap-2 rounded-full bg-[#061225] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#FFB71B] hover:text-[#061225] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Enter Your Details
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 text-center mb-2">
                  Almost there! Enter your details
                </h2>
                <p className="text-center text-sm text-slate-500 mb-6">
                  We&apos;ll confirm your consultation and send you a Google Calendar invite
                </p>

                {/* Booking summary pill */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 font-bold text-slate-700">
                    {CONSULTATION_TYPES.find((c) => c.id === selectedConsultationType)?.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 font-bold text-emerald-700">
                    <Calendar className="h-3 w-3" />
                    {selectedDate ? formatDisplayDate(selectedDate).split(",").slice(0, 2).join(",") : ""}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 font-bold text-amber-800">
                    <Clock className="h-3 w-3" />
                    {TIME_SLOTS.find((s) => s.id === selectedTimeSlot)?.time}
                  </span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <User className="h-3.5 w-3.5 text-slate-400" /> Full Name
                      </label>
                      <input
                        {...register("name")}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                        placeholder="Jane Smith"
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Smartphone className="h-3.5 w-3.5 text-slate-400" /> Phone
                      </label>
                      <input
                        {...register("phone")}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                        placeholder="04xx xxx xxx"
                      />
                      {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                        placeholder="jane@email.com"
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Home className="h-3.5 w-3.5 text-slate-400" /> Suburb
                      </label>
                      <input
                        {...register("suburb")}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                        placeholder="Parramatta"
                      />
                      {errors.suburb && <p className="mt-1 text-xs text-red-600">{errors.suburb.message}</p>}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Zap className="h-3.5 w-3.5 text-slate-400" /> Interested Service
                      </label>
                      <select
                        {...register("interestedService")}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      >
                        <option value="">Select a service</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Sun className="h-3.5 w-3.5 text-slate-400" /> Property Type
                      </label>
                      <select
                        {...register("propertyType")}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Message (optional)</label>
                    <textarea
                      {...register("message")}
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                      placeholder="Tell us about your roof, usage, or any specific requirements..."
                    />
                  </div>

                  {submitError && (
                    <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">{submitError}</p>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-full bg-[#061225] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#FFB71B] hover:text-[#061225] disabled:opacity-60"
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Confirm Booking
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Trust indicators */}
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" /> No obligation
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Google Calendar sync
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Email confirmation
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
