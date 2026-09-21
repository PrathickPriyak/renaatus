"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createJournalPost, updateJournalPost } from "@/lib/admin/posts";
import { getCurrentActor } from "@/lib/auth/current-actor";
import { POST_STATUSES } from "@/lib/constants";
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
  };
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

  revalidatePath("/admin");
  revalidatePath("/admin/blog");
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

  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${postId}/edit`);
  return { status: "success", message: "Journal entry saved." };
}
