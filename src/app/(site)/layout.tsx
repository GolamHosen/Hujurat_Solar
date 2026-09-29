import type { ReactNode } from "react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

/** Revalidate all public pages every 60 seconds (ISR).
 *  Content changes from the dashboard are reflected within a minute,
 *  but pages are served instantly from edge cache in the meantime. */
export const revalidate = 60;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
