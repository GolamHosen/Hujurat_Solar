export const siteConfig = {
  name: "Hujurat Solar Supply & Install",
  shortName: "Hujurat Solar",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://hujuratsolar.com",
  description:
    "Hujurat Solar Supply & Install designs and installs premium residential and commercial solar, battery storage and monitoring systems across Sydney and Western Sydney.",
  phone: "+61 2 7258 0676",
  phoneDisplay: "(02) 7258 0676",
  phoneMobile: "+61 468 209 407",
  phoneMobileDisplay: "0468 209 407",
  email: "services@hujurat.com.au",
  address: "28 O’Brien Street, Mount Druitt, NSW 2770",
  streetAddress: "28 O’Brien Street",
  addressLocality: "Mount Druitt",
  addressRegion: "NSW",
  postalCode: "2770",
  addressCountry: "AU",
  areaServed: ["Sydney", "Western Sydney", "Mount Druitt", "Parramatta", "Blacktown", "Penrith", "Liverpool", "Camden"],
  sameAs: [
    "https://www.facebook.com/hujuratsolar",
    "https://www.instagram.com/hujuratsolar",
    "https://www.linkedin.com/company/hujuratsolar",
  ],
  latitude: -33.7688,
  longitude: 150.8188,
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
