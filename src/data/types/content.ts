import type {
  CategoryRef,
  ContentStatus,
  Faq,
  Image,
  ServiceIconName,
  VideoRef,
} from "./common";
import type { Seo } from "./seo";

/**
 * UI-facing content models mapped from PostgreSQL rows.
 * IDs and dates are serialised as strings so components stay transport-safe.
 */

export type ProjectType = "residential" | "commercial";

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  featuredImage: Image | null;
  suburb: string;
  state: string;
  projectType: ProjectType;
  systemSizeKw: number | null;
  batterySizeKwh: number | null;
  featured: boolean;
  locationId: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  updatedAt: string;
  categories: CategoryRef[];
  seo: Seo;
};

export type ProjectDetail = Project & {
  description: string;
  challenge: string | null;
  outcome: string | null;
  postcode: string | null;
  installDate: string | null;
  panelBrand: string | null;
  inverterBrand: string | null;
  batteryBrand: string | null;
  gallery: Image[];
  videos: VideoRef[];
  customerTestimonial: string | null;
  customerName: string | null;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  icon: ServiceIconName;
  heroImage: Image | null;
  order: number;
  status: ContentStatus;
  updatedAt: string;
  seo: Seo;
};

export type ServiceDetail = Service & {
  description: string;
  faqs: Faq[];
  relatedProjectIds: string[];
};

export type Location = {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  state: string;
  blurb: string;
  heroImage: Image | null;
  status: ContentStatus;
  updatedAt: string;
  seo: Seo;
};

export type LocationDetail = Location & {
  description: string;
  faqs: Faq[];
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: Image | null;
  category: string | null;
  tags: string[];
  authorName: string;
  status: ContentStatus;
  publishedAt: string | null;
  updatedAt: string;
  seo: Seo;
};

export type PostDetail = Post & {
  /** Markdown or sanitised HTML. Render through a single RichText component. */
  content: string;
};

export type Testimonial = {
  id: string;
  customerName: string;
  suburb: string | null;
  rating: number;
  content: string;
  featured: boolean;
  status: ContentStatus;
  relatedProjectId: string | null;
  publishedAt: string | null;
  seo: Seo;
};
