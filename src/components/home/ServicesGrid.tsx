"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";
import Icon from "@/components/site/Icon";
import type { Service } from "@/data/types";

export default function ServicesGrid({ services: items }: { services: Service[] }) {
  return (
    <section className="section-container py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">What we do</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Full-service solar &amp; battery solutions
          </h2>
        </div>
        <Link href="/services" prefetch={true} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
          View all services <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((service, index) => (
          <Reveal key={service.id} delay={(index % 3) * 0.08} className="h-full">
            <Link
              href={`/services/${service.slug}`}
              prefetch={true}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand-dark transition group-hover:bg-brand group-hover:text-slate-950">
                <Icon name={service.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-slate-950">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{service.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
                Learn more <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
