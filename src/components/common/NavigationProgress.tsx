"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * High-performance instant navigation progress indicator.
 * Provides immediate (<0ms) visual feedback when clicking any link
 * across the site or dashboard.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress bar when route finishes changing
  useEffect(() => {
    setActive(false);
    setProgress(100);
    const timer = setTimeout(() => {
      setProgress(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept click on internal links for instant visual feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      if (
        !href ||
        target === "_blank" ||
        href.startsWith("#") ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Only trigger if navigation goes to another URL
      const currentPath = window.location.pathname + window.location.search;
      if (href.startsWith("/") && href !== currentPath) {
        setActive(true);
        setProgress(25);
        setTimeout(() => setProgress(70), 100);
        setTimeout(() => setProgress(88), 300);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!active && progress === 0) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 right-0 z-[99999] h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#FFB71B] via-amber-400 to-[#FFD56B] shadow-[0_0_12px_rgba(255,183,27,0.85)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: active ? 1 : 0,
          transitionProperty: "width, opacity",
        }}
      />
    </div>
  );
}
