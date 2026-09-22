import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { loadPrismaEnv } from "../../../prisma/load-env";
import { createCliPrismaClient, readDatabaseUrl } from "../../../prisma/cli-client";
import { createJournalPost, deleteJournalPost } from "@/lib/admin/posts";
import { buildRobots } from "@/lib/seo/robots";
import { buildSitemap } from "@/lib/seo/sitemap";
import { siteConfig } from "@/lib/site";
import type { Actor } from "@/lib/auth/session";

loadPrismaEnv();

const db = createCliPrismaClient(readDatabaseUrl());

describe("robots and sitemap", () => {
  after(async () => {
    await db.$disconnect();
  });

  it("blocks admin, login, APIs, and the design system from crawlers", () => {
    const robots = buildRobots();
    const rule = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules;
    assert.ok(rule);
    const disallowed = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
    assert.ok(disallowed.some((path) => path?.includes("/admin")));
    assert.ok(disallowed.some((path) => path?.includes("/login")));
    assert.ok(disallowed.some((path) => path?.includes("/api")));
    assert.ok(disallowed.some((path) => path?.includes("/private")));
    assert.ok(disallowed.some((path) => path?.includes("/design-system")));
    assert.equal(robots.sitemap, `${siteConfig.url.replace(/\/$/, "")}/sitemap.xml`);
  });

  it("lists public pages and published blogs, never private routes", async () => {
    const stamp = Date.now();
    const editor: Actor = {
      id: "seo-editor",
      email: `seo.editor.${stamp}@renaatus.com`,
      name: "SEO Editor",
      role: "EDITOR",
    };
    const user = await db.user.create({
      data: { name: editor.name, email: editor.email, role: "EDITOR" },
    });
    editor.id = user.id;

    const published = await createJournalPost(db, editor, {
      title: `SEO published ${stamp}`,
      slug: `seo-published-${stamp}`,
      excerpt: "Published note that belongs in the sitemap.",
      body: "Published sitemap body.",
      status: "PUBLISHED",
    });
    const draft = await createJournalPost(db, editor, {
      title: `SEO draft ${stamp}`,
      slug: `seo-draft-${stamp}`,
      excerpt: "Draft note that must stay out of the sitemap.",
      body: "Draft sitemap body.",
      status: "DRAFT",
    });

    try {
      const entries = await buildSitemap(db);
      const origin = siteConfig.url.replace(/\/$/, "");
      const urls = entries.map((entry) => entry.url);

      assert.ok(urls.includes(`${origin}/`));
      assert.ok(urls.includes(`${origin}/blog`));
      assert.ok(urls.includes(`${origin}/blog/${published.slug}`));
      assert.equal(urls.includes(`${origin}/blog/${draft.slug}`), false);
      assert.equal(urls.some((url) => url.includes("/admin")), false);
      assert.equal(urls.some((url) => url.includes("/login")), false);
      assert.equal(urls.some((url) => url.includes("/api/")), false);
      assert.equal(urls.some((url) => url.includes("/private")), false);
      assert.equal(urls.some((url) => url.includes("/design-system")), false);
      assert.equal(urls.some((url) => /\/realty$/.test(url)), false);
      assert.equal(urls.some((url) => /\/infrastructure$/.test(url)), false);
      assert.equal(urls.some((url) => url.includes("/journal")), false);
    } finally {
      await deleteJournalPost(db, editor, published.id);
      await deleteJournalPost(db, editor, draft.id);
      await db.auditLog.deleteMany({ where: { userId: user.id } });
      await db.user.deleteMany({ where: { id: user.id } });
    }
  });
});
