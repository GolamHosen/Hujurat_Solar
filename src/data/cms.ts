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
/*  Public CMS accessors                                                       */
/* -------------------------------------------------------------------------- */

export async function getProjects(options?: ListOptions) {
  return safeFetch("getProjects", async () => {
    return (await contentRepository()).getProjects(options);
  }, []);
}

export async function getProjectBySlug(slug: string, options?: BySlugOptions) {
  return safeFetch("getProjectBySlug", async () => {
    return (await contentRepository()).getProjectBySlug(slug, options);
  }, null);
}

export async function getServices(options?: ListOptions) {
  return safeFetch("getServices", async () => {
    return (await contentRepository()).getServices(options);
  }, []);
}

export async function getServiceBySlug(slug: string, options?: BySlugOptions) {
  return safeFetch("getServiceBySlug", async () => {
    return (await contentRepository()).getServiceBySlug(slug, options);
  }, null);
}

export async function getLocations(options?: ListOptions) {
  return safeFetch("getLocations", async () => {
    return (await contentRepository()).getLocations(options);
  }, []);
}

export async function getLocationBySlug(slug: string, options?: BySlugOptions) {
  return safeFetch("getLocationBySlug", async () => {
    return (await contentRepository()).getLocationBySlug(slug, options);
  }, null);
}

export async function getPosts(options?: ListOptions) {
  return safeFetch("getPosts", async () => {
    return (await contentRepository()).getPosts(options);
  }, []);
}

export async function getPostBySlug(slug: string, options?: BySlugOptions) {
  return safeFetch("getPostBySlug", async () => {
    return (await contentRepository()).getPostBySlug(slug, options);
  }, null);
}

export async function getTestimonials(options?: ListOptions) {
  return safeFetch("getTestimonials", async () => {
    return (await contentRepository()).getTestimonials(options);
  }, []);
}
