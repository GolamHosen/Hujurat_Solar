import { Users, Mail, Phone, MapPin, Zap, Battery, Trash2, Calendar, CheckCircle2 } from "lucide-react";
import { getAllLeads } from "@/lib/queries";
import { updateLeadStatusAction, deleteLeadAction } from "@/lib/actions/leads";
import { isSmtpConfigured, getCleanEnv } from "@/lib/email";
import SmtpStatusBanner from "@/components/dashboard/SmtpStatusBanner";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string }
> = {
  new: { label: "New", badgeClass: "bg-blue-100 text-blue-800 border-blue-200" },
  contacted: { label: "Contacted", badgeClass: "bg-purple-100 text-purple-800 border-purple-200" },
  quote_sent: { label: "Quote Sent", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" },
  follow_up: { label: "Follow Up", badgeClass: "bg-orange-100 text-orange-800 border-orange-200" },
  won: { label: "Won (Sold)", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  lost: { label: "Lost", badgeClass: "bg-slate-100 text-slate-700 border-slate-200" },
};

export default async function DashboardLeadsPage() {
  const leads = await getAllLeads();

  const total = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const quoteSent = leads.filter((l) => l.status === "quote_sent").length;
  const won = leads.filter((l) => l.status === "won").length;

  const smtpActive = isSmtpConfigured();
  const smtpHost = getCleanEnv("SMTP_HOST");
  const smtpUser = getCleanEnv("SMTP_USER");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">
            Solar Quote Leads & Inquiries
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage inbound quotation requests, residential and commercial inquiries.
          </p>
        </div>
      </div>

      {/* SMTP Email Delivery Status & Diagnostics */}
      <SmtpStatusBanner
        isConfigured={smtpActive}
        smtpHost={smtpHost}
        smtpUser={smtpUser}
      />

      {/* KPI Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Inquiries</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900">{total}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-blue-700">Needs Response (New)</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-blue-900">{newLeads}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-amber-700">Quotes In Flight</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-amber-900">{quoteSent}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-emerald-700">Deals Won</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-emerald-900">{won}</p>
        </div>
      </div>

      {/* Leads List */}
      <div className="mt-6 space-y-4">
        {leads.map((lead) => {
          const updateAction = updateLeadStatusAction.bind(null, lead.id);
          const statusInfo = STATUS_CONFIG[lead.status] || {
            label: lead.status,
            badgeClass: "bg-slate-100 text-slate-700",
          };

          return (
            <div
              key={lead.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Contact & Primary Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-display text-base font-bold text-slate-900">
                      {lead.name}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.badgeClass}`}
                    >
                      {statusInfo.label}
                    </span>
                    {lead.batteryRequired && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                        <Battery className="h-3 w-3" /> +Battery Desired
                      </span>
                    )}
                  </div>

                  {/* Contact Links */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1 text-brand-dark hover:underline font-medium"
                    >
                      <Mail className="h-3.5 w-3.5" /> {lead.email}
                    </a>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {lead.phone}
                      </a>
                    )}
                    {lead.suburb && (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {lead.suburb}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />{" "}
                      {new Date(lead.createdAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Requirements Pills */}
                  <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                    {lead.interestedService && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">
                        Service: {lead.interestedService}
                      </span>
                    )}
                    {lead.systemSizeInterest && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-800 font-medium border border-amber-100">
                        <Zap className="h-3 w-3" /> {lead.systemSizeInterest}
                      </span>
                    )}
                    {lead.propertyType && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600">
                        Property: {lead.propertyType}
                      </span>
                    )}
                    {lead.electricityBill && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-600">
                        Quarterly Bill: {lead.electricityBill}
                      </span>
                    )}
                    {lead.source && (
                      <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-slate-500 text-[11px]">
                        Source: {lead.source.replace("_", " ")}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  {lead.message && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100">
                      <p className="font-semibold text-slate-500 mb-0.5">Message:</p>
                      <p className="whitespace-pre-wrap">{lead.message}</p>
                    </div>
                  )}
                </div>

                {/* Pipeline Status Form & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <form action={updateAction} className="flex items-center gap-2">
                    <label htmlFor={`status-${lead.id}`} className="sr-only">
                      Change status
                    </label>
                    <select
                      id={`status-${lead.id}`}
                      name="status"
                      defaultValue={lead.status}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-brand focus:outline-none"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quote_sent">Quote Sent</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="won">Won (Sold)</option>
                      <option value="lost">Lost</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark transition"
                    >
                      Update
                    </button>
                  </form>

                  <form action={deleteLeadAction.bind(null, lead.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete Lead"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}

        {leads.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
            <Users className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="font-display text-base font-bold text-slate-900">
              No Leads Yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Inbound quote requests and contact form submissions from your website will appear here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
