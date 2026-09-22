import "server-only";

import {
  blankToUndefined,
  serverEnvSchema,
  type ServerEnv,
} from "@/lib/env/schema";
import { AppError } from "@/lib/errors";

function readNodeEnv(): ServerEnv["NODE_ENV"] {
  const value = process.env.NODE_ENV;
  if (value === "production" || value === "test" || value === "development") {
    return value;
  }
  return "development";
}

function readAppEnv(): ServerEnv["APP_ENV"] {
  const value = process.env.APP_ENV;
  if (value === "production" || value === "preview" || value === "development") {
    return value;
  }
  return readNodeEnv() === "production" ? "production" : "development";
}

function readServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL:
      blankToUndefined(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: blankToUndefined(
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    ),
    NODE_ENV: readNodeEnv(),
    APP_ENV: readAppEnv(),
    LOG_LEVEL: blankToUndefined(process.env.LOG_LEVEL),
    DATABASE_URL: blankToUndefined(process.env.DATABASE_URL),
    DIRECT_URL: blankToUndefined(process.env.DIRECT_URL),
    AUTH_SECRET: blankToUndefined(process.env.AUTH_SECRET),
    AUTH_URL: blankToUndefined(process.env.AUTH_URL),
    RESEND_API_KEY: blankToUndefined(process.env.RESEND_API_KEY),
    ENQUIRY_NOTIFY_EMAIL: blankToUndefined(process.env.ENQUIRY_NOTIFY_EMAIL),
    R2_ACCOUNT_ID: blankToUndefined(process.env.R2_ACCOUNT_ID),
    R2_ACCESS_KEY_ID: blankToUndefined(process.env.R2_ACCESS_KEY_ID),
    R2_SECRET_ACCESS_KEY: blankToUndefined(process.env.R2_SECRET_ACCESS_KEY),
    R2_BUCKET_PUBLIC: blankToUndefined(process.env.R2_BUCKET_PUBLIC),
    R2_BUCKET_PRIVATE: blankToUndefined(process.env.R2_BUCKET_PRIVATE),
    R2_PUBLIC_BASE_URL: blankToUndefined(process.env.R2_PUBLIC_BASE_URL),
    TURNSTILE_SECRET_KEY: blankToUndefined(process.env.TURNSTILE_SECRET_KEY),
    UPSTASH_REDIS_REST_URL: blankToUndefined(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: blankToUndefined(process.env.UPSTASH_REDIS_REST_TOKEN),
  });

  if (!parsed.success) {
    throw new Error("Invalid server environment configuration.");
  }

  return parsed.data;
}

export const env = readServerEnv();

export function isProduction(): boolean {
  return env.APP_ENV === "production";
}

export function isDevelopment(): boolean {
  return env.APP_ENV === "development";
}

export function requireEnv<K extends keyof ServerEnv>(
  key: K,
): NonNullable<ServerEnv[K]> {
  const value = env[key];
  if (value === undefined || value === "") {
    throw new AppError(
      "A required service is not configured.",
      "ENV_MISSING",
      503,
      false,
    );
  }
  return value;
}
