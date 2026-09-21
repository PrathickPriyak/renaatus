import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { loadPrismaEnv } from "../../../prisma/load-env";
import { createCliPrismaClient, readDatabaseUrl } from "../../../prisma/cli-client";
import { authenticateStaff } from "@/lib/auth/login";
import { hashPassword } from "@/lib/auth/password";
import { getActorBySessionToken } from "@/lib/auth/session";
import { RateLimitError, UnauthorizedError } from "@/lib/errors";
import { resetMemoryRateLimitStore } from "@/lib/security/rate-limit";

loadPrismaEnv();

const db = createCliPrismaClient(readDatabaseUrl());
const stamp = Date.now();
const email = `export.login.${stamp}@renaatus.com`;
const password = "correct-horse-export-login";
let userId = "";

describe("authenticateStaff", () => {
  before(async () => {
    resetMemoryRateLimitStore();
    const user = await db.user.create({
      data: {
        email,
        name: "Login Test Admin",
        role: "SUPER_ADMIN",
        passwordHash: await hashPassword(password),
      },
    });
    userId = user.id;
  });

  after(async () => {
    if (userId) {
      await db.session.deleteMany({ where: { userId } });
      await db.user.deleteMany({ where: { id: userId } });
    }
    await db.$disconnect();
  });

  it("creates a database session for a valid administrator password", async () => {
    const result = await authenticateStaff(db, {
      email,
      password,
      ip: "203.0.113.90",
    });
    assert.equal(result.actor.id, userId);
    assert.equal(result.actor.role, "SUPER_ADMIN");
    const actor = await getActorBySessionToken(db, result.token);
    assert.ok(actor);
    assert.equal(actor.id, userId);
  });

  it("rejects an unknown email and a wrong password with the same error", async () => {
    await assert.rejects(
      () =>
        authenticateStaff(db, {
          email: `missing.${stamp}@renaatus.com`,
          password,
          ip: "203.0.113.91",
        }),
      (error: unknown) => error instanceof UnauthorizedError,
    );
    await assert.rejects(
      () =>
        authenticateStaff(db, {
          email,
          password: "wrong-password-value",
          ip: "203.0.113.91",
        }),
      (error: unknown) => error instanceof UnauthorizedError,
    );
  });

  it("rate limits repeated login attempts from one IP", async () => {
    resetMemoryRateLimitStore();
    const ip = "203.0.113.92";
    for (let index = 0; index < 5; index += 1) {
      await assert.rejects(
        () => authenticateStaff(db, { email, password: "nope", ip }),
        (error: unknown) => error instanceof UnauthorizedError,
      );
    }
    await assert.rejects(
      () => authenticateStaff(db, { email, password, ip }),
      (error: unknown) => error instanceof RateLimitError,
    );
  });
});
