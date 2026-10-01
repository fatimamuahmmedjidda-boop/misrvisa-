import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BlogList from "@/components/admin/BlogList";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-emerald-dark">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-emerald px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark"
        >
          New Post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <BlogList
          posts={posts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category,
            published: p.published,
            createdAt: p.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
