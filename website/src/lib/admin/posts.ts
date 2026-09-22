import type { Prisma, PrismaClient } from "../../../generated/prisma/client";
import { writeAudit } from "@/lib/admin/audit";
import { journalBodyToText, parseJournalBody } from "@/lib/admin/journal-body";
import { requireBlogEditor } from "@/lib/admin/require-actor";
import { publicMediaDisplayUrl } from "@/lib/blog/media-url";
import type { Actor } from "@/lib/auth/session";
import { POST_STATUSES } from "@/lib/constants";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import type { PostStatus } from "@/types/domain";
import { z } from "zod";

const optionalText = z.string().optional().default("");

const journalPostInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200, "Title is too long."),
  slug: z
    .string()
    .trim()
    .max(120, "Slug is too long.")
    .transform((value) => slugify(value))
    .pipe(z.string().min(1, "Slug is required.")),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required.")
    .max(500, "Excerpt is too long."),
  body: z.string().trim().min(1, "Body is required.").max(50_000, "Body is too long."),
  status: z.enum(POST_STATUSES),
  seoTitle: optionalText.pipe(z.string().trim().max(120, "SEO title is too long.")),
  seoDescription: optionalText.pipe(
    z.string().trim().max(300, "SEO description is too long."),
  ),
  canonicalUrl: optionalText.pipe(z.string().trim().max(500, "Canonical URL is too long.")),
  categoryId: optionalText,
  tagNames: optionalText.pipe(z.string().trim().max(500, "Tags are too long.")),
  featuredImageId: optionalText,
  ogImageId: optionalText,
  featured: z
    .union([z.boolean(), z.literal("true"), z.literal("false"), z.literal("on"), z.literal("")])
    .optional()
    .transform((value) => value === true || value === "true" || value === "on"),
  publishedAt: optionalText,
});

export type JournalPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  categoryId?: string;
  tagNames?: string;
  featuredImageId?: string;
  ogImageId?: string;
  featured?: boolean | string;
  publishedAt?: string;
};

export type AdminJournalTag = {
  id: string;
  name: string;
  slug: string;
};

export type AdminJournalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: PostStatus;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  bodyText: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  categoryId: string;
  featuredImageId: string;
  ogImageId: string;
  tags: AdminJournalTag[];
  tagNames: string;
};

export type AdminJournalImageOption = {
  id: string;
  filename: string;
  alt: string | null;
  publicUrl: string | null;
};

export type AdminJournalEditorOptions = {
  categories: Array<{ id: string; name: string; slug: string }>;
  tags: AdminJournalTag[];
  images: AdminJournalImageOption[];
};

const listPostSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  status: true,
  featured: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  seoTitle: true,
  seoDescription: true,
  canonicalUrl: true,
  categoryId: true,
  featuredImageId: true,
  ogImageId: true,
  tags: {
    select: {
      tag: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
} as const;

const postSelect = {
  ...listPostSelect,
  body: true,
} as const;

type SelectedPost = Prisma.PostGetPayload<{ select: typeof postSelect }>;
type ListedPost = Prisma.PostGetPayload<{ select: typeof listPostSelect }>;

function toAdminJournalListItem(post: ListedPost): AdminJournalPost {
  return toAdminJournalPost({ ...post, body: [] });
}

function toAdminJournalPost(post: SelectedPost): AdminJournalPost {
  const tags = post.tags.map((row) => row.tag);
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: post.status,
    featured: post.featured,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    bodyText: journalBodyToText(post.body),
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    canonicalUrl: post.canonicalUrl ?? "",
    categoryId: post.categoryId ?? "",
    featuredImageId: post.featuredImageId ?? "",
    ogImageId: post.ogImageId ?? "",
    tags,
    tagNames: tags.map((tag) => tag.name).join(", "),
  };
}

function parseInput(input: JournalPostInput) {
  const parsed = journalPostInputSchema.safeParse(input);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && fields[key] === undefined) {
        fields[key] = issue.message;
      }
    }
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid journal post.",
      parsed.error,
      fields,
    );
  }
  return parsed.data;
}

function parseCanonicalUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("invalid");
    }
    return url.toString();
  } catch {
    throw new ValidationError("Canonical URL must be a valid http(s) address.", undefined, {
      canonicalUrl: "Canonical URL must be a valid http(s) address.",
    });
  }
}

function parsePublishedAt(
  value: string,
  status: PostStatus,
  current: Date | null,
): Date | null {
  const trimmed = value.trim();
  if (trimmed) {
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? `${trimmed}T00:00:00.000Z` : trimmed;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      throw new ValidationError("Published date is invalid.", undefined, {
        publishedAt: "Published date is invalid.",
      });
    }
    return date;
  }
  if (status === "PUBLISHED") {
    return current ?? new Date();
  }
  return current;
}

async function assertSlugAvailable(
  db: PrismaClient,
  slug: string,
  excludeId?: string,
): Promise<void> {
  const existing = await db.post.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing && existing.id !== excludeId) {
    throw new ValidationError("That slug is already in use.", undefined, {
      slug: "That slug is already in use.",
    });
  }
}

async function resolveCategoryId(
  db: PrismaClient,
  categoryId: string,
): Promise<string | null> {
  const trimmed = categoryId.trim();
  if (!trimmed) {
    return null;
  }
  const category = await db.category.findUnique({
    where: { id: trimmed },
    select: { id: true },
  });
  if (!category) {
    throw new ValidationError("Category was not found.", undefined, {
      categoryId: "Category was not found.",
    });
  }
  return category.id;
}

