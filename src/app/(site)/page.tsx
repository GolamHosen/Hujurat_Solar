import Hero from "@/components/home/Hero";
import EnergyFlow from "@/components/home/EnergyFlow";
import ServicesGrid from "@/components/home/ServicesGrid";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import LocationsStrip from "@/components/home/LocationsStrip";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import BlogPreview from "@/components/home/BlogPreview";
import CTASection from "@/components/home/CTASection";
import JsonLd from "@/components/site/JsonLd";
import {
  getServices,
  getProjects,
  getLocations,
  getTestimonials,
  getPosts,
} from "@/data/cms";
import { HOMEPAGE_FAQS } from "@/data/faqs";
import { buildMetadata, aggregateRatingSchema, faqSchema } from "@/lib/seo";
import { average } from "@/lib/format";

export const metadata = buildMetadata({
  title: "Hujurat Solar Supply & Install | Solar Panels, Batteries & Installation Sydney",
  description:
    "Hujurat Solar designs and installs premium residential and commercial solar, battery storage and monitoring systems across Sydney and Western Sydney. Get a free quote today.",
  path: "/",
});

export default async function HomePage() {
  const [services, featuredProjects, locations, testimonials, blogPosts] = await Promise.all([
    getServices({ limit: 6 }).catch(() => []),
    getProjects({ featured: true, limit: 3 }).catch(() => []),
    getLocations().catch(() => []),
    getTestimonials().catch(() => []),
    getPosts({ limit: 3 }).catch(() => []),
  ]);

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];
  const validRatings = safeTestimonials
    .map((t) => Number(t?.rating))
    .filter((r) => Number.isFinite(r) && r > 0);
  const reviewCount = validRatings.length;
  const averageRating = reviewCount > 0 ? average(validRatings) : 5.0;

  const jsonLdData: (Record<string, unknown> | null)[] = [
    reviewCount > 0 ? aggregateRatingSchema({ ratingValue: averageRating, reviewCount }) : null,
    faqSchema(HOMEPAGE_FAQS),
  ];

  return (
    <>
      <JsonLd data={jsonLdData.filter((item): item is Record<string, unknown> => item !== null)} />
      <Hero />
      <EnergyFlow />
      <ServicesGrid services={services} />
      <FeaturedProjects projects={featuredProjects} />
      <LocationsStrip items={locations.slice(0, 8)} />
      <Testimonials items={testimonials} />
      <FAQSection />
      <BlogPreview posts={blogPosts} />
      <CTASection />
    </>
  );
}
