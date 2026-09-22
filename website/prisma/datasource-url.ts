/**
 * Prisma CLI datasource URL. Never hardcode credentials — copy website/.env.example
 * to website/.env.local (gitignored) and set DATABASE_URL / DIRECT_URL there.
 *
 * `prisma generate` (postinstall) only needs a syntactically valid URL. Migrations,
 * seed, and the app still require a real DATABASE_URL via `readDatabaseUrl()`.
 */
export const PRISMA_CLI_PLACEHOLDER_URL =
  "postgresql://127.0.0.1:5432/prisma_generate_placeholder";

export function resolvePrismaDatasourceUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  return env.DIRECT_URL?.trim() || env.DATABASE_URL?.trim() || PRISMA_CLI_PLACEHOLDER_URL;
}
