import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, ArticleCover, headingsOf } from "@/components/site/ArticleBody";
import { ArticleCard, CtaBand } from "@/components/site/sections";
import { Arrow, Container, GoldButton } from "@/components/site/ui";
import { ARTICLES, getArticle } from "@/lib/content/articles";
import { prisma } from "@/lib/prisma";
import { JsonLdScript, breadcrumbJsonLd, pageMetadata, siteUrl } from "@/lib/seo";

export const revalidate = 600;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

async function getDbPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    return post?.published ? post : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (article) {
    return pageMetadata({
      title: article.seoTitle,
      description: article.description,
      path: `/blog/${slug}`,
      keywords: article.keywords,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
    });
  }
  const post = await getDbPost(slug);
  if (!post) return {};
  return {
    ...pageMetadata({
      title: post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt,
      path: `/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    }),
    ...(post.featuredImage ? { openGraph: { images: [post.featuredImage] } } : {}),
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  const post = article ? null : await getDbPost(slug);
  if (!article && !post) notFound();

  const title = article?.title ?? post!.title;
  const category = article?.category ?? post!.category;
  const description = article?.description ?? post!.excerpt;
  const published = article?.publishedAt ?? post!.publishedAt?.toISOString() ?? post!.createdAt.toISOString();
  const modified = article?.publishedAt ?? post!.updatedAt.toISOString();
  const headings = article ? headingsOf(article.body) : [];
  const related = ARTICLES.filter((a) => a.slug !== slug).sort((a, b) => Number(b.category === category) - Number(a.category === category)).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: published,
    dateModified: modified,
    author: { "@type": "Organization", name: "MISR VISA Editorial Team", url: siteUrl },
    publisher: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
    image: `${siteUrl}/opengraph-image`,
    articleSection: category,
    keywords: article?.keywords.join(", "),
    inLanguage: "en",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([articleJsonLd, breadcrumbJsonLd([{ name: "Egypt Stories", path: "/blog" }, { name: title, path: `/blog/${slug}` }])])} />
      <article>
        <header className="relative pb-12 pt-36 sm:pt-44">
          <Container className="max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-ivory/45">
              <Link href="/" className="hover:text-gold">Home</Link> <span className="px-2">/</span>
              <Link href="/blog" className="hover:text-gold">Egypt Stories</Link> <span className="px-2">/</span>
              <span className="text-gold">{category}</span>
            </nav>
            <h1 className="mt-6 text-balance text-4xl font-medium leading-[1.1] text-ivory sm:text-6xl">{title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-ivory/65">{description}</p>
            <p className="mt-6 text-sm text-ivory/45">
              MISR VISA Editorial Team · <time dateTime={published}>{new Date(published).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
              {article && <> · {article.readMinutes} min read</>}
            </p>
          </Container>
        </header>

        <Container className="max-w-5xl">
          {article ? (
            <ArticleCover motif={article.motif} category={category} className="aspect-[21/9] rounded-[32px]" />
          ) : post!.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post!.featuredImage} alt={title} className="aspect-[21/9] w-full rounded-[32px] object-cover" />
          ) : null}
        </Container>

        <Container className="grid max-w-6xl gap-12 py-16 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            {headings.length > 0 && (
              <nav aria-label="On this page" className="sticky top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">On this page</p>
                <ul className="mt-4 space-y-3 border-l border-ivory/10 text-sm">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-ivory/55 hover:border-gold hover:text-ivory">{h.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
          <div className="max-w-3xl">
            {article ? (
              <ArticleBody body={article.body} />
            ) : (
              // Admin-authored HTML from the protected dashboard (never public input).
              <div className="article-body" dangerouslySetInnerHTML={{ __html: post!.content }} />
            )}
            <div className="gold-frame mt-14 rounded-[26px] bg-white/[0.03] p-8">
              <p className="font-display text-2xl text-ivory">Travelling to Egypt?</p>
              <p className="mt-2 text-ivory/60">OK-to-Board in 24–48 hours with EgyptAir or Ethiopian Airlines, then the USD 36 QR visa at Cairo Airport.</p>
              <div className="mt-6">
                <GoldButton href="/apply">Start my application <Arrow /></GoldButton>
              </div>
            </div>
          </div>
        </Container>
      </article>

      <section className="py-16">
        <Container>
          <h2 className="text-3xl text-ivory">Keep reading</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((a) => <ArticleCard key={a.slug} article={a} />)}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
