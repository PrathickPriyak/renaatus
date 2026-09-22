import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { env } from "@/lib/env/server";
import { AppError } from "@/lib/errors";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = env.DATABASE_URL;
  if (!connectionString) {
    throw new AppError(
      "Database is not configured.",
      "DATABASE_UNAVAILABLE",
      503,
      false,
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Server-only Prisma Client. Browser bundles cannot import this module.
 * Credentials are read from process.env on the server — never NEXT_PUBLIC_*.
 */
export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export async function checkDatabaseConnection(): Promise<void> {
  const db = getDb();
  await db.$queryRaw`SELECT 1`;
}

export type DatabaseClient = PrismaClient;