async function resolvePublicImageId(
  db: PrismaClient,
  mediaId: string,
  field: "featuredImageId" | "ogImageId",
): Promise<string | null> {
  const trimmed = mediaId.trim();
  if (!trimmed) {
    return null;
  }
  const media = await db.media.findUnique({
    where: { id: trimmed },
    select: { id: true, visibility: true },
  });
  if (!media || media.visibility !== "PUBLIC") {
    throw new ValidationError("Choose a public image from the media library.", undefined, {
      [field]: "Choose a public image from the media library.",
    });
  }
  return media.id;
}

async function resolveTags(
  db: PrismaClient,
  tagNames: string,
): Promise<Array<{ id: string }>> {
  const names = tagNames
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const tags: Array<{ id: string }> = [];
  for (const name of names) {
    const slug = slugify(name);
    if (!slug) {
      continue;
    }
    const tag = await db.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    tags.push({ id: tag.id });
  }
  return tags;
}

export async function listJournalPosts(
  db: PrismaClient,
  actor: Actor | null,
): Promise<AdminJournalPost[]> {
  requireBlogEditor(actor);
  const posts = await db.post.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take: 100,
    select: listPostSelect,
  });
  return posts.map(toAdminJournalListItem);
}

export async function getJournalPost(
  db: PrismaClient,
  actor: Actor | null,
  postId: string,
): Promise<AdminJournalPost> {
  requireBlogEditor(actor);
  const post = await db.post.findUnique({
    where: { id: postId },
    select: postSelect,
  });
  if (!post) {
    throw new NotFoundError("Journal post");
  }
  return toAdminJournalPost(post);
}

export async function listJournalEditorOptions(
  db: PrismaClient,
  actor: Actor | null,
): Promise<AdminJournalEditorOptions> {
  requireBlogEditor(actor);
  const [categories, tags, media] = await Promise.all([
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.tag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    db.media.findMany({
      where: {
        visibility: "PUBLIC",
        mimeType: { startsWith: "image/" },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        filename: true,
        alt: true,
        key: true,
        bucket: true,
        visibility: true,
      },
    }),
  ]);

  return {
    categories,
    tags,
    images: media.map((item) => ({
      id: item.id,
      filename: item.filename,
      alt: item.alt,
      publicUrl: publicMediaDisplayUrl(item),
    })),
  };
}

export async function createJournalPost(
  db: PrismaClient,
  actor: Actor | null,
  input: JournalPostInput,
): Promise<AdminJournalPost> {
  const staff = requireBlogEditor(actor);
  const data = parseInput(input);
  await assertSlugAvailable(db, data.slug);

  const [categoryId, featuredImageId, ogImageId, tags] = await Promise.all([
    resolveCategoryId(db, data.categoryId),
    resolvePublicImageId(db, data.featuredImageId, "featuredImageId"),
    resolvePublicImageId(db, data.ogImageId, "ogImageId"),
    resolveTags(db, data.tagNames),
  ]);

  const created = await db.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: parseJournalBody(data.body),
      status: data.status,
      featured: data.featured,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      canonicalUrl: parseCanonicalUrl(data.canonicalUrl),
      publishedAt: parsePublishedAt(data.publishedAt, data.status, null),
      authorId: staff.id,
      categoryId,
      featuredImageId,
      ogImageId,
      tags: {
        create: tags.map((tag) => ({ tagId: tag.id })),
      },
    },
    select: postSelect,
  });

  await writeAudit(db, {
    userId: staff.id,
    action: "post.create",
    entityType: "Post",
    entityId: created.id,
    metadata: { status: created.status, slug: created.slug },
  });

  return toAdminJournalPost(created);
}

export async function updateJournalPost(
  db: PrismaClient,
  actor: Actor | null,
  input: JournalPostInput & { postId: string },
): Promise<AdminJournalPost> {
  const staff = requireBlogEditor(actor);
  const data = parseInput(input);

  const existing = await db.post.findUnique({
    where: { id: input.postId },
    select: { id: true, publishedAt: true },
  });
  if (!existing) {
    throw new NotFoundError("Journal post");
  }

  await assertSlugAvailable(db, data.slug, existing.id);

  const [categoryId, featuredImageId, ogImageId, tags] = await Promise.all([
    resolveCategoryId(db, data.categoryId),
    resolvePublicImageId(db, data.featuredImageId, "featuredImageId"),
    resolvePublicImageId(db, data.ogImageId, "ogImageId"),
    resolveTags(db, data.tagNames),
  ]);

  await db.postTag.deleteMany({ where: { postId: existing.id } });

  const updated = await db.post.update({
    where: { id: existing.id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: parseJournalBody(data.body),
      status: data.status,
      featured: data.featured,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      canonicalUrl: parseCanonicalUrl(data.canonicalUrl),
      publishedAt: parsePublishedAt(data.publishedAt, data.status, existing.publishedAt),
      categoryId,
      featuredImageId,
      ogImageId,
      tags: {
        create: tags.map((tag) => ({ tagId: tag.id })),
      },
    },
    select: postSelect,
  });

  await writeAudit(db, {
    userId: staff.id,
    action: "post.update",
    entityType: "Post",
    entityId: updated.id,
    metadata: { status: updated.status, slug: updated.slug },
  });

  return toAdminJournalPost(updated);
}

export async function deleteJournalPost(
  db: PrismaClient,
  actor: Actor | null,
  postId: string,
): Promise<void> {
  const staff = requireBlogEditor(actor);
  const existing = await db.post.findUnique({
    where: { id: postId },
    select: { id: true, slug: true },
  });
  if (!existing) {
    throw new NotFoundError("Journal post");
  }

  await db.post.delete({ where: { id: existing.id } });
  await writeAudit(db, {
    userId: staff.id,
    action: "post.delete",
    entityType: "Post",
    entityId: existing.id,
    metadata: { slug: existing.slug },
  });
}
