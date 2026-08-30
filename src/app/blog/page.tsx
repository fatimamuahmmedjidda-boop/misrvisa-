import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Visa News & Travel Tips",
  description: "Egypt visa updates, travel tips, airport information, and guidance from MISR VISA.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="bg-emerald py-16">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Visa News
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            Travel Tips &amp; Visa Updates
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
            Practical guidance for traveling to Egypt, kept current by the MISR VISA team.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-lg text-center">
              <SectionHeading title="New articles coming soon" description="We're preparing helpful guides on Visa-on-Arrival, Cairo travel, and more. Check back soon." />
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
                    {post.category}
                  </span>
                  <h2 className="mt-3 font-display text-lg font-semibold text-emerald-dark group-hover:text-emerald">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-ink/40">
                    {post.author} &middot;{" "}
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
