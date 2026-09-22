import type { Prisma, PrismaClient } from "../../../generated/prisma/client";
import { asJournalDoc, type JournalDoc } from "@/lib/admin/journal-body";
import { publicMediaDisplayUrl } from "@/lib/blog/media-url";
import { siteConfig } from "@/lib/site";

export type PublicBlogImage = {
  src: string;
  alt: string;
};

export type PublicBlogCard = {
  id: string;
  title: string;
  slug: string;
  href: string;
  excerpt: string;
  featured: boolean;
  publishedAt: Date | null;
  authorName: string;
  category: { name: string; slug: string } | null;
  image: PublicBlogImage | null;
};

export type PublicBlogPost = PublicBlogCard & {
  body: JournalDoc;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: PublicBlogImage | null;
  tags: Array<{ name: string; slug: string }>;
  updatedAt: Date;
};

export type PublicBlogCategory = {
  name: string;
  slug: string;
  count: number;
};

export type PublicBlogListing = {
  featured: PublicBlogCard | null;
  latest: PublicBlogCard[];
  categories: PublicBlogCategory[];
};

export type PublicBlogFilters = {
  q?: string;
  category?: string;
};

const cardInclude = {
  author: { select: { name: true } },
  category: { select: { name: true, slug: true } },
  featuredImage: {
    select: { key: true, bucket: true, alt: true, visibility: true },
  },
} as const;

const publishedInclude = {
  ...cardInclude,
  ogImage: {
    select: { key: true, bucket: true, alt: true, visibility: true },
  },
  tags: {
    select: {
      tag: { select: { name: true, slug: true } },
    },
  },
} as const;

type CardRow = Prisma.PostGetPayload<{ include: typeof cardInclude }>;
type PublishedRow = Prisma.PostGetPayload<{ include: typeof publishedInclude }>;

function mediaImage(
  media:
    | {
        key: string;
        bucket: string;
        alt: string | null;
        visibility: "PUBLIC" | "PRIVATE";
      }
    | null
    | undefined,
): PublicBlogImage | null {
  if (!media) {
    return null;
  }
  const src = publicMediaDisplayUrl(media);
  if (!src) {
    return null;
  }
  return { src, alt: media.alt?.trim() || "" };
}

export function publicBlogCanonical(slug: string, canonicalUrl?: string | null): string {
  const custom = canonicalUrl?.trim();
  if (custom) {
    return custom;
  }
  return `${siteConfig.url.replace(/\/$/, "")}/blog/${slug}`;
}

export function publicBlogSeoTitle(title: string, seoTitle?: string | null): string {
  const custom = seoTitle?.trim();
  return custom || title;
}

export function publicBlogSeoDescription(
  excerpt: string,
  seoDescription?: string | null,
): string {
  const custom = seoDescription?.trim();
  return custom || excerpt;
}

export function formatBlogDate(value: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

function toCard(post: CardRow): PublicBlogCard {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    href: `/blog/${post.slug}`,
    excerpt: post.excerpt,
    featured: post.featured,
    publishedAt: post.publishedAt,
    authorName: post.author.name,
    category: post.category,
    image: mediaImage(post.featuredImage),
  };
}

function toDetail(post: PublishedRow): PublicBlogPost {
  const image = mediaImage(post.featuredImage);
  return {
    ...toCard(post),
    body: asJournalDoc(post.body),
    seoTitle: publicBlogSeoTitle(post.title, post.seoTitle),
    seoDescription: publicBlogSeoDescription(post.excerpt, post.seoDescription),
    canonicalUrl: publicBlogCanonical(post.slug, post.canonicalUrl),
    ogImage: mediaImage(post.ogImage) ?? image,
    tags: post.tags.map((row) => row.tag),
    updatedAt: post.updatedAt,
  };
}

function publishedWhere(filters: PublicBlogFilters = {}): Prisma.PostWhereInput {
  const where: Prisma.PostWhereInput = { status: "PUBLISHED" };
  const category = filters.category?.trim();
  const q = filters.q?.trim();

  if (category) {
    where.category = { slug: category };
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function listPublishedBlogs(
  db: PrismaClient,
  filters: PublicBlogFilters = {},
): Promise<PublicBlogCard[]> {
  const posts = await db.post.findMany({
    where: publishedWhere(filters),
    include: cardInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
  });
  return posts.map(toCard);
}

export async function listHomeJournalPosts(
  db: PrismaClient,
  take = 2,
): Promise<PublicBlogCard[]> {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    include: cardInclude,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take,
  });
  return posts.map(toCard);
}

export async function listPublishedBlogCategories(
  db: PrismaClient,
): Promise<PublicBlogCategory[]> {
  const categories = await db.category.findMany({
    where: { posts: { some: { status: "PUBLISHED" } } },
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
      _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
    },
  });

  return categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    count: category._count.posts,
  }));
}

export async function getPublicBlogListing(
  db: PrismaClient,
  filters: PublicBlogFilters = {},
): Promise<PublicBlogListing> {
  const [posts, categories] = await Promise.all([
    listPublishedBlogs(db, filters),
    listPublishedBlogCategories(db),
  ]);

  const filtered = Boolean(filters.q?.trim() || filters.category?.trim());
  if (filtered) {
    return { featured: null, latest: posts, categories };
  }

  const featured = posts.find((post) => post.featured) ?? null;
  const latest = featured ? posts.filter((post) => post.id !== featured.id) : posts;
  return { featured, latest, categories };
}

export async function getPublishedBlog(
  db: PrismaClient,
  slug: string,
): Promise<PublicBlogPost | null> {
  const post = await db.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: publishedInclude,
  });
  return post ? toDetail(post) : null;
}

export async function getFeaturedPublishedBlog(
  db: PrismaClient,
): Promise<PublicBlogCard | null> {
  const featured = await db.post.findFirst({
    where: { status: "PUBLISHED", featured: true },
    include: cardInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  if (featured) {
    return toCard(featured);
  }

  const latest = await db.post.findFirst({
    where: { status: "PUBLISHED" },
    include: cardInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return latest ? toCard(latest) : null;
}

export async function listRelatedPublishedBlogs(
  db: PrismaClient,
  slug: string,
  limit = 3,
): Promise<PublicBlogCard[]> {
  const current = await db.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { id: true, categoryId: true },
  });
  if (!current) {
    return [];
  }

  const related: PublicBlogCard[] = [];
  const seen = new Set<string>([current.id]);

  if (current.categoryId) {
    const sameCategory = await db.post.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: current.categoryId,
        id: { not: current.id },
      },
      include: cardInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
    for (const post of sameCategory) {
      seen.add(post.id);
      related.push(toCard(post));
    }
  }

  if (related.length < limit) {
    const fallback = await db.post.findMany({
      where: {
        status: "PUBLISHED",
        id: { notIn: [...seen] },
      },
      include: cardInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit - related.length,
    });
    related.push(...fallback.map(toCard));
  }

  return related;
}
