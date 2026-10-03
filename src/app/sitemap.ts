import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getLocations, getPosts, getProjects, getServices } from "@/data/cms";

export const revalidate = 86400; // Cache sitemap for 24h with ISR

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, locations, projects, posts] = await Promise.all([
    getServices(),
    getLocations(),
    getProjects(),
    getPosts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/services",
    "/locations",
    "/projects",
    "/blog",
    "/about",
    "/contact",
    "/testimonials",
    "/areas-we-service",
    "/solar-calculator",
    "/book-consultation",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    lastModified: new Date(service.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${siteConfig.url}/locations/${location.slug}`,
    lastModified: new Date(location.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...locationRoutes, ...projectRoutes, ...blogRoutes];
}
