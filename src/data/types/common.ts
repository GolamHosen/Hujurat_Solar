/** Shared UI primitives kept independent from database row types. */

export type ContentStatus = "published" | "draft";

/**
 * A CMS image, flattened for the UI.
 * `alt` is required (possibly empty) so accessibility is a deliberate decision,
 * never an accidental `undefined`.
 */
export type Image = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  blurDataUrl?: string | null;
};

export type Pagination = {
  page: number;
  perPage: number;
  total: number;
  hasNextPage: boolean;
};

export type Paginated<T> = {
  nodes: T[];
  pagination: Pagination;
};

export type CategoryRef = {
  slug: string;
  name: string;
};

export type VideoRef = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
};

export type Faq = {
  question: string;
  answer: string;
};

/** Icon keywords the backend may store on a service; mapped to Lucide icons in the UI. */
export type ServiceIconName =
  | "sun"
  | "battery"
  | "wrench"
  | "gauge"
  | "shield"
  | "snowflake"
  | "panel"
  | "monitor";
