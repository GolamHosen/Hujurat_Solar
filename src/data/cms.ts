import { unstable_cache } from "next/cache";
import { contentRepository } from "@/data/repositories";
import type { BySlugOptions, ListOptions } from "@/data/repositories";
import { isDatabaseConfigured } from "@/db";

export type { ListOptions, BySlugOptions };

/* -------------------------------------------------------------------------- */
/*  Resilient fetch helper                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Wraps a repository call so the page still renders when the database is
 * unavailable (wrong credentials, network errors, missing tables, etc.).
 *
 * - Array-returning queries fall back to `[]`.
 * - Single-item queries fall back to `null`.
 * - A warning is logged server-side so the issue is visible without crashing
 *   the user-facing page.
 */
async function safeFetch<T>(
  queryName: string,
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!isDatabaseConfigured()) {
    console.warn(
      `[cms] Skipping ${queryName}: DATABASE_URL is not configured.`,
    );
    return fallback;
  }

  try {
    return await fn();
  } catch (error) {
    console.error(`[cms] ${queryName} failed — returning fallback data.`, error);
    return fallback;
  }
}

/* -------------------------------------------------------------------------- */
/*  Cached Data Loaders (High Performance with ISR and Tags)                  */
/* -------------------------------------------------------------------------- */

const fetchCachedProjects = unstable_cache(
  async (_key: string, options?: ListOptions) => {
    return (await contentRepository()).getProjects(options);
  },
  ["cms-projects-list"],
  { tags: ["projects", "cms"], revalidate: 120 },
);

const fetchCachedProjectBySlug = unstable_cache(
  async (slug: string, _key: string, options?: BySlugOptions) => {
    return (await contentRepository()).getProjectBySlug(slug, options);
  },
  ["cms-project-detail"],
  { tags: ["projects", "cms"], revalidate: 120 },
);

const fetchCachedServices = unstable_cache(
  async (_key: string, options?: ListOptions) => {
    return (await contentRepository()).getServices(options);
  },
  ["cms-services-list"],
  { tags: ["services", "cms"], revalidate: 120 },
);

const fetchCachedServiceBySlug = unstable_cache(
  async (slug: string, _key: string, options?: BySlugOptions) => {
    return (await contentRepository()).getServiceBySlug(slug, options);
  },
  ["cms-service-detail"],
  { tags: ["services", "cms"], revalidate: 120 },
);

const fetchCachedLocations = unstable_cache(
  async (_key: string, options?: ListOptions) => {
    return (await contentRepository()).getLocations(options);
  },
  ["cms-locations-list"],
  { tags: ["locations", "cms"], revalidate: 120 },
);

const fetchCachedLocationBySlug = unstable_cache(
  async (slug: string, _key: string, options?: BySlugOptions) => {
    return (await contentRepository()).getLocationBySlug(slug, options);
  },
  ["cms-location-detail"],
  { tags: ["locations", "cms"], revalidate: 120 },
);

const fetchCachedPosts = unstable_cache(
  async (_key: string, options?: ListOptions) => {
    return (await contentRepository()).getPosts(options);
  },
  ["cms-posts-list"],
  { tags: ["posts", "cms"], revalidate: 120 },
);

const fetchCachedPostBySlug = unstable_cache(
  async (slug: string, _key: string, options?: BySlugOptions) => {
    return (await contentRepository()).getPostBySlug(slug, options);
  },
  ["cms-post-detail"],
  { tags: ["posts", "cms"], revalidate: 120 },
);

const fetchCachedTestimonials = unstable_cache(
  async (_key: string, options?: ListOptions) => {
    return (await contentRepository()).getTestimonials(options);
  },
  ["cms-testimonials-list"],
  { tags: ["testimonials", "cms"], revalidate: 120 },
);

/* -------------------------------------------------------------------------- */
/*  Public CMS accessors                                                       */
/* -------------------------------------------------------------------------- */

export async function getProjects(options?: ListOptions) {
  return safeFetch("getProjects", async () => {
    return fetchCachedProjects(JSON.stringify(options ?? {}), options);
  }, []);
}

export async function getProjectBySlug(slug: string, options?: BySlugOptions) {
  return safeFetch("getProjectBySlug", async () => {
    return fetchCachedProjectBySlug(slug, JSON.stringify(options ?? {}), options);
  }, null);
}

export async function getServices(options?: ListOptions) {
  return safeFetch("getServices", async () => {
    return fetchCachedServices(JSON.stringify(options ?? {}), options);
  }, []);
}

export async function getServiceBySlug(slug: string, options?: BySlugOptions) {
  return safeFetch("getServiceBySlug", async () => {
    return fetchCachedServiceBySlug(slug, JSON.stringify(options ?? {}), options);
  }, null);
}

export async function getLocations(options?: ListOptions) {
  return safeFetch("getLocations", async () => {
    return fetchCachedLocations(JSON.stringify(options ?? {}), options);
  }, []);
}

export async function getLocationBySlug(slug: string, options?: BySlugOptions) {
  return safeFetch("getLocationBySlug", async () => {
    return fetchCachedLocationBySlug(slug, JSON.stringify(options ?? {}), options);
  }, null);
}

export async function getPosts(options?: ListOptions) {
  return safeFetch("getPosts", async () => {
    return fetchCachedPosts(JSON.stringify(options ?? {}), options);
  }, []);
}

export async function getPostBySlug(slug: string, options?: BySlugOptions) {
  return safeFetch("getPostBySlug", async () => {
    return fetchCachedPostBySlug(slug, JSON.stringify(options ?? {}), options);
  }, null);
}

export async function getTestimonials(options?: ListOptions) {
  return safeFetch("getTestimonials", async () => {
    return fetchCachedTestimonials(JSON.stringify(options ?? {}), options);
  }, []);
}
