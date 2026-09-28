import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import JsonLd from "@/components/site/JsonLd";
import { getPostBySlug, getPosts } from "@/data/cms";
import { buildMetadata, articleSchema } from "@/lib/seo";
import { formatLongDate } from "@/lib/format";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo.title || `${post.title} | Hujurat Solar Blog`,
    description: post.seo.description || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage?.url,
    noIndex: post.seo.robots?.includes("noindex"),
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = (await getPosts({ limit: 4 })).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div>
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.seo.description || post.excerpt,
          path: `/blog/${post.slug}`,
          image: post.coverImage?.url,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          authorName: post.authorName,
        })}
      />

      <article className="section-container max-w-3xl py-14">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          {post.category}
          <span className="text-slate-300">•</span>
          <CalendarDays className="h-3.5 w-3.5" />
          {formatLongDate(post.publishedAt)}
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg text-slate-600">{post.excerpt}</p>

        {post.coverImage && (
          <div className="relative mt-8 h-72 w-full overflow-hidden rounded-2xl sm:h-96">
            <Image src={post.coverImage.url} alt={post.coverImage.alt || post.title} fill preload className="object-cover" sizes="(min-width:1024px) 768px, 100vw" />
          </div>
        )}

        <div className="prose-hujurat mt-10 max-w-none">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">Written by {post.authorName}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark">
            Get a free quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      {otherPosts.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-14">
          <div className="section-container">
            <h2 className="font-display text-2xl font-bold text-slate-950">More guides</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {otherPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
                  <p className="text-xs font-semibold text-brand-dark">{p.category}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
