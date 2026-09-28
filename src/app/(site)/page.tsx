import Hero from "@/components/home/Hero";
import EnergyFlow from "@/components/home/EnergyFlow";
import ServicesGrid from "@/components/home/ServicesGrid";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import LocationsStrip from "@/components/home/LocationsStrip";
import Testimonials from "@/components/home/Testimonials";
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
import { buildMetadata, aggregateRatingSchema } from "@/lib/seo";
import { average } from "@/lib/format";

export const metadata = buildMetadata({
  title: "Hujurat Solar Supply & Install | Solar Panels, Batteries & Installation Sydney",
  description:
    "Hujurat Solar designs and installs premium residential and commercial solar, battery storage and monitoring systems across Sydney and Western Sydney. Get a free quote today.",
  path: "/",
});

export default async function HomePage() {
  const [services, featuredProjects, locations, testimonials, blogPosts] = await Promise.all([
    getServices({ limit: 6 }),
    getProjects({ featured: true, limit: 3 }),
    getLocations(),
    getTestimonials(),
    getPosts({ limit: 3 }),
  ]);

  const reviewCount = testimonials.length;
  const averageRating = average(testimonials.map((testimonial) => testimonial.rating));

  return (
    <>
      {reviewCount > 0 && (
        <JsonLd data={aggregateRatingSchema({ ratingValue: averageRating, reviewCount })} />
      )}
      <Hero />
      <EnergyFlow />
      <ServicesGrid services={services} />
      <FeaturedProjects projects={featuredProjects} />
      <LocationsStrip items={locations.slice(0, 8)} />
      <Testimonials items={testimonials} />
      <BlogPreview posts={blogPosts} />
      <CTASection />
    </>
  );
}
