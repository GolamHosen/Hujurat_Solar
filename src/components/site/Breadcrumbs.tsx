import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const trail = [{ name: "Home", path: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="section-container flex flex-wrap items-center gap-1.5 pt-6 text-xs text-slate-500">
      <JsonLd data={breadcrumbSchema(trail)} />
      {trail.map((item, index) => (
        <span key={item.path} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
          {index === trail.length - 1 ? (
            <span className="font-medium text-slate-700">{item.name}</span>
          ) : (
            <Link href={item.path} className="hover:text-brand-dark">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
