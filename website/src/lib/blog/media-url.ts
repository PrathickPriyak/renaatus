import type { MediaVisibility } from "@/types/domain";

export function publicMediaDisplayUrl(input: {
  visibility: MediaVisibility;
  key: string;
  bucket: string;
}): string | null {
  if (input.visibility !== "PUBLIC") {
    return null;
  }

  const base = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (base) {
    return `${base.replace(/\/$/, "")}/${input.key.replace(/^\//, "")}`;
  }

  if (input.bucket === "local-public" || input.key.startsWith("images/")) {
    return `/assets/${input.key.replace(/^\//, "")}`;
  }

  return null;
}
