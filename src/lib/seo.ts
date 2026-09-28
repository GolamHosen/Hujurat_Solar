import type { Metadata } from "next";
import { siteConfig } from "./site";

export function absoluteUrl(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean}`;
}

export function buildMetadata(params: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const { title, description, path, image, noIndex } = params;
  const url = absoluteUrl(path);
  const ogImage = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : absoluteUrl(siteConfig.ogImage);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    sameAs: siteConfig.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "customer service",
        areaServed: "AU",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phoneMobile,
        contactType: "sales",
        areaServed: "AU",
        availableLanguage: ["English"],
      },
    ],
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    image: absoluteUrl(siteConfig.ogImage),
    logo: absoluteUrl(siteConfig.logo),
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    currenciesAccepted: "AUD",
    foundingDate: siteConfig.founded,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.addressLocality,
      addressRegion: siteConfig.addressRegion,
      postalCode: siteConfig.postalCode,
      addressCountry: siteConfig.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.latitude,
      longitude: siteConfig.longitude,
    },
    openingHoursSpecification: siteConfig.openingHours.map((oh) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: oh.days,
      opens: oh.opens,
      closes: oh.closes,
    })),
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "City", name })),
    sameAs: siteConfig.sameAs,
  };
}

/**
 * Minimal LocalBusiness node carrying only aggregateRating. Shares the
 * `#business` @id with localBusinessSchema so search engines merge the rating
 * into the same entity. Emit on pages that render real customer reviews.
 */
export function aggregateRatingSchema(params: { ratingValue: number; reviewCount: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${siteConfig.url}/#business`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(params.ratingValue.toFixed(1)),
      reviewCount: params.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(params: {
  name: string;
  description: string;
  path: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: params.name,
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    image: params.image ? absoluteUrl(params.image) : undefined,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: siteConfig.areaServed.map((name) => ({ "@type": "City", name })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(params: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    image: params.image ? [absoluteUrl(params.image)] : undefined,
    datePublished: params.datePublished || undefined,
    dateModified: params.dateModified || params.datePublished || undefined,
    author: { "@type": "Organization", name: params.authorName || siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    mainEntityOfPage: absoluteUrl(params.path),
  };
}

export function projectSchema(params: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  suburb: string;
  datePublished?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: params.title,
    description: params.description,
    url: absoluteUrl(params.path),
    image: params.image ? absoluteUrl(params.image) : undefined,
    datePublished: params.datePublished || undefined,
    locationCreated: {
      "@type": "Place",
      name: params.suburb,
    },
    creator: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function reviewSchema(items: { author: string; rating: number; content: string; date?: string | null }[]) {
  return items.map((item) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: item.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: item.rating,
      bestRating: 5,
    },
    reviewBody: item.content,
    datePublished: item.date || undefined,
    itemReviewed: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  }));
}
