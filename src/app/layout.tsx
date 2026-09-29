import type { Metadata, Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";
import NavigationProgress from "@/components/common/NavigationProgress";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display", display: "swap" });

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Solar Panels, Batteries & Installation Sydney`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  category: "Renewable Energy & Solar Installation Contractor",
  classification: "Solar Energy Equipment Supplier & Installation Contractor",
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "en-AU": siteConfig.url,
    },
  },
  keywords: [
    "solar company sydney",
    "solar installers sydney",
    "solar installation western sydney",
    "solar panels sydney",
    "solar battery installation sydney",
    "commercial solar sydney",
    "residential solar sydney",
    "solar power parramatta",
    "solar installer blacktown",
    "solar installer penrith",
    "solar installer mount druitt",
    "cec accredited solar installer",
    "solar inverter repairs sydney",
    "solar inverter fault red light troubleshooting",
    "solar battery rebate nsw 2025",
    "pdrs battery rebate nsw",
    "federal solar rebate stc australia",
    "solar panel cleaning and maintenance sydney",
    "solar system sizing guide australia",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "default",
  },
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Solar Panels, Batteries & Installation Sydney`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1792, height: 1024, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Solar Panels, Batteries & Installation Sydney`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
  other: {
    "geo.region": "AU-NSW",
    "geo.placename": "Mount Druitt, Western Sydney, Sydney, NSW, Australia",
    "geo.position": `${siteConfig.latitude};${siteConfig.longitude}`,
    "ICBM": `${siteConfig.latitude}, ${siteConfig.longitude}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <JsonLd data={[organizationSchema(), localBusinessSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
