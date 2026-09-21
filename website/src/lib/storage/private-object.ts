import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { AppError } from "@/lib/errors";
import {
  deleteR2Object,
  getR2Object,
  isPrivateR2Configured,
  putR2Object,
} from "@/lib/storage/r2";

const LOCAL_BUCKET = "local-private";

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
 * Stores a private object. Development uses `.uploads/` when R2 is not configured.
 * Production requires R2 and never writes resume bytes to the app disk.
 * Public URLs are never returned.
 */
export async function putPrivateObject(input: {
  key: string;
  body: Uint8Array;
  mimeType: string;
}): Promise<{ bucket: string; key: string }> {
  resolvePrivateObjectPath(input.key);

  if (isPrivateR2Configured()) {
    return putR2Object(input);
  }

  if (process.env.APP_ENV === "production") {
    throw new AppError(
      "File storage is not configured.",
      "STORAGE_UNAVAILABLE",
      503,
      false,
    );
  }

  const destination = resolvePrivateObjectPath(input.key);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, input.body);

  return {
    bucket: LOCAL_BUCKET,
    key: input.key,
  };
}

export async function getPrivateObject(key: string): Promise<{ body: Uint8Array } | null> {
  resolvePrivateObjectPath(key);

  if (isPrivateR2Configured()) {
    return getR2Object(key);
  }

  try {
    const body = await readFile(resolvePrivateObjectPath(key));
    return { body: new Uint8Array(body) };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function deletePrivateObject(key: string): Promise<void> {
  resolvePrivateObjectPath(key);

  if (isPrivateR2Configured()) {
    await deleteR2Object(key);
    return;
  }

  try {
    await unlink(resolvePrivateObjectPath(key));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return;
    }
    throw error;
  }
}
