import { createHash } from "node:crypto";
import { AppError } from "@/lib/errors";

function firstHeaderValue(value: string | null): string | undefined {
  const hop = value?.split(",")[0]?.trim();
  return hop ? hop.slice(0, 64) : undefined;
}

export function readClientIp(headerList: Headers): string {
  const platform =
    firstHeaderValue(headerList.get("x-vercel-forwarded-for")) ??
    firstHeaderValue(headerList.get("cf-connecting-ip")) ??
    firstHeaderValue(headerList.get("x-real-ip"));
  if (platform) {
    return platform;
  }

  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
    const trusted = hops[hops.length - 1];
    if (trusted) {
      return trusted.slice(0, 64);
    }
  }

  return "0.0.0.0";
}

export function hashClientIp(ip: string): string {
  const salt = process.env.AUTH_SECRET?.trim();
  if (!salt) {
    throw new AppError("A required service is not configured.", "ENV_MISSING", 503, false);
  }
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
