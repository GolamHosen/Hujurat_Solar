"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, ArrowRight, Calendar } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useQuoteModal } from "@/components/forms/QuoteModalContext";

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
  const { openQuoteModal } = useQuoteModal();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="w-full max-w-[1440px] mx-auto flex h-18 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/solar-logo.png"
            alt={siteConfig.shortName}
            width={52}
            height={52}
            priority
            className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-contain drop-shadow-[0_2px_8px_rgba(255,183,27,0.2)] transition-transform duration-300 group-hover:scale-105 shrink-0"
          />
          <span className="font-display text-lg sm:text-xl font-extrabold leading-tight text-[#061225] tracking-tight whitespace-nowrap">
            Hujurat Solar
            <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#FFB71B]">
              Supply &amp; Install
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-3.5 xl:gap-5 2xl:gap-7 lg:flex shrink-0">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`text-[13px] xl:text-[14px] 2xl:text-[15px] font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 ${
                  active ? "text-[#FFB71B]" : "text-[#061225]/85 hover:text-[#FFB71B]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Phone Contacts */}
        <div className="hidden items-center gap-2.5 xl:gap-3 lg:flex shrink-0">
          <div className="hidden 2xl:flex flex-col items-end leading-tight gap-0.5 mr-1">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-1.5 text-[12px] font-bold text-[#061225] transition hover:text-[#FFB71B] whitespace-nowrap"
              title="Call Office"
            >
              <Phone className="h-3 w-3 text-[#FFB71B]" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>
            <a
              href={`tel:${siteConfig.phoneMobile}`}
              className="flex items-center gap-1.5 text-[11px] font-medium text-[#475569] transition hover:text-[#FFB71B] whitespace-nowrap"
              title="Call Mobile"
            >
              <Phone className="h-3 w-3 text-[#FFB71B]" />
              <span>{siteConfig.phoneMobileDisplay}</span>
            </a>
          </div>

          <button
            type="button"
            onClick={openQuoteModal}
            className="group inline-flex items-center gap-1.5 rounded-full bg-[#061225] px-4 py-2 sm:py-2.5 text-xs xl:text-[13.5px] font-bold text-white transition-all duration-300 hover:bg-[#FFB71B] hover:text-[#061225] shadow-sm hover:shadow-md shrink-0 whitespace-nowrap"
          >
            <span>Get a Free Quote</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>

          {/* Floating Book Consultation Button */}
          <Link
            href="/book-consultation"
            className="group relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FFB71B] via-amber-400 to-[#FFB71B] px-4 py-2 sm:py-2.5 text-xs xl:text-[13.5px] font-extrabold text-[#061225] shadow-[0_3px_12px_rgba(255,183,27,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(255,183,27,0.55)] hover:brightness-105 active:translate-y-0 shrink-0 whitespace-nowrap border border-amber-300/80"
          >
            <Calendar className="h-3.5 w-3.5 text-[#061225]" />
            <span>Book Consultation</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-[#061225] lg:hidden hover:bg-slate-100 shrink-0"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100 bg-white shadow-xl lg:hidden"
          >
            <div className="section-container flex flex-col gap-1.5 py-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-[#061225] hover:bg-slate-50 hover:text-[#FFB71B]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Call Us Directly
                </span>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center justify-between text-sm font-bold text-[#061225] hover:text-[#FFB71B]"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-[#FFB71B]" />
                    {siteConfig.phoneDisplay}
                  </span>
                  <span className="text-xs font-normal text-slate-500">Office</span>
                </a>
                <a
                  href={`tel:${siteConfig.phoneMobile}`}
                  className="flex items-center justify-between text-sm font-bold text-[#061225] hover:text-[#FFB71B]"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-[#FFB71B]" />
                    {siteConfig.phoneMobileDisplay}
                  </span>
                  <span className="text-xs font-normal text-slate-500">Mobile</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => { setOpen(false); openQuoteModal(); }}
                className="mt-3 rounded-full bg-[#061225] px-6 py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-[#FFB71B] hover:text-[#061225]"
              >
                Get a Free Quote
              </button>
              <Link
                href="/book-consultation"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFB71B] to-amber-400 px-6 py-3.5 text-center text-sm font-extrabold text-[#061225] shadow-md hover:brightness-105 transition"
              >
                <Calendar className="h-4 w-4 text-[#061225]" />
                <span>Book Consultation</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
