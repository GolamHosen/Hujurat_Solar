import { Calendar, Clock, MapPin, Phone, Mail, User, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { getAllLeads } from "@/lib/queries";
import { createGoogleCalendarUrl } from "@/lib/calendar";
import { siteConfig } from "@/lib/site";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-purple-100 text-purple-800 border-purple-200",
  quote_sent: "bg-amber-100 text-amber-800 border-amber-200",
  follow_up: "bg-orange-100 text-orange-800 border-orange-200",
  won: "bg-emerald-100 text-emerald-800 border-emerald-200",
  lost: "bg-slate-100 text-slate-700 border-slate-200",
};

interface CalendarLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  suburb: string | null;
  preferredDate: string | null;
  preferredTimeSlot: string | null;
  consultationType: string | null;
  interestedService: string | null;
  status: string;
  createdAt: Date;
}

function getMonthDays(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  return { daysInMonth, firstDay };
}

function parseTimeSlot(slot: string | null): string {
  if (!slot) return "";
  if (slot.toLowerCase().includes("morning")) return "9:00 AM – 12:00 PM";
  if (slot.toLowerCase().includes("midday")) return "12:00 PM – 3:00 PM";
  if (slot.toLowerCase().includes("afternoon")) return "3:00 PM – 6:00 PM";
  return slot;
}

function getTimeSlotColor(slot: string | null): string {
  if (!slot) return "bg-slate-100 text-slate-600";
  if (slot.toLowerCase().includes("morning")) return "bg-amber-100 text-amber-800";
  if (slot.toLowerCase().includes("midday")) return "bg-sky-100 text-sky-800";
  if (slot.toLowerCase().includes("afternoon")) return "bg-violet-100 text-violet-800";
  return "bg-slate-100 text-slate-600";
}

