import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { loadPrismaEnv } from "../../../prisma/load-env";
import { createCliPrismaClient, readDatabaseUrl } from "../../../prisma/cli-client";
import {
  createJournalPost,
  deleteJournalPost,
  updateJournalPost,
} from "@/lib/admin/posts";
import {
  getFeaturedPublishedBlog,
  getPublishedBlog,
  getPublicBlogListing,
  listRelatedPublishedBlogs,
  publicBlogCanonical,
} from "@/lib/blog/public";
import { ValidationError } from "@/lib/errors";
import type { Actor } from "@/lib/auth/session";
import { siteConfig } from "@/lib/site";

loadPrismaEnv();

const db = createCliPrismaClient(readDatabaseUrl());
const stamp = Date.now();
const postIds: string[] = [];
const userIds: string[] = [];
const categoryIds: string[] = [];
const tagIds: string[] = [];

const editor: Actor = {
  id: "blog-editor",
  email: `blog.editor.${stamp}@renaatus.com`,
  name: "Blog Editor",
  role: "EDITOR",
};

async function seedPublished(input: {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  categoryId?: string;
  tagNames?: string[];
  featured?: boolean;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}) {
  const created = await createJournalPost(db, editor, {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    body: input.body,
    status: "PUBLISHED",
    categoryId: input.categoryId ?? "",
    tagNames: input.tagNames?.join(", ") ?? "",
    featured: input.featured ?? false,
    seoTitle: input.seoTitle ?? "",
    seoDescription: input.seoDescription ?? "",
    canonicalUrl: input.canonicalUrl ?? "",
    featuredImageId: "",
    ogImageId: "",
    publishedAt: input.publishedAt?.toISOString() ?? "",
  });
  postIds.push(created.id);
  return created;
}

