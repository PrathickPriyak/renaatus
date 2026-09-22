import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogShare } from "@/components/blog/BlogShare";
import { JournalBody } from "@/components/blog/JournalBody";
import { Breadcrumb } from "@/design-system/components/breadcrumb";
import { Container } from "@/design-system/components/container";
import { CtaBand } from "@/design-system/components/cta-band";
import { Eyebrow } from "@/design-system/components/eyebrow";
import { Heading } from "@/design-system/components/heading";
import { Rule } from "@/design-system/components/rule";
import { formatBlogDate, getPublishedBlog, listRelatedPublishedBlogs } from "@/lib/blog/public";
import { getDb } from "@/lib/db";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlog(getDb(), slug);
  if (!post) {
    return { title: "Journal" };
  }

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: post.canonicalUrl },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: "article",
      url: post.canonicalUrl,
      images: post.ogImage
        ? [{ url: post.ogImage.src, alt: post.ogImage.alt || post.title }]
        : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const db = getDb();
  const post = await getPublishedBlog(db, slug);
  if (!post) {
    notFound();
  }

  const related = await listRelatedPublishedBlogs(db, post.slug, 3);
  const dateLabel = post.publishedAt ? formatBlogDate(post.publishedAt) : null;

  return (
    <>
      <article>
        <section className="grain relative isolate min-h-[min(36rem,72dvh)] overflow-hidden">
          {post.image ? (
            <Image
              src={post.image.src}
              alt={post.image.alt || post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : null}
          <div className="from-ink via-ink/70 to-ink/35 absolute inset-0 bg-gradient-to-t" />
          <Container className="relative flex min-h-[min(36rem,72dvh)] flex-col justify-end pt-[calc(var(--header-height)+2rem)] pb-16">
            <Breadcrumb
              className="mb-8"
              items={[
                { href: "/", label: "Home" },
                { href: "/blog", label: "Journal" },
                { href: post.href, label: post.title },
              ]}
            />
            <Eyebrow>{post.category?.name ?? "Journal"}</Eyebrow>
            <Heading variant="h1" className="mt-4 max-w-4xl">
              {post.title}
            </Heading>
            <Rule className="mt-6" />
            <p className="text-cream-muted mt-6 text-sm">
              {post.authorName}
              {dateLabel ? ` · ${dateLabel}` : ""}
            </p>
          </Container>
        </section>

        <Container className="grid gap-10 py-[var(--section-y)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.7fr)]">
          <div>
            <JournalBody doc={post.body} />
            {post.tags.length > 0 ? (
              <ul className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag.slug}
                    className="border-line text-caption text-cream-muted rounded-sm border px-3 py-1 tracking-[0.12em] uppercase"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-10">
              <BlogShare title={post.title} url={post.canonicalUrl} />
            </div>
          </div>
          <aside className="border-line bg-panel/40 h-fit rounded-sm border p-6">
            <p className="text-eyebrow text-brass tracking-[0.24em] uppercase">From the journal</p>
            <p className="font-display text-cream mt-3 text-xl">{post.excerpt}</p>
            {post.updatedAt ? (
              <p className="text-caption text-cream-muted mt-4">
                Updated {formatBlogDate(post.updatedAt)}
              </p>
            ) : null}
          </aside>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="border-line border-t py-[var(--section-y)]">
          <Container>
            <h2 className="font-display text-h2 text-cream">Related notes</h2>
            <div className="mt-10 grid gap-12 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand
        eyebrow="Enquire"
        title="Start a conversation."
        copy="Reach the team that delivers infrastructure, residences, and materials across India, the Maldives, and Mauritius."
      />
    </>
  );
}
