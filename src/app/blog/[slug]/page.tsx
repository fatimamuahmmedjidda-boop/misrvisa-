import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CTASection from "@/components/CTASection";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  return (
    <article className="py-16">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Link href="/blog" className="text-xs font-semibold uppercase tracking-wide text-emerald">
          &larr; All Articles
        </Link>
        <span className="mt-6 block text-xs font-semibold uppercase tracking-wide text-gold-dark">
          {post.category}
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-emerald-dark sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm text-ink/50">
          {post.author} &middot;{" "}
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
        </p>

        {post.featuredImage && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div
          className="prose prose-emerald mt-10 max-w-none prose-headings:font-display prose-headings:text-emerald-dark prose-a:text-emerald"
          // Content is authored exclusively by MISR VISA admins through the
          // protected admin dashboard — never from public-facing input.
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <div className="mt-16">
        <CTASection />
      </div>
    </article>
  );
}
