"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
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
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="section-container flex h-20 sm:h-22 items-center justify-between py-3">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 group" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt={siteConfig.shortName}
            width={56}
            height={56}
            priority
            className="h-12 w-12 sm:h-13 sm:w-13 rounded-xl object-contain drop-shadow-[0_2px_8px_rgba(255,183,27,0.2)] transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-xl sm:text-2xl font-extrabold leading-tight text-[#061225] tracking-tight">
            Hujurat Solar
            <span className="block text-xs sm:text-[13px] font-bold uppercase tracking-[0.22em] text-[#FFB71B]">
              Supply &amp; Install
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 xl:gap-9 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`text-[15px] xl:text-[16px] font-semibold transition-colors duration-200 ${
                  active ? "text-[#FFB71B]" : "text-[#061225]/85 hover:text-[#FFB71B]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Phone Contacts */}
        <div className="hidden items-center gap-5 lg:flex">
          <div className="flex flex-col items-end leading-tight gap-0.5">
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-[#061225] transition hover:text-[#FFB71B]"
              title="Call Office"
            >
              <Phone className="h-3.5 w-3.5 text-[#FFB71B]" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>
            <a
              href={`tel:${siteConfig.phoneMobile}`}
              className="flex items-center gap-2 text-[13px] sm:text-[14px] font-medium text-[#475569] transition hover:text-[#FFB71B]"
              title="Call Mobile"
            >
              <Phone className="h-3.5 w-3.5 text-[#FFB71B]" />
              <span>{siteConfig.phoneMobileDisplay}</span>
            </a>
          </div>

          <Link
            href="/contact"
            prefetch={true}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#061225] px-6 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-bold text-white transition-all duration-300 hover:bg-[#FFB71B] hover:text-[#061225] shadow-[0_4px_16px_rgba(6,18,37,0.2)] hover:shadow-[0_0_20px_rgba(255,183,27,0.4)] shrink-0"
          >
            <span>Get a Free Quote</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-[#061225] lg:hidden hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              <Link
                href="/contact"
                prefetch={true}
                onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-[#061225] px-6 py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-[#FFB71B] hover:text-[#061225]"
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
