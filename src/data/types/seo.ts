import type { Image } from "./common";

export type Seo = {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  openGraphImage: Image | null;
};

export const EMPTY_SEO: Seo = {
  title: null,
  description: null,
  canonicalUrl: null,
  robots: null,
  openGraphImage: null,
};
