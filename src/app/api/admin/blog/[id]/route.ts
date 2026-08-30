import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validation";

export async function GET(_request: Request, { params }: RouteContext<"/api/admin/blog/[id]">) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/blog/[id]">) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = blogPostSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const data = parsed.data;
  const willBePublished = data.published ?? existing.published;

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        featuredImage: data.featuredImage === "" ? null : data.featuredImage,
        seoTitle: data.seoTitle === "" ? null : data.seoTitle,
        metaDescription: data.metaDescription === "" ? null : data.metaDescription,
        publishedAt: willBePublished && !existing.publishedAt ? new Date() : undefined,
      },
    });
    return NextResponse.json(post);
  } catch (err) {
    console.error("Failed to update blog post", err);
    return NextResponse.json({ error: "Could not update post." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/blog/[id]">) {
  const { id } = await params;
  try {
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete blog post", err);
    return NextResponse.json({ error: "Could not delete post." }, { status: 404 });
  }
}
