import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { PageIntro } from "@/components/marketing";
import { Container } from "@/design-system/components/container";
import { firstSearchParam } from "@/lib/admin/search-params";
import { getPublicBlogListing } from "@/lib/blog/public";
import { getDb } from "@/lib/db";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
};

export const metadata: Metadata = {
  title: "Journal",
  description: "Published notes from Renaatus — civic partnerships, operations, and group news.",
  alternates: { canonical: `${siteConfig.url.replace(/\/$/, "")}/blog` },
};

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = firstSearchParam(params.q)?.trim() ?? "";
  const category = firstSearchParam(params.category)?.trim() ?? "";
  const listing = await getPublicBlogListing(getDb(), { q, category });
  const filtered = Boolean(q || category);
  const hasPosts = Boolean(listing.featured) || listing.latest.length > 0;

  return (
    <>
      <PageIntro
        eyebrow="Journal"
        title="From the group."
        copy="Published notes only. Drafts, unpublished entries, and archived pieces stay in the CMS."
        breadcrumbItems={[
          { href: "/", label: "Home" },
          { href: "/blog", label: "Journal" },
        ]}
      />

      <Container className="pb-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <BlogFilters q={q} category={category} categories={listing.categories} />
          {listing.categories.length > 0 ? (
            <nav aria-label="Journal categories" className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                aria-current={!category ? "page" : undefined}
                className={cn(
                  "h-9 border px-4 text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-200",
                  !category
                    ? "border-brass text-brass"
                    : "border-line text-cream/80 hover:border-cream/40 hover:text-cream",
                )}
              >
                All
              </Link>
              {listing.categories.map((item) => {
                const href = `/blog?category=${encodeURIComponent(item.slug)}`;
                const active = category === item.slug;
                return (
                  <Link
                    key={item.slug}
                    href={q ? `${href}&q=${encodeURIComponent(q)}` : href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "h-9 border px-4 text-[0.65rem] tracking-[0.18em] uppercase transition-colors duration-200",
                      active
                        ? "border-brass text-brass"
                        : "border-line text-cream/80 hover:border-cream/40 hover:text-cream",
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </div>
      </Container>

      <Container className="grid gap-16 pb-[var(--section-y)]">
        {!hasPosts ? (
          <p className="text-body text-cream-muted">
            {filtered
              ? "No published notes match that filter."
              : "No published journal notes yet."}
          </p>
        ) : null}

        {listing.featured ? <BlogCard post={listing.featured} featured /> : null}

        {listing.latest.length > 0 ? (
          <section className="grid gap-12">
            <h2 className="font-display text-h2 text-cream">
              {filtered ? "Matching notes" : "Latest notes"}
            </h2>
            <div className="grid gap-12 lg:grid-cols-2">
              {listing.latest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}
