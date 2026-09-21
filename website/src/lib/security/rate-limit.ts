import { RateLimitError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { hashClientIp } from "@/lib/security/ip";

export const ENQUIRY_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
} as const;

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  now?: () => number;
};

type MemoryEntry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, MemoryEntry>();

export function resetMemoryRateLimitStore(): void {
  memoryStore.clear();
}

export async function consumeMemoryRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<void> {
  const now = options.now?.() ?? Date.now();
  const current = memoryStore.get(key);

  if (!current || current.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + options.windowMs });
    return;
  }

  if (current.count >= options.limit) {
    throw new RateLimitError();
  }

  current.count += 1;
}

async function consumeUpstashRateLimit(key: string, options: RateLimitOptions): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    await consumeMemoryRateLimit(key, options);
    return;
  }

  const windowSec = Math.max(1, Math.ceil(options.windowMs / 1000));
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, windowSec, "NX"],
    ]),
  });

  if (!response.ok) {
    logger.warn("rate_limit_upstash_failed", { status: response.status });
    await consumeMemoryRateLimit(key, options);
    return;
  }

  const payload = (await response.json()) as Array<{ result?: number }>;
  const count = payload[0]?.result ?? 0;
  if (count > options.limit) {
    throw new RateLimitError();
  }
}

export async function consumeEnquiryRateLimits(input: {
  ip: string;
  email: string;
  now?: () => number;
}): Promise<void> {
  const options: RateLimitOptions = {
    limit: ENQUIRY_RATE_LIMIT.limit,
    windowMs: ENQUIRY_RATE_LIMIT.windowMs,
    now: input.now,
  };
  const ipKey = `enquiry:ip:${hashClientIp(input.ip)}`;
  const emailKey = `enquiry:email:${input.email.trim().toLowerCase()}`;

  const consume = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? consumeUpstashRateLimit
    : consumeMemoryRateLimit;

  await consume(ipKey, options);
  await consume(emailKey, options);
}
