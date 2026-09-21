import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

/**
 * Prisma CLI configuration (migrate, generate, studio, seed).
 *
 * Runtime Prisma Client uses DATABASE_URL via the pg adapter in `src/lib/db.ts`.
 * The fallback below is a local development convention only — not a production credential.
 * Never commit real DATABASE_URL values. Existing process env wins over `.env.local` and `.env`.
 */
const datasourceUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/renaatus";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: datasourceUrl,
  },
});
