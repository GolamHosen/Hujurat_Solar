import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  blogPosts,
  locations,
  projectImages,
  projects,
  projectVideos,
  services,
  testimonials,
} from "@/db/schema";
import type {
  Image,
  Location,
  Post,
  Project,
  Seo,
  Service,
  ServiceIconName,
  Testimonial,
} from "@/data/types";
import type { ContentRepository, ListOptions } from "./contract";

const serviceIcons = new Set<ServiceIconName>([
  "sun",
  "battery",
  "wrench",
  "gauge",
  "shield",
  "snowflake",
  "panel",
  "monitor",
]);

function toIso(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}

function toNumber(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toImage(url: string | null, alt: string): Image | null {
  if (!url) return null;
  return { url, alt, width: null, height: null };
}

function toSeo(title: string | null, description: string | null, image: Image | null): Seo {
  return {
    title,
    description,
    canonicalUrl: null,
    robots: null,
    openGraphImage: image,
  };
}

function take<T>(items: T[], limit?: number): T[] {
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

function mapProject(row: typeof projects.$inferSelect): Project {
  const featuredImage = toImage(row.featuredImage, row.title);
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    featuredImage,
    suburb: row.suburb,
    state: row.state,
    projectType: row.projectType,
    systemSizeKw: toNumber(row.systemSizeKw),
    batterySizeKwh: toNumber(row.batterySizeKwh),
    featured: row.featured,
    status: row.status,
    publishedAt: toIso(row.publishedAt),
    updatedAt: row.updatedAt.toISOString(),
    categories: [
      {
        slug: row.projectType,
        name: row.projectType === "commercial" ? "Commercial" : "Residential",
      },
    ],
    seo: toSeo(row.seoTitle, row.seoDescription, featuredImage),
  };
}

function mapService(row: typeof services.$inferSelect): Service {
  const heroImage = toImage(row.heroImage, row.title);
  const icon = serviceIcons.has(row.icon as ServiceIconName)
    ? (row.icon as ServiceIconName)
    : "sun";

  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    icon,
    heroImage,
    order: row.order,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
    seo: toSeo(row.seoTitle, row.seoDescription, heroImage),
  };
}

function mapLocation(row: typeof locations.$inferSelect): Location {
  const heroImage = toImage(row.heroImage, row.name);
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    region: row.region,
    state: row.state,
    blurb: row.blurb ?? "",
    heroImage,
    status: row.status,
    updatedAt: row.updatedAt.toISOString(),
    seo: toSeo(row.seoTitle, row.seoDescription, heroImage),
  };
}

function mapPost(row: typeof blogPosts.$inferSelect): Post {
  const coverImage = toImage(row.coverImage, row.title);
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    coverImage,
    category: row.category,
    tags: row.tags ?? [],
    authorName: row.authorName,
    status: row.status,
    publishedAt: toIso(row.publishedAt),
    updatedAt: row.updatedAt.toISOString(),
    seo: toSeo(row.seoTitle, row.seoDescription, coverImage),
  };
}

function mapTestimonial(row: typeof testimonials.$inferSelect): Testimonial {
  return {
    id: String(row.id),
    customerName: row.customerName,
    suburb: row.suburb,
    rating: row.rating,
    content: row.content,
    featured: row.featured,
    status: row.status,
    relatedProjectId: row.projectId === null ? null : String(row.projectId),
    publishedAt: row.createdAt.toISOString(),
    seo: toSeo(null, null, null),
  };
}

