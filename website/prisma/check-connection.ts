import { loadPrismaEnv } from "./load-env";
import { createCliPrismaClient, readDatabaseUrl } from "./cli-client";

loadPrismaEnv();

async function main(): Promise<void> {
  const db = createCliPrismaClient(readDatabaseUrl());

  try {
    const rows = await db.$queryRaw<Array<{ ok: number }>>`SELECT 1 AS ok`;
    const ok = rows[0]?.ok === 1;
    if (!ok) {
      throw new Error("Database ping did not return 1.");
    }
    console.log("Database connection ok.");
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown database error.";
  console.error(message);
  process.exit(1);
});
