import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { AppError } from "@/lib/errors";

const LOCAL_BUCKET = "local-private";

function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_PUBLIC &&
      process.env.R2_BUCKET_PRIVATE &&
      process.env.R2_PUBLIC_BASE_URL,
  );
}

function uploadsRoot(): string {
  return path.join(process.cwd(), ".uploads");
}

export function isPrivateStorageKey(key: string): boolean {
  const normalized = key.replace(/\\/g, "/").replace(/^\/+/, "");
  return normalized.startsWith("private/");
}

function resolvePrivateObjectPath(key: string): string {
  if (!isPrivateStorageKey(key) || key.includes("\0") || key.includes("..")) {
    throw new AppError("Invalid storage key.", "STORAGE_KEY", 400, false);
  }

  const destination = path.resolve(uploadsRoot(), key);
  const root = path.resolve(uploadsRoot());
  if (!destination.startsWith(root + path.sep) && destination !== root) {
    throw new AppError("Invalid storage key.", "STORAGE_KEY", 400, false);
  }

  return destination;
}

/**
 * Stores a private object. Development uses `.uploads/`. Production requires R2.
 * Public URLs are never returned.
 */
export async function putPrivateObject(input: {
  key: string;
  body: Uint8Array;
  mimeType: string;
}): Promise<{ bucket: string; key: string }> {
  const destination = resolvePrivateObjectPath(input.key);

  if (process.env.APP_ENV === "production" && !isR2Configured()) {
    throw new AppError(
      "File storage is not configured.",
      "STORAGE_UNAVAILABLE",
      503,
      false,
    );
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, input.body);

  return {
    bucket: isR2Configured() ? (process.env.R2_BUCKET_PRIVATE ?? LOCAL_BUCKET) : LOCAL_BUCKET,
    key: input.key,
  };
}

export async function getPrivateObject(key: string): Promise<{ body: Uint8Array } | null> {
  const destination = resolvePrivateObjectPath(key);

  try {
    const body = await readFile(destination);
    return { body: new Uint8Array(body) };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return null;
    }
    throw error;
  }
}
