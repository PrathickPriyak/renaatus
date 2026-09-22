import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

/**
 * Load server-side env files for Prisma CLI scripts. Never used in the browser.
 *
 * Precedence: existing process env > `.env.local` > `.env`.
 * Already-set variables (including APP_ENV=production) are not overwritten.
 */
export function loadPrismaEnv(): void {
  loadEnv({ path: resolve(process.cwd(), ".env.local") });
  loadEnv({ path: resolve(process.cwd(), ".env") });
}
