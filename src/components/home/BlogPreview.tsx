import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { Post } from "@/data/types";
import { formatDate } from "@/lib/format";

export default function BlogPreview({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="section-container py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Learn</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Solar guides &amp; insights
          </h2>
        </div>
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
          Visit the blog <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src={post.coverImage?.url || "/images/project-residential.jpg"}
                alt={post.coverImage?.alt || post.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>
            <div className="p-6">
              <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(post.publishedAt)}
                {post.category && <span className="text-brand-dark">· {post.category}</span>}
              </p>
              <h3 className="mt-2 font-display text-base font-bold leading-snug text-slate-950">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
