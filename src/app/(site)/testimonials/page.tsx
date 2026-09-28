import { Star, Quote } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { getTestimonials } from "@/data/cms";
import { buildMetadata, reviewSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Customer Testimonials & Reviews | Hujurat Solar Supply & Install",
  description:
    "Read genuine reviews from Hujurat Solar customers across Sydney and Western Sydney about their solar and battery installation experience.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <Breadcrumbs items={[{ name: "Testimonials", path: "/testimonials" }]} />
      <JsonLd
        data={reviewSchema(
          testimonials.map((t) => ({
            author: t.customerName,
            rating: t.rating,
            content: t.content,
            date: t.publishedAt,
          }))
        )}
      />
      <section className="section-container py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Customer stories</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            What our customers say
          </h1>
          <p className="mt-5 text-slate-600">
            Genuine reviews from real Hujurat Solar customers across Sydney and Western Sydney.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7">
              <Quote className="h-6 w-6 text-brand" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{testimonial.customerName}</p>
                  <p className="text-xs text-slate-500">{testimonial.suburb}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-brand text-brand" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
