import Link from "next/link";
import Image from "next/image";
import { Share2, AtSign, Globe, MapPin, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="section-container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt={siteConfig.shortName} width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-display text-lg font-extrabold text-white">Hujurat Solar</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{siteConfig.description}</p>
          <div className="mt-5 flex gap-3">
            {[Share2, AtSign, Globe].map((SocialIcon, i) => (
              <a
                key={i}
                href={siteConfig.sameAs[i]}
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-700 text-slate-300 transition hover:border-brand hover:text-brand"
              >
                <SocialIcon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Solar Panels", "/services/solar-panels"],
              ["Solar Battery", "/services/solar-battery"],
              ["Solar Installation", "/services/solar-installation"],
              ["Commercial Solar", "/services/commercial-solar"],
              ["Solar Maintenance", "/services/solar-maintenance"],
              ["Solar Repairs", "/services/solar-repairs"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Service Areas</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Sydney", "/locations/sydney"],
              ["Western Sydney", "/locations/western-sydney"],
              ["Parramatta", "/locations/parramatta"],
              ["Blacktown", "/locations/blacktown"],
              ["Penrith", "/locations/penrith"],
              ["Liverpool", "/locations/liverpool"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>
                {siteConfig.addressLocality}, {siteConfig.addressRegion} {siteConfig.postalCode}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand" />
              <div className="flex flex-col">
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white transition">
                  {siteConfig.phoneDisplay} <span className="text-xs text-slate-500">(Office)</span>
                </a>
                <a href={`tel:${siteConfig.phoneMobile}`} className="hover:text-white transition text-xs text-slate-400 mt-0.5">
                  {siteConfig.phoneMobileDisplay} <span className="text-slate-500">(Mobile)</span>
                </a>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand" />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="section-container flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 md:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved. CEC-accredited solar retailer &amp; installer.
          </p>
          <div className="flex gap-4">
            <Link href="/testimonials" className="hover:text-brand">
              Testimonials
            </Link>
            <Link href="/areas-we-service" className="hover:text-brand">
              Areas We Service
            </Link>
            <Link href="/dashboard/login" className="hover:text-brand">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
