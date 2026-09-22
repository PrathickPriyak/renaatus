import { loadPrismaEnv } from "../prisma/load-env";
import { createCliPrismaClient, readDatabaseUrl } from "../prisma/cli-client";
import { createStaffPassword } from "../src/lib/auth/login";

loadPrismaEnv();

async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Renaatus Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  const passwordHash = await createStaffPassword(password);
  const db = createCliPrismaClient(readDatabaseUrl());

  try {
    await db.user.upsert({
      where: { email },
      update: { name, passwordHash, role: "SUPER_ADMIN" },
      create: { email, name, passwordHash, role: "SUPER_ADMIN" },
    });
    console.log(`SUPER_ADMIN ready for ${email}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Failed to create admin.";
  console.error(message);
  process.exitCode = 1;
});