export function createPostgresRepository(): ContentRepository {
  return {
    async getProjects(options: ListOptions = {}) {
      const locationId = Number(options.locationId);
      const projectType =
        options.categorySlug === "residential" || options.categorySlug === "commercial"
          ? options.categorySlug
          : undefined;

      const rows = await db
        .select()
        .from(projects)
        .where(
          and(
            options.preview ? undefined : eq(projects.status, "published"),
            options.featured ? eq(projects.featured, true) : undefined,
            Number.isInteger(locationId) && locationId > 0
              ? eq(projects.locationId, locationId)
              : undefined,
            projectType ? eq(projects.projectType, projectType) : undefined,
          ),
        )
        .orderBy(desc(projects.publishedAt), desc(projects.createdAt));

      return take(rows.map(mapProject), options.limit);
    },

    async getProjectBySlug(slug, options = {}) {
      const rows = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.slug, slug),
            options.preview ? undefined : eq(projects.status, "published"),
          ),
        )
        .limit(1);
      const row = rows[0];
      if (!row) return null;

      const [imageRows, videoRows] = await Promise.all([
        db
          .select()
          .from(projectImages)
          .where(eq(projectImages.projectId, row.id))
          .orderBy(asc(projectImages.order)),
        db.select().from(projectVideos).where(eq(projectVideos.projectId, row.id)),
      ]);

      const featuredImage = toImage(row.featuredImage, row.title);
      const gallery = [
        featuredImage,
        ...imageRows.map((image) => toImage(image.url, image.alt || row.title)),
      ]
        .filter((image): image is Image => image !== null)
        .filter((image, index, images) => images.findIndex((item) => item.url === image.url) === index);

      return {
        ...mapProject(row),
        description: row.description ?? "",
        challenge: row.challenge,
        outcome: row.outcome,
        postcode: row.postcode,
        installDate: row.installDate,
        panelBrand: row.panelBrand,
        inverterBrand: row.inverterBrand,
        batteryBrand: row.batteryBrand,
        locationId: row.locationId === null ? null : String(row.locationId),
        gallery,
        videos: videoRows.map((video) => ({
          id: String(video.id),
          url: video.url,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
        })),
        customerTestimonial: row.customerTestimonial,
        customerName: row.customerName,
      };
    },

    async getServices(options: ListOptions = {}) {
      const rows = await db
        .select()
        .from(services)
        .where(options.preview ? undefined : eq(services.status, "published"))
        .orderBy(asc(services.order), asc(services.title));
      return take(rows.map(mapService), options.limit);
    },

    async getServiceBySlug(slug, options = {}) {
      const rows = await db
        .select()
        .from(services)
        .where(
          and(
            eq(services.slug, slug),
            options.preview ? undefined : eq(services.status, "published"),
          ),
        )
        .limit(1);
      const row = rows[0];
      if (!row) return null;

      return {
        ...mapService(row),
        description: row.description ?? "",
        faqs: [],
        relatedProjectIds: [],
      };
    },

    async getLocations(options: ListOptions = {}) {
      const rows = await db
        .select()
        .from(locations)
        .where(options.preview ? undefined : eq(locations.status, "published"))
        .orderBy(asc(locations.name));
      return take(rows.map(mapLocation), options.limit);
    },

    async getLocationBySlug(slug, options = {}) {
      const rows = await db
        .select()
        .from(locations)
        .where(
          and(
            eq(locations.slug, slug),
            options.preview ? undefined : eq(locations.status, "published"),
          ),
        )
        .limit(1);
      const row = rows[0];
      if (!row) return null;

      return {
        ...mapLocation(row),
        description: row.description ?? "",
        faqs: [],
      };
    },

    async getPosts(options: ListOptions = {}) {
      const rows = await db
        .select()
        .from(blogPosts)
        .where(
          and(
            options.preview ? undefined : eq(blogPosts.status, "published"),
            options.categorySlug ? eq(blogPosts.category, options.categorySlug) : undefined,
          ),
        )
        .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
      return take(rows.map(mapPost), options.limit);
    },

    async getPostBySlug(slug, options = {}) {
      const rows = await db
        .select()
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.slug, slug),
            options.preview ? undefined : eq(blogPosts.status, "published"),
          ),
        )
        .limit(1);
      const row = rows[0];
      if (!row) return null;

      return {
        ...mapPost(row),
        content: row.content ?? "",
      };
    },

    async getTestimonials(options: ListOptions = {}) {
      const rows = await db
        .select()
        .from(testimonials)
        .where(
          and(
            options.preview ? undefined : eq(testimonials.status, "published"),
            options.featured ? eq(testimonials.featured, true) : undefined,
          ),
        )
        .orderBy(desc(testimonials.featured), desc(testimonials.createdAt));
      return take(rows.map(mapTestimonial), options.limit);
    },
  };
}
