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
  deleteJournalPostAction,
  updateJournalPostAction,
} from "@/server/actions/admin-posts";
import { initialAdminFormState } from "@/types";
import type { PostStatus } from "@/types/domain";

type ImageOption = {
  id: string;
  filename: string;
  alt: string | null;
  publicUrl: string | null;
};

type CategoryOption = {
  id: string;
  name: string;
};

type JournalPostFormProps = {
  mode: "create" | "edit";
  postId?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  status?: PostStatus;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  categoryId?: string;
  tagNames?: string;
  featuredImageId?: string;
  ogImageId?: string;
  featured?: boolean;
  publishedAt?: string;
  categories?: CategoryOption[];
  images?: ImageOption[];
};

function dateInputValue(value?: string): string {
  if (!value) {
    return "";
  }
  return value.slice(0, 10);
}

export function JournalPostForm({
  mode,
  postId,
  title = "",
  slug = "",
  excerpt = "",
  body = "",
  status = "DRAFT",
  seoTitle = "",
  seoDescription = "",
  canonicalUrl = "",
  categoryId = "",
  tagNames = "",
  featuredImageId = "",
  ogImageId = "",
  featured = false,
  publishedAt = "",
  categories = [],
  images = [],
}: JournalPostFormProps) {
  const action = mode === "create" ? createJournalPostAction : updateJournalPostAction;
  const [state, formAction, pending] = useActionState(action, initialAdminFormState);
  const [slugValue, setSlugValue] = useState(slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="grid gap-8">
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
          hint="Public URL segment. Must be unique. Use lowercase letters, numbers, and hyphens."
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
        <Field
          label="Body"
          htmlFor="body"
          hint="Plain text with optional # headings, - lists, and [links](https://)."
          error={state.fieldErrors?.body}
        >
          <Textarea
            id="body"
            name="body"
            defaultValue={body}
            required
            rows={14}
            className="min-h-56"
          />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Status" htmlFor="status" error={state.fieldErrors?.status}>
            <Select id="status" name="status" defaultValue={status}>
              {POST_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {humanizePostStatusLabel(value)}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Published date"
            htmlFor="publishedAt"
            hint="Used on the public journal. Set automatically on first publish if blank."
            error={state.fieldErrors?.publishedAt}
          >
            <Input
              id="publishedAt"
              name="publishedAt"
              type="date"
              defaultValue={dateInputValue(publishedAt)}
            />
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Category" htmlFor="categoryId" error={state.fieldErrors?.categoryId}>
            <Select id="categoryId" name="categoryId" defaultValue={categoryId}>
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Tags"
            htmlFor="tagNames"
            hint="Comma-separated. New names are created automatically."
            error={state.fieldErrors?.tagNames}
          >
            <Input id="tagNames" name="tagNames" defaultValue={tagNames} maxLength={500} />
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Featured image"
            htmlFor="featuredImageId"
            error={state.fieldErrors?.featuredImageId}
          >
            <Select id="featuredImageId" name="featuredImageId" defaultValue={featuredImageId}>
              <option value="">No image</option>
              {images.map((image) => (
                <option key={image.id} value={image.id}>
                  {image.filename}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Open Graph image"
            htmlFor="ogImageId"
            hint="Falls back to the featured image when blank."
            error={state.fieldErrors?.ogImageId}
          >
            <Select id="ogImageId" name="ogImageId" defaultValue={ogImageId}>
              <option value="">Same as featured</option>
              {images.map((image) => (
                <option key={image.id} value={image.id}>
                  {image.filename}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <label className="flex items-center gap-3 text-sm text-cream">
          <input
            type="checkbox"
            name="featured"
            value="on"
            defaultChecked={featured}
            className="border-line bg-ink text-brass h-4 w-4 rounded-sm"
          />
          Featured on the public journal
        </label>
        <Field
          label="SEO title"
          htmlFor="seoTitle"
          hint="Defaults to the entry title."
          error={state.fieldErrors?.seoTitle}
        >
          <Input id="seoTitle" name="seoTitle" defaultValue={seoTitle} maxLength={120} />
        </Field>
        <Field
          label="SEO description"
          htmlFor="seoDescription"
          hint="Defaults to the excerpt."
          error={state.fieldErrors?.seoDescription}
        >
          <Textarea
            id="seoDescription"
            name="seoDescription"
            defaultValue={seoDescription}
            maxLength={300}
          />
        </Field>
        <Field
          label="Canonical URL"
          htmlFor="canonicalUrl"
          hint="Leave blank to use /blog/{slug}."
          error={state.fieldErrors?.canonicalUrl}
        >
          <Input
            id="canonicalUrl"
            name="canonicalUrl"
            type="url"
            defaultValue={canonicalUrl}
            maxLength={500}
          />
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

      {mode === "edit" && postId ? (
        <form
          action={deleteJournalPostAction}
          className="border-line border-t pt-6"
          onSubmit={(event) => {
            if (!confirmDelete) {
              event.preventDefault();
              setConfirmDelete(true);
            }
          }}
        >
          <input type="hidden" name="postId" value={postId} />
          <p className="text-caption text-cream-muted mb-3">
            {confirmDelete
              ? "Click delete again to permanently remove this entry."
              : "Deleting removes the entry from the public journal and the CMS."}
          </p>
          <Button type="submit" variant="secondary">
            {confirmDelete ? "Confirm delete" : "Delete entry"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
