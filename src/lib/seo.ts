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
    "@type": ["SolarEnergyContractor", "Electrician", "RoofingContractor"],
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    legalName: siteConfig.name,
    image: absoluteUrl(siteConfig.ogImage),
    logo: absoluteUrl(siteConfig.logo),
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    currenciesAccepted: "AUD",
    paymentAccepted: ["Cash", "Credit Card", "Direct Debit", "Solar Financing"],
    foundingDate: siteConfig.founded,
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Accreditation",
        name: "Clean Energy Council (CEC) Accredited Retailer & Installer",
        recognizedBy: {
          "@type": "Organization",
          name: "Clean Energy Council Australia",
          url: "https://www.cleanenergycouncil.org.au",
        },
      },
    ],
    knowsAbout: [
      "Residential Solar Panel Installation Sydney",
      "Commercial Solar Power Systems NSW",
      "Solar Battery Storage (Sungrow, Tesla, BYD, Enphase)",
      "Solar Inverter Fault Diagnosis and Repairs (Fronius, GoodWe, Sungrow)",
      "NSW Peak Demand Reduction Scheme (PDRS) Battery Rebates",
      "Federal Small-scale Technology Certificates (STC) Solar Rebate Australia",
      "Clean Energy Council Approved Solar Equipment",
      "Solar Panel Maintenance, Cleaning & Health Checks",
      "Ausgrid and Endeavour Energy Grid Connections",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.streetAddress,
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
    areaServed: [
      { "@type": "State", name: "New South Wales" },
      { "@type": "AdministrativeArea", name: "Greater Sydney" },
      { "@type": "AdministrativeArea", name: "Western Sydney" },
      ...siteConfig.areaServed.map((name) => ({ "@type": "City", name })),
    ],
    sameAs: siteConfig.sameAs,
  };
}

/**
 * Minimal LocalBusiness node carrying only aggregateRating. Shares the
 * `#business` @id with localBusinessSchema so search engines merge the rating
 * into the same entity. Emit on pages that render real customer reviews.
 */
export function aggregateRatingSchema(params?: { ratingValue?: number; reviewCount?: number }) {
  const ratingValue =
    typeof params?.ratingValue === "number" && Number.isFinite(params.ratingValue)
      ? Number(params.ratingValue.toFixed(1))
      : 5.0;
  const reviewCount =
    typeof params?.reviewCount === "number" && Number.isInteger(params.reviewCount) && params.reviewCount > 0
      ? params.reviewCount
      : 1;

  return {
    "@context": "https://schema.org",
    "@type": ["SolarEnergyContractor", "RoofingContractor"],
    "@id": `${siteConfig.url}/#business`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/**
 * Localized schema for specific Sydney suburbs and regions (e.g. Parramatta, Penrith, Blacktown).
 * Boosts rankings in Google Local 3-Pack and regional search results.
 */
export function locationLocalBusinessSchema(params: {
  locationName: string;
  region?: string | null;
  state?: string;
  path: string;
  description?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["SolarEnergyContractor", "Electrician"],
    "@id": `${siteConfig.url}${params.path}#local-service`,
    name: `${siteConfig.name} - ${params.locationName}`,
    url: absoluteUrl(params.path),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    description: params.description || `Professional CEC-accredited solar panel and battery installation services in ${params.locationName}, NSW.`,
    areaServed: {
      "@type": "City",
      name: params.locationName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: params.region || "Greater Sydney",
      },
    },
    parentOrganization: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#business`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Clean Energy Council (CEC) Accredited Installer",
      },
    ],
    priceRange: siteConfig.priceRange,
    currenciesAccepted: "AUD",
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
      "@type": "SolarEnergyContractor",
      "@id": `${siteConfig.url}/#business`,
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.phone,
    },
    areaServed: [
      { "@type": "State", name: "New South Wales" },
      { "@type": "AdministrativeArea", name: "Greater Sydney" },
      ...siteConfig.areaServed.map((name) => ({ "@type": "City", name })),
    ],
  };
}

export function faqSchema(items?: { question: string; answer: string }[]) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || "",
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
