import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/authz";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = blogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid post data." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A post with this slug already exists." }, { status: 409 });
  }

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage || null,
      category: data.category,
      author: data.author || "MISR VISA Team",
      seoTitle: data.seoTitle || null,
      metaDescription: data.metaDescription || null,
      published: data.published ?? false,
      publishedAt: data.published ? new Date() : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