describe("public blog cms", () => {
  before(async () => {
    const user = await db.user.create({
      data: {
        name: "Public Blog Editor",
        email: editor.email,
        role: "EDITOR",
      },
    });
    userIds.push(user.id);
    editor.id = user.id;

    const news = await db.category.create({
      data: { name: `News ${stamp}`, slug: `news-${stamp}` },
    });
    categoryIds.push(news.id);

    const ops = await db.category.create({
      data: { name: `Operations ${stamp}`, slug: `operations-${stamp}` },
    });
    categoryIds.push(ops.id);

    await seedPublished({
      title: `Featured tower ${stamp}`,
      slug: `featured-tower-${stamp}`,
      excerpt: "Featured civic landmark note.",
      body: "# Landmark\n\nPublished civic note for the public journal.",
      categoryId: news.id,
      tagNames: [`Infrastructure ${stamp}`],
      featured: true,
      publishedAt: new Date("2024-01-15T00:00:00.000Z"),
      seoTitle: `Featured tower SEO ${stamp}`,
      seoDescription: "SEO description for the featured civic note.",
      canonicalUrl: "https://www.renaatus.com/blog/featured-tower-canonical",
    });

    await seedPublished({
      title: `SAP operations ${stamp}`,
      slug: `sap-operations-${stamp}`,
      excerpt: "Latest operations note.",
      body: "A new era of operational excellence.",
      categoryId: ops.id,
      tagNames: [`Operations ${stamp}`],
      publishedAt: new Date("2024-06-01T00:00:00.000Z"),
    });

    const draft = await createJournalPost(db, editor, {
      title: `Hidden draft ${stamp}`,
      slug: `hidden-draft-${stamp}`,
      excerpt: "Drafts must never appear on the public journal.",
      body: "Secret draft body.",
      status: "DRAFT",
      categoryId: news.id,
      tagNames: "",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      featuredImageId: "",
      ogImageId: "",
      publishedAt: "",
    });
    postIds.push(draft.id);
  });

  after(async () => {
    if (postIds.length > 0) {
      await db.postTag.deleteMany({ where: { postId: { in: postIds } } });
      await db.post.deleteMany({ where: { id: { in: postIds } } });
    }
    if (tagIds.length > 0) {
      await db.tag.deleteMany({ where: { id: { in: tagIds } } });
    }
    await db.tag.deleteMany({
      where: { slug: { in: [`infrastructure-${stamp}`, `operations-${stamp}`] } },
    });
    if (categoryIds.length > 0) {
      await db.category.deleteMany({ where: { id: { in: categoryIds } } });
    }
    if (userIds.length > 0) {
      await db.auditLog.deleteMany({ where: { userId: { in: userIds } } });
      await db.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await db.$disconnect();
  });

  it("lists only published posts and promotes the featured entry", async () => {
    const listing = await getPublicBlogListing(db, {});
    assert.equal(listing.featured?.slug, `featured-tower-${stamp}`);
    assert.ok(listing.latest.some((post) => post.slug === `sap-operations-${stamp}`));
    assert.equal(
      listing.latest.some((post) => post.slug === `hidden-draft-${stamp}`),
      false,
    );
    assert.equal(
      listing.latest.some((post) => post.slug === `featured-tower-${stamp}`),
      false,
    );
    assert.ok(listing.categories.some((category) => category.slug === `news-${stamp}`));
  });

  it("hides drafts from public slug lookup", async () => {
    const published = await getPublishedBlog(db, `featured-tower-${stamp}`);
    assert.ok(published);
    assert.equal(published?.seoTitle, `Featured tower SEO ${stamp}`);
    assert.equal(published?.canonicalUrl, "https://www.renaatus.com/blog/featured-tower-canonical");
    assert.equal(published?.authorName, "Public Blog Editor");

    const draft = await getPublishedBlog(db, `hidden-draft-${stamp}`);
    assert.equal(draft, null);
  });

  it("filters published posts by category and search", async () => {
    const byCategory = await getPublicBlogListing(db, { category: `operations-${stamp}` });
    assert.ok(byCategory.latest.some((post) => post.slug === `sap-operations-${stamp}`));
    assert.equal(
      byCategory.latest.some((post) => post.slug === `featured-tower-${stamp}`),
      false,
    );

    const bySearch = await getPublicBlogListing(db, { q: "SAP operations" });
    assert.ok(bySearch.latest.some((post) => post.slug === `sap-operations-${stamp}`));
    assert.equal(
      bySearch.latest.some((post) => post.slug === `featured-tower-${stamp}`),
      false,
    );
  });

  it("returns related published posts from the same category", async () => {
    const relatedSeed = await seedPublished({
      title: `Related civic ${stamp}`,
      slug: `related-civic-${stamp}`,
      excerpt: "Another civic note.",
      body: "Related civic body.",
      categoryId: categoryIds[0],
      publishedAt: new Date("2024-02-01T00:00:00.000Z"),
    });
    const related = await listRelatedPublishedBlogs(db, `featured-tower-${stamp}`, 3);
    assert.ok(related.some((post) => post.id === relatedSeed.id));
    assert.equal(
      related.some((post) => post.slug === `featured-tower-${stamp}`),
      false,
    );
  });

  it("defaults the canonical URL to the public blog path", () => {
    assert.equal(
      publicBlogCanonical("renaatus-goes-live-with-sap", null),
      `${siteConfig.url.replace(/\/$/, "")}/blog/renaatus-goes-live-with-sap`,
    );
  });

  it("unpublish, archive, and delete remove posts from the public journal", async () => {
    const temp = await seedPublished({
      title: `Temporary ${stamp}`,
      slug: `temporary-${stamp}`,
      excerpt: "Will leave the public journal.",
      body: "Temporary body.",
      publishedAt: new Date("2024-07-01T00:00:00.000Z"),
    });

    await updateJournalPost(db, editor, {
      postId: temp.id,
      title: temp.title,
      slug: temp.slug,
      excerpt: temp.excerpt,
      body: "Temporary body.",
      status: "UNPUBLISHED",
      categoryId: "",
      tagNames: "",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      featuredImageId: "",
      ogImageId: "",
      publishedAt: "",
    });
    assert.equal(await getPublishedBlog(db, temp.slug), null);

    await updateJournalPost(db, editor, {
      postId: temp.id,
      title: temp.title,
      slug: temp.slug,
      excerpt: temp.excerpt,
      body: "Temporary body.",
      status: "ARCHIVED",
      categoryId: "",
      tagNames: "",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      featuredImageId: "",
      ogImageId: "",
      publishedAt: "",
    });
    assert.equal(await getPublishedBlog(db, temp.slug), null);

    await deleteJournalPost(db, editor, temp.id);
    const remaining = postIds.filter((id) => id !== temp.id);
    postIds.length = 0;
    postIds.push(...remaining);
    assert.equal(await db.post.findUnique({ where: { id: temp.id } }), null);
  });

  it("rejects a duplicate slug", async () => {
    await assert.rejects(
      () =>
        createJournalPost(db, editor, {
          title: "Duplicate",
          slug: `featured-tower-${stamp}`,
          excerpt: "Should not persist.",
          body: "Should not persist.",
          status: "DRAFT",
          categoryId: "",
          tagNames: "",
          featured: false,
          seoTitle: "",
          seoDescription: "",
          canonicalUrl: "",
          featuredImageId: "",
          ogImageId: "",
          publishedAt: "",
        }),
      (error: unknown) => error instanceof ValidationError,
    );
  });

  it("returns the featured published post for home surfaces", async () => {
    const featured = await getFeaturedPublishedBlog(db);
    assert.equal(featured?.slug, `featured-tower-${stamp}`);
  });
});
