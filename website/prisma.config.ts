import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";
import { resolvePrismaDatasourceUrl } from "./prisma/datasource-url";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

/**
 * Prisma CLI configuration (migrate, generate, studio, seed).
 *
 * Runtime Prisma Client uses DATABASE_URL via the pg adapter in `src/lib/db.ts`.
 * Never commit DATABASE_URL values. Existing process env wins over `.env.local` and `.env`.
 * If those files are missing, generate uses a password-less placeholder URL.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: resolvePrismaDatasourceUrl(),
  },
});
