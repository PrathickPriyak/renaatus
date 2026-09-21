import { loadPrismaEnv } from "./load-env";
import { createCliPrismaClient, readDatabaseUrl } from "./cli-client";
import type { PrismaClient } from "../generated/prisma/client";

loadPrismaEnv();

function assertDevelopmentOnly(): void {
  const appEnv = process.env.APP_ENV ?? "development";
  const nodeEnv = process.env.NODE_ENV ?? "development";

  if (appEnv === "production" || nodeEnv === "production") {
    throw new Error("Refusing to seed: seed data is for development only.");
  }
}

function paragraphDoc(text: string): object {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

async function seed(db: PrismaClient): Promise<void> {
  const editor = await db.user.upsert({
    where: { email: "editorial@renaatus.com" },
    update: { name: "Renaatus Editorial", role: "EDITOR" },
    create: {
      name: "Renaatus Editorial",
      email: "editorial@renaatus.com",
      role: "EDITOR",
    },
  });

  const news = await db.category.upsert({
    where: { slug: "news" },
    update: { name: "News" },
    create: { name: "News", slug: "news" },
  });

  const infrastructureTag = await db.tag.upsert({
    where: { slug: "infrastructure" },
    update: { name: "Infrastructure" },
    create: { name: "Infrastructure", slug: "infrastructure" },
  });

  const operationsTag = await db.tag.upsert({
    where: { slug: "operations" },
    update: { name: "Operations" },
    create: { name: "Operations", slug: "operations" },
  });

  const cmrlImage = await db.media.upsert({
    where: { key: "images/news/cmrl-tower.png" },
    update: {
      filename: "cmrl-tower.png",
      alt: "Chennai Central Tower",
      visibility: "PUBLIC",
      createdById: editor.id,
    },
    create: {
      key: "images/news/cmrl-tower.png",
      bucket: "local-public",
      filename: "cmrl-tower.png",
      mimeType: "image/png",
      byteSize: 0,
      alt: "Chennai Central Tower",
      visibility: "PUBLIC",
      createdById: editor.id,
    },
  });

  const sapImage = await db.media.upsert({
    where: { key: "images/news/sap-live.jpg" },
    update: {
      filename: "sap-live.jpg",
      alt: "Renaatus SAP go-live",
      visibility: "PUBLIC",
      createdById: editor.id,
    },
    create: {
      key: "images/news/sap-live.jpg",
      bucket: "local-public",
      filename: "sap-live.jpg",
      mimeType: "image/jpeg",
      byteSize: 0,
      alt: "Renaatus SAP go-live",
      visibility: "PUBLIC",
      createdById: editor.id,
    },
  });

  const productCover = await db.media.upsert({
    where: { key: "images/verticals/aac-blocks.jpg" },
    update: {
      filename: "aac-blocks.jpg",
      alt: "Renacon AAC blocks",
      visibility: "PUBLIC",
      createdById: editor.id,
    },
    create: {
      key: "images/verticals/aac-blocks.jpg",
      bucket: "local-public",
      filename: "aac-blocks.jpg",
      mimeType: "image/jpeg",
      byteSize: 0,
      alt: "Renacon AAC blocks",
      visibility: "PUBLIC",
      createdById: editor.id,
    },
  });

  await db.product.upsert({
    where: { slug: "renacon-aac-blocks" },
    update: {
      name: "Renacon AAC blocks",
      summary:
        "Renacon is South India’s leading brand of autoclaved aerated concrete — a versatile, eco-friendly wall material for schools, hospitals, workplaces, hotels, and homes.",
      published: true,
      coverId: productCover.id,
    },
    create: {
      name: "Renacon AAC blocks",
      slug: "renacon-aac-blocks",
      summary:
        "Renacon is South India’s leading brand of autoclaved aerated concrete — a versatile, eco-friendly wall material for schools, hospitals, workplaces, hotels, and homes.",
      published: true,
      coverId: productCover.id,
    },
  });

  const cmrl = await db.post.upsert({
    where: { slug: "partnering-with-cmrl-on-chennai-central-tower" },
    update: {
      title: "Partnering with CMRL on Chennai Central Tower",
      excerpt:
        "Renaatus is proud to partner with Chennai Metro Rail Limited for the iconic Chennai Central Tower — a 119-metre landmark that will reshape the city’s skyline.",
      body: paragraphDoc(
        "Renaatus is proud to partner with Chennai Metro Rail Limited for the iconic Chennai Central Tower — a 119-metre landmark that will reshape the city’s skyline.",
      ),
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-15T00:00:00.000Z"),
      authorId: editor.id,
      categoryId: news.id,
      featuredImageId: cmrlImage.id,
      seoTitle: "Partnering with CMRL on Chennai Central Tower",
    },
    create: {
      title: "Partnering with CMRL on Chennai Central Tower",
      slug: "partnering-with-cmrl-on-chennai-central-tower",
      excerpt:
        "Renaatus is proud to partner with Chennai Metro Rail Limited for the iconic Chennai Central Tower — a 119-metre landmark that will reshape the city’s skyline.",
      body: paragraphDoc(
        "Renaatus is proud to partner with Chennai Metro Rail Limited for the iconic Chennai Central Tower — a 119-metre landmark that will reshape the city’s skyline.",
      ),
      status: "PUBLISHED",
      publishedAt: new Date("2024-01-15T00:00:00.000Z"),
      authorId: editor.id,
      categoryId: news.id,
      featuredImageId: cmrlImage.id,
      seoTitle: "Partnering with CMRL on Chennai Central Tower",
    },
  });

  const sap = await db.post.upsert({
    where: { slug: "renaatus-goes-live-with-sap" },
    update: {
      title: "Renaatus goes live with SAP",
      excerpt:
        "A new era of operational excellence: streamlined operations, data-driven decisions, and future-ready scale — powered by our people.",
      body: paragraphDoc(
        "A new era of operational excellence: streamlined operations, data-driven decisions, and future-ready scale — powered by our people.",
      ),
      status: "PUBLISHED",
      publishedAt: new Date("2024-06-01T00:00:00.000Z"),
      authorId: editor.id,
      categoryId: news.id,
      featuredImageId: sapImage.id,
      seoTitle: "Renaatus goes live with SAP",
    },
    create: {
      title: "Renaatus goes live with SAP",
      slug: "renaatus-goes-live-with-sap",
      excerpt:
        "A new era of operational excellence: streamlined operations, data-driven decisions, and future-ready scale — powered by our people.",
      body: paragraphDoc(
        "A new era of operational excellence: streamlined operations, data-driven decisions, and future-ready scale — powered by our people.",
      ),
      status: "PUBLISHED",
      publishedAt: new Date("2024-06-01T00:00:00.000Z"),
      authorId: editor.id,
      categoryId: news.id,
      featuredImageId: sapImage.id,
      seoTitle: "Renaatus goes live with SAP",
    },
  });

  await db.postTag.upsert({
    where: { postId_tagId: { postId: cmrl.id, tagId: infrastructureTag.id } },
    update: {},
    create: { postId: cmrl.id, tagId: infrastructureTag.id },
  });

  await db.postTag.upsert({
    where: { postId_tagId: { postId: sap.id, tagId: operationsTag.id } },
    update: {},
    create: { postId: sap.id, tagId: operationsTag.id },
  });

  const existingAudit = await db.auditLog.findFirst({
    where: { action: "seed.development" },
  });

  if (!existingAudit) {
    await db.auditLog.create({
      data: {
        userId: editor.id,
        action: "seed.development",
        entityType: "Post",
        metadata: { posts: [cmrl.slug, sap.slug] },
      },
    });
  }
}

async function main(): Promise<void> {
  assertDevelopmentOnly();
  const db = createCliPrismaClient(readDatabaseUrl());

  try {
    await seed(db);
    console.log("Development seed complete.");
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seed error.";
  console.error(message);
  process.exit(1);
});
