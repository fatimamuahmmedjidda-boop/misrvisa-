import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";

export default async function EditBlogPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Edit Blog Post</h1>
      <div className="mt-6 max-w-3xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <BlogForm
          postId={post.id}
          initialValues={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            featuredImage: post.featuredImage ?? "",
            category: post.category,
            author: post.author,
            seoTitle: post.seoTitle ?? "",
            metaDescription: post.metaDescription ?? "",
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
