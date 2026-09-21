"use client";

import { useActionState, useState } from "react";
import { Button } from "@/design-system/components/button";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Select } from "@/design-system/components/select";
import { Textarea } from "@/design-system/components/textarea";
import { POST_STATUSES } from "@/lib/constants";
import { humanizePostStatusLabel } from "@/lib/admin/format";
import { slugify } from "@/lib/utils";
import {
  createJournalPostAction,
  updateJournalPostAction,
} from "@/server/actions/admin-posts";
import { initialAdminFormState } from "@/types";
import type { PostStatus } from "@/types/domain";

type JournalPostFormProps = {
  mode: "create" | "edit";
  postId?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  status?: PostStatus;
};

export function JournalPostForm({
  mode,
  postId,
  title = "",
  slug = "",
  excerpt = "",
  body = "",
  status = "DRAFT",
}: JournalPostFormProps) {
  const action = mode === "create" ? createJournalPostAction : updateJournalPostAction;
  const [state, formAction, pending] = useActionState(action, initialAdminFormState);
  const [slugValue, setSlugValue] = useState(slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      {postId ? <input type="hidden" name="postId" value={postId} /> : null}
      <Field label="Title" htmlFor="title" error={state.fieldErrors?.title}>
        <Input
          id="title"
          name="title"
          defaultValue={title}
          required
          maxLength={200}
          onChange={(event) => {
            if (!slugTouched) {
              setSlugValue(slugify(event.target.value));
            }
          }}
        />
      </Field>
      <Field
        label="Slug"
        htmlFor="slug"
        hint="Public URL segment. Use lowercase letters, numbers, and hyphens."
        error={state.fieldErrors?.slug}
      >
        <Input
          id="slug"
          name="slug"
          value={slugValue}
          required
          maxLength={120}
          onChange={(event) => {
            setSlugTouched(true);
            setSlugValue(event.target.value);
          }}
        />
      </Field>
      <Field label="Excerpt" htmlFor="excerpt" error={state.fieldErrors?.excerpt}>
        <Textarea
          id="excerpt"
          name="excerpt"
          defaultValue={excerpt}
          required
          maxLength={500}
        />
      </Field>
      <Field label="Body" htmlFor="body" error={state.fieldErrors?.body}>
        <Textarea
          id="body"
          name="body"
          defaultValue={body}
          required
          rows={12}
          className="min-h-56"
        />
      </Field>
      <Field label="Status" htmlFor="status" error={state.fieldErrors?.status}>
        <Select id="status" name="status" defaultValue={status}>
          {POST_STATUSES.map((value) => (
            <option key={value} value={value}>
              {humanizePostStatusLabel(value)}
            </option>
          ))}
        </Select>
      </Field>
      {state.status === "error" && state.message ? (
        <p className="text-caption text-danger" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" && state.message ? (
        <p className="text-caption text-brass" role="status">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving" : mode === "create" ? "Create entry" : "Save changes"}
      </Button>
    </form>
  );
}
