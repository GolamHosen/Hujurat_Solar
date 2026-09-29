"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export interface FAQItem {
  question: string;
  answer: string;
}

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "How much can I save on electricity bills by installing solar in Sydney?",
    answer:
      "Most Sydney households save between $1,200 and $2,800 annually on electricity bills with a properly sized 6.6kW to 10kW solar system. With daytime solar powering air conditioning and household appliances, grid reliance drops by 50% to 75%. Adding a solar battery allows households to store excess generation and use clean energy during peak evening hours, pushing annual savings even higher.",
  },
  {
    question: "What solar and battery rebates are available in NSW in 2025/2026?",
    answer:
      "Sydney and NSW homeowners can access two major incentives: (1) The Federal Government Small-scale Renewable Energy Scheme (SRES), providing Small-scale Technology Certificates (STCs) that take an immediate point-of-sale discount of approximately $2,000 to $3,500 off system installation costs, and (2) The NSW Peak Demand Reduction Scheme (PDRS) battery rebate, offering up to $1,600 to $2,400 off eligible home battery installations. As a Clean Energy Council (CEC) accredited installer, Hujurat Solar applies all rebates directly at the point of sale.",
  },
  {
    question: "What size solar system do I need for my home in Sydney or Western Sydney?",
    answer:
      "System sizing is determined by your daily kilowatt-hour (kWh) usage on your electricity bill. A 6.6kW system (15–16 panels) is the entry-level standard for 2–3 bedroom homes using 15–20 kWh/day. For larger 4–5 bedroom homes with ducted air conditioning, swimming pools, or plans for an electric vehicle (EV), a 10kW to 13.3kW solar system paired with a 10kWh–15kWh battery provides optimal energy independence and future-proofing.",
  },
  {
    question: "Why is my solar inverter showing a red light or fault error, and how is it fixed?",
    answer:
      "A red warning light on your solar inverter (such as GoodWe, Sungrow, Fronius, or SMA) indicates an operational fault—commonly an isolation fault (PV isolation error), grid over-voltage disconnect, DC isolator water ingress, or internal hardware error. If restarting your system via the AC/DC shutdown procedure does not clear the light, do not attempt to open electrical enclosures yourself. Hujurat Solar provides expert solar fault diagnosis and repairs across Greater Sydney to safely restore your system.",
  },
  {
    question: "Why is choosing a Clean Energy Council (CEC) accredited installer crucial?",
    answer:
      "CEC accreditation ensures that your solar and battery installation complies with strict Australian Standards (AS/NZS 5033 and AS/NZS 4777). Crucially, the Clean Energy Regulator only grants Federal STC solar rebates and NSW state rebates when the installation is signed off by a CEC-accredited installer using CEC-approved panels and inverters. Hujurat Solar is fully accredited, ensuring top-tier safety, compliance, and guaranteed rebate eligibility.",
  },
  {
    question: "Can a solar battery provide backup power during a blackout?",
    answer:
      "Yes, when configured with Emergency Power Supply (EPS) or blackout backup circuitry. Systems like the Sungrow SBR, Tesla Powerwall, and BYD Battery-Box automatically isolate your home from the grid within milliseconds of an outage (anti-islanding protection) and keep essential circuits—such as your refrigerator, lighting, WiFi router, and medical equipment—powered seamlessly.",
  },
  {
    question: "How does the grid connection process work with Ausgrid and Endeavour Energy?",
    answer:
      "Before turning on your solar system, connection approval must be obtained from your local Distribution Network Service Provider (Ausgrid in Sydney's CBD/East/North, or Endeavour Energy in Western Sydney). Hujurat Solar handles 100% of the paperwork, network connection applications, and bi-directional smart meter upgrade requests on your behalf, so you don't have to lift a finger.",
  },
  {
    question: "What warranties do Hujurat Solar systems come with?",
    answer:
      "All our installations feature Tier-1 CEC-approved equipment backed by extensive warranties: 25 to 30-year performance warranties on solar panels, 10 to 12-year manufacturer warranties on hybrid inverters, 10-year warranties on battery storage units, and our own comprehensive 5-year workmanship guarantee on all electrical and mounting labour.",
  },
];

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
