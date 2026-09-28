"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Locations", href: "/locations" },
  { label: "Projects", href: "/projects" },
  { label: "Solar Calculator", href: "/solar-calculator" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="section-container flex h-20 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt={siteConfig.shortName} width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
          <span className="font-display text-lg font-extrabold leading-tight text-slate-950">
            Hujurat Solar
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-dark">
              Supply &amp; Install
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition hover:text-brand-dark ${
                  active ? "text-brand-dark" : "text-slate-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex flex-col items-end leading-tight">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 transition hover:text-brand-dark"
              title="Call Office"
            >
              <Phone className="h-3 w-3 text-brand-dark" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>
            <a
              href={`tel:${siteConfig.phoneMobile}`}
              className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-brand-dark"
              title="Call Mobile"
            >
              <Phone className="h-3 w-3 text-brand-dark" />
              <span>{siteConfig.phoneMobileDisplay}</span>
            </a>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark shrink-0"
          >
            Get a Free Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="section-container flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Call Us</span>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-brand-dark"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-dark" />
                    {siteConfig.phoneDisplay}
                  </span>
                  <span className="text-xs font-normal text-slate-500">Office</span>
                </a>
                <a
                  href={`tel:${siteConfig.phoneMobile}`}
                  className="flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-brand-dark"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-dark" />
                    {siteConfig.phoneMobileDisplay}
                  </span>
                  <span className="text-xs font-normal text-slate-500">Mobile</span>
                </a>
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Get a Free Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
