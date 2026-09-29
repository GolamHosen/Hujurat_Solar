import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import {
  services,
  locations,
  projects,
  projectImages,
  projectVideos,
  blogPosts,
  testimonials,
  leads,
  media,
} from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

export const getPublishedServices = cache(async function getPublishedServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.status, "published"))
    .orderBy(services.order, services.title);
});

export const getAllServices = cache(async function getAllServices() {
  return db.select().from(services).orderBy(services.order, services.title);
});

export const getServiceBySlug = cache(async function getServiceBySlug(slug: string) {
  const rows = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return rows[0] ?? null;
});

export const getPublishedLocations = cache(async function getPublishedLocations() {
  return db.select().from(locations).where(eq(locations.status, "published")).orderBy(locations.name);
});

export const getAllLocations = cache(async function getAllLocations() {
  return db.select().from(locations).orderBy(locations.name);
});

export const getLocationBySlug = cache(async function getLocationBySlug(slug: string) {
  const rows = await db.select().from(locations).where(eq(locations.slug, slug)).limit(1);
  return rows[0] ?? null;
});

export const getPublishedProjects = cache(async function getPublishedProjects(limit?: number) {
  const query = db
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(desc(projects.publishedAt), desc(projects.createdAt));
  if (limit) {
    return query.limit(limit);
  }
  return query;
});

export const getFeaturedProjects = cache(async function getFeaturedProjects(limit = 3) {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.status, "published"), eq(projects.featured, true)))
    .orderBy(desc(projects.publishedAt))
    .limit(limit);
});

export const getAllProjects = cache(async function getAllProjects() {
  return db.select().from(projects).orderBy(desc(projects.createdAt));
});

export const getProjectBySlug = cache(async function getProjectBySlug(slug: string) {
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return rows[0] ?? null;
});

export const getProjectImages = cache(async function getProjectImages(projectId: number) {
  return db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(projectImages.order);
});

export const getProjectVideos = cache(async function getProjectVideos(projectId: number) {
  return db.select().from(projectVideos).where(eq(projectVideos.projectId, projectId));
});

export const getPublishedBlogPosts = cache(async function getPublishedBlogPosts(limit?: number) {
  const query = db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));
  if (limit) return query.limit(limit);
  return query;
});

export const getAllBlogPosts = cache(async function getAllBlogPosts() {
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
});

export const getBlogPostBySlug = cache(async function getBlogPostBySlug(slug: string) {
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return rows[0] ?? null;
});

export const getPublishedTestimonials = cache(async function getPublishedTestimonials(limit?: number) {
  const query = db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, "published"))
    .orderBy(desc(testimonials.featured), desc(testimonials.createdAt));
  if (limit) return query.limit(limit);
  return query;
});

export const getAllTestimonials = cache(async function getAllTestimonials() {
  return db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
});

export const getAllLeads = cache(async function getAllLeads() {
  return db.select().from(leads).orderBy(desc(leads.createdAt));
});

export const getLeadById = cache(async function getLeadById(id: number) {
  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return rows[0] ?? null;
});

export const getAllMedia = cache(async function getAllMedia() {
  return db.select().from(media).orderBy(desc(media.createdAt));
});

export const getDashboardStats = cache(
  unstable_cache(
    async () => {
      const [
        [projectCount],
        [publishedProjectCount],
        [leadCount],
        [newLeadCount],
        [blogCount],
        [serviceCount],
        [locationCount],
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(projects),
        db.select({ count: sql<number>`count(*)::int` }).from(projects).where(eq(projects.status, "published")),
        db.select({ count: sql<number>`count(*)::int` }).from(leads),
        db.select({ count: sql<number>`count(*)::int` }).from(leads).where(eq(leads.status, "new")),
        db.select({ count: sql<number>`count(*)::int` }).from(blogPosts).where(eq(blogPosts.status, "published")),
        db.select({ count: sql<number>`count(*)::int` }).from(services).where(eq(services.status, "published")),
        db.select({ count: sql<number>`count(*)::int` }).from(locations).where(eq(locations.status, "published")),
      ]);

      return {
        totalProjects: projectCount?.count ?? 0,
        publishedProjects: publishedProjectCount?.count ?? 0,
        totalLeads: leadCount?.count ?? 0,
        newLeads: newLeadCount?.count ?? 0,
        publishedBlogPosts: blogCount?.count ?? 0,
        publishedServices: serviceCount?.count ?? 0,
        publishedLocations: locationCount?.count ?? 0,
      };
    },
    ["dashboard-stats"],
    { tags: ["dashboard-stats", "projects", "leads", "posts", "services", "locations"], revalidate: 30 }
  )
);
