export const siteConfig = {
  name: "Hujurat Solar Supply & Install",
  shortName: "Hujurat Solar",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.hujuratsolar.com.au",
  description:
    "Hujurat Solar Supply & Install designs and installs premium residential and commercial solar, battery storage and monitoring systems across Sydney and Western Sydney.",
  phone: "+61 2 8000 1234",
  phoneDisplay: "(02) 8000 1234",
  email: "info@hujuratsolar.com.au",
  addressLocality: "Parramatta",
  addressRegion: "NSW",
  postalCode: "2150",
  addressCountry: "AU",
  areaServed: ["Sydney", "Western Sydney", "Parramatta", "Blacktown", "Penrith", "Liverpool", "Camden"],
  sameAs: [
    "https://www.facebook.com/hujuratsolar",
    "https://www.instagram.com/hujuratsolar",
    "https://www.linkedin.com/company/hujuratsolar",
  ],
  latitude: -33.8151,
  longitude: 151.0011,
  founded: "2021",
  priceRange: "$$",
  ogImage: "/images/og-default.png",
  logo: "/logo.png",
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
    { days: ["Saturday"], opens: "09:00", closes: "14:00" },
  ],
};

export type SiteConfig = typeof siteConfig;
