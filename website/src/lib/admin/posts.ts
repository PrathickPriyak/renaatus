import type { Prisma, PrismaClient } from "../../../generated/prisma/client";
import { writeAudit } from "@/lib/admin/audit";
import { journalBodyToText, paragraphDoc } from "@/lib/admin/journal-body";
import { requireBlogEditor } from "@/lib/admin/require-actor";
import type { Actor } from "@/lib/auth/session";
import { POST_STATUSES } from "@/lib/constants";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { slugify } from "@/lib/utils";
import type { PostStatus } from "@/types/domain";
import { z } from "zod";

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
});

export type JournalPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: PostStatus;
};

export type AdminJournalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  bodyText: string;
};

const postSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  body: true,
} as const;

function toAdminJournalPost(post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  body: Prisma.JsonValue;
}): AdminJournalPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: post.status,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    bodyText: journalBodyToText(post.body),
  };
}

function parseInput(input: JournalPostInput): JournalPostInput {
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

function publishedAtFor(status: PostStatus, current: Date | null): Date | null {
  if (status === "PUBLISHED") {
    return current ?? new Date();
  }
  return current;
}

export async function listJournalPosts(
  db: PrismaClient,
  actor: Actor | null,
): Promise<AdminJournalPost[]> {
  requireBlogEditor(actor);
  const posts = await db.post.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take: 100,
    select: postSelect,
  });
  return posts.map(toAdminJournalPost);
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

export async function createJournalPost(
  db: PrismaClient,
  actor: Actor | null,
  input: JournalPostInput,
): Promise<AdminJournalPost> {
  const staff = requireBlogEditor(actor);
  const data = parseInput(input);
  await assertSlugAvailable(db, data.slug);

  const created = await db.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: paragraphDoc(data.body),
      status: data.status,
      publishedAt: publishedAtFor(data.status, null),
      authorId: staff.id,
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

  const updated = await db.post.update({
    where: { id: existing.id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: paragraphDoc(data.body),
      status: data.status,
      publishedAt: publishedAtFor(data.status, existing.publishedAt),
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
