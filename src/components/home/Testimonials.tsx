import Reveal from "@/components/ui/Reveal";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/data/types";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="section-container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Customer stories</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
          Trusted by homeowners &amp; businesses
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.slice(0, 3).map((testimonial, index) => (
          <Reveal
            key={testimonial.id}
            delay={index * 0.1}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7"
          >
            <Quote className="h-6 w-6 text-brand" />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{testimonial.content}&rdquo;</p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">{testimonial.customerName}</p>
                <p className="text-xs text-slate-500">{testimonial.suburb}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: Math.max(0, Math.min(5, Math.round(Number(testimonial.rating) || 5))) }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-brand text-brand" />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
