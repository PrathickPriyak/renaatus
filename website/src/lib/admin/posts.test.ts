import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { loadPrismaEnv } from "../../../prisma/load-env";
import { createCliPrismaClient, readDatabaseUrl } from "../../../prisma/cli-client";
import {
  createJournalPost,
  deleteJournalPost,
  listJournalPosts,
  updateJournalPost,
} from "@/lib/admin/posts";
import { listMediaForAdmin } from "@/lib/admin/media";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import type { Actor } from "@/lib/auth/session";

loadPrismaEnv();

const db = createCliPrismaClient(readDatabaseUrl());
const stamp = Date.now();
const postIds: string[] = [];
const userIds: string[] = [];

const editor: Actor = {
  id: "editor-actor",
  email: `dash.editor.${stamp}@renaatus.com`,
  name: "Dashboard Editor",
  role: "EDITOR",
};

const viewer: Actor = {
  id: "viewer-actor",
  email: `dash.blog.viewer.${stamp}@renaatus.com`,
  name: "Blog Viewer",
  role: "VIEWER",
};

describe("admin cms", () => {
  before(async () => {
    const user = await db.user.create({
      data: {
        name: "Journal Editor",
        email: `dash.journal.${stamp}@renaatus.com`,
        role: "EDITOR",
      },
    });
    userIds.push(user.id);
    editor.id = user.id;
  });

  after(async () => {
    if (postIds.length > 0) {
      await db.post.deleteMany({ where: { id: { in: postIds } } });
    }
    if (userIds.length > 0) {
      await db.auditLog.deleteMany({ where: { userId: { in: userIds } } });
      await db.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await db.$disconnect();
  });

  it("returns the deleted slug so public journal pages can be revalidated", async () => {
    const created = await createJournalPost(db, editor, {
      title: `Admin delete ${stamp}`,
      slug: `admin-delete-${stamp}`,
      excerpt: "A draft that will be deleted.",
      body: "Body text stored as structured JSON.",
      status: "DRAFT",
    });
    const deleted = await deleteJournalPost(db, editor, created.id);
    assert.equal(deleted.slug, `admin-delete-${stamp}`);
    assert.equal(await db.post.findUnique({ where: { id: created.id } }), null);
  });

  it("lets editors create and update a draft post", async () => {
    const created = await createJournalPost(db, editor, {
      title: `Admin draft ${stamp}`,
      slug: `admin-draft-${stamp}`,
      excerpt: "A draft note stored from the admin dashboard.",
      body: "Body text stored as structured JSON, not invented news.",
      status: "DRAFT",
    });
    postIds.push(created.id);
    assert.equal(created.status, "DRAFT");
    assert.equal(created.slug, `admin-draft-${stamp}`);

    const updated = await updateJournalPost(db, editor, {
      postId: created.id,
      title: `Admin draft ${stamp} edited`,
      slug: `admin-draft-${stamp}`,
      excerpt: "Updated excerpt.",
      body: "Updated body.",
      status: "DRAFT",
    });
    assert.equal(updated.title, `Admin draft ${stamp} edited`);

    const listed = await listJournalPosts(db, editor);
    assert.ok(listed.some((post) => post.id === created.id));
  });

  it("forbids viewers from managing journal posts", async () => {
    await assert.rejects(
      () => listJournalPosts(db, viewer),
      (error: unknown) => error instanceof ForbiddenError,
    );
    await assert.rejects(
      () =>
        createJournalPost(db, viewer, {
          title: "Nope",
          slug: `nope-${stamp}`,
          excerpt: "Viewers cannot create posts.",
          body: "Should not persist.",
          status: "DRAFT",
        }),
      (error: unknown) => error instanceof ForbiddenError,
    );
  });

  it("lists media without public URLs for private objects", async () => {
    const listed = await listMediaForAdmin(db, editor);
    const privateRow = listed.find((item) => item.visibility === "PRIVATE");
    if (privateRow) {
      assert.equal(privateRow.publicUrl, null);
      assert.equal("key" in privateRow, false);
    }
  });

  it("forbids viewers from listing media", async () => {
    await assert.rejects(
      () => listMediaForAdmin(db, viewer),
      (error: unknown) => error instanceof ForbiddenError,
    );
  });

  it("rejects a missing media actor", async () => {
    await assert.rejects(
      () => listMediaForAdmin(db, null),
      (error: unknown) => error instanceof UnauthorizedError,
    );
  });
});
