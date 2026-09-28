import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/seo";
import JsonLd from "@/components/site/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display", display: "swap" });

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
const bingVerification = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Solar Panels, Batteries & Installation`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  keywords: [
    "solar company sydney",
    "solar installers sydney",
    "solar installation western sydney",
    "solar panels sydney",
    "solar battery installation",
    "commercial solar sydney",
    "residential solar sydney",
    "solar power parramatta",
    "cec accredited solar installer",
  ],
  authors: [{ name: siteConfig.name }],
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
    title: `${siteConfig.name} | Solar Panels, Batteries & Installation`,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1792, height: 1024, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Solar Panels, Batteries & Installation`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
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
        <JsonLd data={[organizationSchema(), localBusinessSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
