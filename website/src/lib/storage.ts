import "server-only";

import { env, requireEnv } from "@/lib/env/server";
import { AppError } from "@/lib/errors";

export type ObjectStorageConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBucket: string;
  privateBucket: string;
  publicBaseUrl: string;
};

export function isObjectStorageConfigured(): boolean {
  return Boolean(
    env.R2_ACCOUNT_ID &&
      env.R2_ACCESS_KEY_ID &&
      env.R2_SECRET_ACCESS_KEY &&
      env.R2_BUCKET_PUBLIC &&
      env.R2_BUCKET_PRIVATE &&
      env.R2_PUBLIC_BASE_URL,
  );
}

export function getObjectStorageConfig(): ObjectStorageConfig {
  if (!isObjectStorageConfigured()) {
    throw new AppError(
      "Object storage is not configured.",
      "STORAGE_UNAVAILABLE",
      503,
      false,
    );
  }

  return {
    accountId: requireEnv("R2_ACCOUNT_ID"),
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    publicBucket: requireEnv("R2_BUCKET_PUBLIC"),
    privateBucket: requireEnv("R2_BUCKET_PRIVATE"),
    publicBaseUrl: requireEnv("R2_PUBLIC_BASE_URL"),
  };
}

export function publicAssetUrl(key: string): string {
  const base = getObjectStorageConfig().publicBaseUrl.replace(/\/$/, "");
  return `${base}/${key.replace(/^\//, "")}`;
}