export default async function DashboardCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const viewYear = params.year ? parseInt(params.year) : now.getFullYear();
  const viewMonth = params.month ? parseInt(params.month) - 1 : now.getMonth();
  const { daysInMonth, firstDay } = getMonthDays(viewYear, viewMonth);
  const monthName = new Date(viewYear, viewMonth).toLocaleString("en-AU", { month: "long" });

  // Get all leads with bookings
  const allLeads = await getAllLeads();
  const leadsWithBookings = allLeads.filter((l) => l.preferredDate);

  // Group leads by date
  const leadsByDate: Record<string, CalendarLead[]> = {};
  for (const lead of leadsWithBookings) {
    if (lead.preferredDate) {
      if (!leadsByDate[lead.preferredDate]) leadsByDate[lead.preferredDate] = [];
      leadsByDate[lead.preferredDate].push(lead as CalendarLead);
    }
  }

  // Navigation links
  const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
  const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  // Current month's bookings
  const currentMonthBookings = leadsWithBookings.filter((l) => {
    if (!l.preferredDate) return false;
    const parts = l.preferredDate.split("-");
    return parseInt(parts[0]) === viewYear && parseInt(parts[1]) === viewMonth + 1;
  });

  // Upcoming bookings (from today onwards)
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const upcomingBookings = leadsWithBookings
    .filter((l) => l.preferredDate && l.preferredDate >= todayStr)
    .sort((a, b) => (a.preferredDate || "").localeCompare(b.preferredDate || ""))
    .slice(0, 8);

  // Calendar days array
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarCells: Array<{ day: number; isCurrentMonth: boolean; dateStr: string; leads: CalendarLead[] }> = [];

  // Previous month padding
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push({ day: prevMonthDays - i, isCurrentMonth: false, dateStr: "", leads: [] });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
      leads: leadsByDate[dateStr] || [],
    });
  }

  // Next month padding
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    calendarCells.push({ day: d, isCurrentMonth: false, dateStr: "", leads: [] });
  }

  // Stats
  const totalBookings = leadsWithBookings.length;
  const thisMonthBookings = currentMonthBookings.length;
  const upcomingCount = leadsWithBookings.filter((l) => l.preferredDate && l.preferredDate >= todayStr).length;
  const todayBookings = leadsWithBookings.filter((l) => l.preferredDate === todayStr).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">
            Consultation Calendar
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all scheduled solar consultations and assessments.
          </p>
        </div>
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <User className="h-3.5 w-3.5" /> View All Leads
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Bookings</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900">{totalBookings}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-blue-700">This Month</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-blue-900">{thisMonthBookings}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-emerald-700">Upcoming</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-emerald-900">{upcomingCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-amber-700">Today</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-amber-900">{todayBookings}</p>
        </div>
      </div>

      {/* Calendar + Upcoming sidebar */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Calendar Grid */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <Link
              href={`/dashboard/calendar?month=${prevMonth + 1}&year=${prevYear}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <h2 className="font-display text-lg font-bold text-slate-900">
              {monthName} {viewYear}
            </h2>
            <Link
              href={`/dashboard/calendar?month=${nextMonth + 1}&year=${nextYear}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {DAYS.map((d) => (
              <div key={d} className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarCells.map((cell, idx) => {
              const isToday = cell.dateStr === todayStr;
              const hasBookings = cell.leads.length > 0;

              return (
                <div
                  key={idx}
                  className={`min-h-[90px] border-b border-r border-slate-50 p-1.5 transition ${
                    !cell.isCurrentMonth
                      ? "bg-slate-50/50"
                      : isToday
                      ? "bg-amber-50/30"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        !cell.isCurrentMonth
                          ? "text-slate-200"
                          : isToday
                          ? "bg-[#061225] text-white"
                          : "text-slate-600"
                      }`}
                    >
                      {cell.day}
                    </span>
                    {hasBookings && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white px-1">
                        {cell.leads.length}
                      </span>
                    )}
                  </div>

                  {/* Booking pills */}
                  <div className="mt-1 space-y-0.5">
                    {cell.leads.slice(0, 2).map((lead) => (
                      <div
                        key={lead.id}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold truncate ${getTimeSlotColor(lead.preferredTimeSlot)}`}
                        title={`${lead.name} - ${lead.consultationType || "Assessment"} (${parseTimeSlot(lead.preferredTimeSlot)})`}
                      >
                        {lead.name.split(" ")[0]}
                      </div>
                    ))}
                    {cell.leads.length > 2 && (
                      <span className="text-[10px] font-bold text-slate-400 px-1">
                        +{cell.leads.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Appointments Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Upcoming Appointments
            </h3>

            <div className="mt-4 space-y-3">
              {upcomingBookings.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <Calendar className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No upcoming bookings</p>
                </div>
              ) : (
                upcomingBookings.map((lead) => {
                  const calUrl = createGoogleCalendarUrl({
                    title: `Solar Assessment: ${lead.name}`,
                    description: `Hujurat Solar Consultation with ${lead.name}.\nContact: ${lead.phone || "No phone"} | ${lead.email}\nService: ${lead.interestedService || "General"}\nType: ${lead.consultationType || "Assessment"}\nSuburb: ${lead.suburb || ""}`,
                    dateStr: lead.preferredDate || undefined,
                    timeSlot: lead.preferredTimeSlot || undefined,
                    location: lead.suburb ? `${lead.suburb}, NSW, Australia` : siteConfig.address,
                  });

                  const isBookingToday = lead.preferredDate === todayStr;

                  return (
                    <div
                      key={lead.id}
                      className={`rounded-xl border p-3 transition hover:shadow-sm ${
                        isBookingToday
                          ? "border-amber-300 bg-amber-50/50"
                          : "border-slate-100 bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 truncate">{lead.name}</span>
                            {isBookingToday && (
                              <span className="shrink-0 inline-flex items-center rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                                TODAY
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 space-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                              {lead.preferredDate ? new Date(lead.preferredDate + "T00:00:00").toLocaleDateString("en-AU", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              }) : "TBD"}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                              {parseTimeSlot(lead.preferredTimeSlot) || "Flexible"}
                            </div>
                            {lead.suburb && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                {lead.suburb}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_COLORS[lead.status] || "bg-slate-100 text-slate-700"}`}>
                          {lead.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Quick actions */}
                      <div className="mt-2.5 flex items-center gap-2 border-t border-slate-100 pt-2">
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-200 transition"
                            title="Call"
                          >
                            <Phone className="h-3 w-3" /> Call
                          </a>
                        )}
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-200 transition"
                          title="Email"
                        >
                          <Mail className="h-3 w-3" /> Email
                        </a>
                        <a
                          href={calUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-200 transition"
                          title="Add to Calendar"
                        >
                          <Calendar className="h-3 w-3" /> GCal
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Time Slot Colors
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="text-xs text-slate-600">Morning (9 AM – 12 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-sky-400" />
                <span className="text-xs text-slate-600">Midday (12 PM – 3 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-violet-400" />
                <span className="text-xs text-slate-600">Afternoon (3 PM – 6 PM)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
