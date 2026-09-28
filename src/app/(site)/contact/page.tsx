import { Mail, MapPin, Phone, Clock } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import LeadForm from "@/components/forms/LeadForm";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact Us | Get a Free Solar Quote",
  description:
    "Contact Hujurat Solar Supply & Install for a free, no-obligation solar or battery quote. Servicing Sydney and Western Sydney.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div>
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <section className="section-container grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Get in touch</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            Get your free solar quote
          </h1>
          <p className="mt-5 text-slate-600">
            Fill out the form and a member of our team will be in touch within one business day. Or contact us
            directly using the details below.
          </p>

          <ul className="mt-8 space-y-5">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-brand-dark" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Phone</p>
                <a href={`tel:${siteConfig.phone}`} className="text-sm text-slate-600">
                  {siteConfig.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-brand-dark" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Email</p>
                <a href={`mailto:${siteConfig.email}`} className="text-sm text-slate-600">
                  {siteConfig.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-brand-dark" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Showroom</p>
                <p className="text-sm text-slate-600">
                  {siteConfig.addressLocality}, {siteConfig.addressRegion} {siteConfig.postalCode}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-brand-dark" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Hours</p>
                <p className="text-sm text-slate-600">Monday - Friday: 8am - 5pm</p>
                <p className="text-sm text-slate-600">Saturday: 9am - 1pm</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <LeadForm />
        </div>
      </section>
    </div>
  );
}
