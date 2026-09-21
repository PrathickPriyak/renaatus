import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

/**
 * Prisma Client for CLI scripts (migrate helpers, seed, connection check).
 * The Next.js app must use `src/lib/db.ts`, which is gated with `server-only`.
 */
export function createCliPrismaClient(connectionString: string): PrismaClient {
  if (!connectionString.trim()) {
    throw new Error("DATABASE_URL is required.");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: ["error"],
  });
}

export function readDatabaseUrl(): string {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url || !url.trim()) {
    throw new Error("DATABASE_URL is not set. Copy website/.env.example to .env.local.");
  }
  return url;
}
