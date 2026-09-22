"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createJournalPost,
  deleteJournalPost,
  updateJournalPost,
} from "@/lib/admin/posts";
import { getCurrentActor } from "@/lib/auth/current-actor";
import { POST_STATUSES } from "@/lib/constants";
import { ValidationError } from "@/lib/errors";
import { getDb } from "@/lib/db";
import { runAction } from "@/server/safe-action";
import type { AdminFormState } from "@/types";
import type { PostStatus } from "@/types/domain";

function isPostStatus(value: string): value is PostStatus {
  return POST_STATUSES.includes(value as PostStatus);
}

function readPostFields(formData: FormData) {
  const statusValue = String(formData.get("status") ?? "");
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    body: String(formData.get("body") ?? ""),
    status: isPostStatus(statusValue) ? statusValue : ("DRAFT" as const),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
    canonicalUrl: String(formData.get("canonicalUrl") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    tagNames: String(formData.get("tagNames") ?? ""),
    featuredImageId: String(formData.get("featuredImageId") ?? ""),
    ogImageId: String(formData.get("ogImageId") ?? ""),
    featured: formData.get("featured") === "on" ? "on" : "",
    publishedAt: String(formData.get("publishedAt") ?? ""),
  };
}

function revalidateBlog(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function createJournalPostAction(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const actor = await getCurrentActor();
  const fields = readPostFields(formData);
  const result = await runAction("post_create", async () => {
    return createJournalPost(getDb(), actor, fields);
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  revalidateBlog(result.data.slug);
  redirect(`/admin/blog/${result.data.id}/edit`);
}

export async function updateJournalPostAction(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const postId = String(formData.get("postId") ?? "").trim();
  if (!postId) {
    return { status: "error", message: "Missing journal entry." };
  }

  const actor = await getCurrentActor();
  const fields = readPostFields(formData);
  const result = await runAction("post_update", async () => {
    return updateJournalPost(getDb(), actor, { postId, ...fields });
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  revalidatePath(`/admin/blog/${postId}/edit`);
  revalidateBlog(result.data.slug);
  if (result.data.previousSlug !== result.data.slug) {
    revalidateBlog(result.data.previousSlug);
  }
  return { status: "success", message: "Journal entry saved." };
}

export async function deleteJournalPostAction(formData: FormData): Promise<void> {
  const postId = String(formData.get("postId") ?? "").trim();
  const actor = await getCurrentActor();
  const result = await runAction("post_delete", async () => {
    if (!postId) {
      throw new ValidationError("Missing journal entry.");
    }
    return deleteJournalPost(getDb(), actor, postId);
  });

  if (!result.ok) {
    redirect(`/admin/blog/${postId}/edit`);
  }

  revalidateBlog(result.data.slug);
  redirect("/admin/blog");
}
