import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { getPosts } from "@/data/cms";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";

export const metadata = buildMetadata({
  title: "Solar Blog & Guides | Hujurat Solar Supply & Install",
  description:
    "Educational guides on solar costs, system sizing, batteries and maintenance for Australian homeowners and businesses, written by the Hujurat Solar team.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
      <section className="section-container py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-dark">Solar guides</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">
            Learn about solar in Australia
          </h1>
          <p className="mt-5 text-slate-600">
            Practical, honest guides on solar costs, system sizing, batteries and maintenance — written by our
            own installation team.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} prefetch={true} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg">
              <div className="relative h-44 w-full overflow-hidden">
                <Image src={post.coverImage?.url || "/images/project-residential.jpg"} alt={post.coverImage?.alt || post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width:1024px) 33vw, 100vw" />
              </div>
              <div className="p-6">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(post.publishedAt)}
                  {post.category && <span className="text-brand-dark">· {post.category}</span>}
                </p>
                <h2 className="mt-2 font-display text-base font-bold leading-snug text-slate-950">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
