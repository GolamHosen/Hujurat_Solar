"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

import { HOMEPAGE_FAQS, type FAQItem } from "@/data/faqs";
export { HOMEPAGE_FAQS, type FAQItem };

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-t border-slate-100 bg-slate-50/60 py-24">
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">
            <HelpCircle className="h-4 w-4" /> Got Questions? We&apos;ve Got Answers
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Frequently Asked Questions About Solar in Sydney
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Everything Australian homeowners and businesses need to know about system sizing, government rebates,
            inverter problems, and battery storage.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
          {HOMEPAGE_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={faq.question} delay={0.05 * index} className="py-5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-start justify-between gap-4 text-left transition hover:text-brand-dark"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-bold text-slate-900 sm:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-brand/10 text-brand-dark" : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 pr-8 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {faq.answer}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-sm text-slate-600">
            Have a specific question or solar problem not listed here?
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition hover:gap-2.5"
          >
            Ask our CEC-accredited engineers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
