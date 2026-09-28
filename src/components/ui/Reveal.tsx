"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The single animated leaf in this codebase.
 *
 * Why it exists: `"use client"` on a whole section (ServicesGrid, FeaturedProjects, …)
 * makes every card in that section client-rendered. Wrapping only the animated element
 * keeps the section a Server Component and removes hydration work for everything else.
 *
 * Reduced-motion handling:
 * Framer Motion natively disables transform animations when reduced motion is preferred.
 * In addition, CSS `@media (prefers-reduced-motion: reduce)` in `globals.css` targets `[data-reveal]`
 * to ensure immediate full opacity and static positioning with zero delay or initial hidden state.
 *
 * Calling `useReducedMotion()` to conditionally branch JSX during initial render causes hydration
 * mismatches in SSR environments (Next.js / React 19) because the server cannot detect client
 * media queries and renders the element with `opacity: 0; transform: translateY(...)`, whereas
 * client hydration would omit those styles if reduced motion is enabled.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const MotionTag = as === "li" ? motion.li : as === "article" ? motion.article : motion.div;

  return (
    <MotionTag
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
