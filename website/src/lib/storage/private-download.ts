import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError } from "@/lib/errors";
import { getPrivateObject } from "@/lib/storage/private-object";

export const PRIVATE_DOWNLOAD_TTL_MS = 15 * 60 * 1000;

export type PrivateDownloadPayload = {
  mediaId: string;
  key: string;
  exp: number;
};

export type PrivateMediaRecord = {
  key: string;
  filename: string;
  mimeType: string;
  visibility: string;
};

export type PrivateDownloadFile = {
  body: Uint8Array;
  filename: string;
  mimeType: string;
};

function downloadSecret(explicit?: string): string | null {
  const secret = explicit ?? process.env.AUTH_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

function signPayload(payloadB64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

export function signPrivateDownloadToken(input: {
  mediaId: string;
  key: string;
  now?: number;
  ttlMs?: number;
  secret?: string;
}): string {
  const secret = downloadSecret(input.secret);
  if (!secret) {
    throw new AppError("Download signing is not configured.", "STORAGE_UNAVAILABLE", 503, false);
  }
  if (!input.key.startsWith("private/")) {
    throw new AppError("Invalid storage key.", "STORAGE_KEY", 400, false);
  }

  const now = input.now ?? Date.now();
  const payload: PrivateDownloadPayload = {
    mediaId: input.mediaId,
    key: input.key,
    exp: now + (input.ttlMs ?? PRIVATE_DOWNLOAD_TTL_MS),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${payloadB64}.${signPayload(payloadB64, secret)}`;
}

export function verifyPrivateDownloadToken(
  token: string,
  input?: { now?: number; secret?: string },
): PrivateDownloadPayload | null {
  const secret = downloadSecret(input?.secret);
  if (!secret) {
    return null;
  }

  const separator = token.lastIndexOf(".");
  if (separator <= 0 || separator === token.length - 1) {
    return null;
  }

  const payloadB64 = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = signPayload(payloadB64, secret);
  const actualBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("mediaId" in parsed) ||
      !("key" in parsed) ||
      !("exp" in parsed)
    ) {
      return null;
    }

    const payload = parsed as PrivateDownloadPayload;
    if (
      typeof payload.mediaId !== "string" ||
      typeof payload.key !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    if (!payload.key.startsWith("private/") || payload.key.includes("..")) {
      return null;
    }

    const now = input?.now ?? Date.now();
    if (now >= payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function loadPrivateDownload(
  token: string,
  deps: {
    lookupMedia: (id: string) => Promise<PrivateMediaRecord | null>;
    secret?: string;
    now?: number;
    getObject?: typeof getPrivateObject;
  },
): Promise<PrivateDownloadFile | null> {
  const payload = verifyPrivateDownloadToken(token, { secret: deps.secret, now: deps.now });
  if (!payload) {
    return null;
  }

  const media = await deps.lookupMedia(payload.mediaId);
  if (!media || media.visibility !== "PRIVATE" || media.key !== payload.key) {
    return null;
  }

  const object = await (deps.getObject ?? getPrivateObject)(media.key);
  if (!object) {
    return null;
  }

  return {
    body: object.body,
    filename: media.filename,
    mimeType: media.mimeType,
  };
}
