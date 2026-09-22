import type { PrismaClient } from "../../../generated/prisma/client";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createUserSession, type Actor } from "@/lib/auth/session";
import { UnauthorizedError } from "@/lib/errors";
import { consumeLoginRateLimit } from "@/lib/security/rate-limit";
import { emailSchema } from "@/lib/validations/common";
import { z } from "zod";

export const staffLoginSchema = z.strictObject({
  email: emailSchema,
  password: z
    .string({ error: "Please enter your password." })
    .min(1, "Please enter your password.")
    .max(200, "Password is too long."),
  next: z.string().max(200).optional(),
});

export function safeAdminNextPath(value: string | null | undefined): string {
  if (!value) {
    return "/admin";
  }
  const next = value.trim();
  if (!next.startsWith("/admin")) {
    return "/admin";
  }
  if (next.startsWith("//") || next.includes("://") || next.includes("\\")) {
    return "/admin";
  }
  if (next !== "/admin" && !next.startsWith("/admin/")) {
    return "/admin";
  }
  return next;
}

const INVALID_CREDENTIALS = "Invalid email or password.";
const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=65536,p=4,t=3$T6Nx+JJK7amyClSXC3+JLQ$8eo0/Th6Bbk25zLubcxXVtZWZ5BMajEZTUbsJfic0Qg";

export async function authenticateStaff(
  db: PrismaClient,
  input: {
    email: string;
    password: string;
    ip: string;
    now?: () => number;
  },
): Promise<{ actor: Actor; token: string; expires: Date }> {
  const email = input.email.trim().toLowerCase();
  await consumeLoginRateLimit({ ip: input.ip, email, now: input.now });
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash) {
    await verifyPassword(DUMMY_PASSWORD_HASH, input.password);
    throw new UnauthorizedError(INVALID_CREDENTIALS);
  }

  const matches = await verifyPassword(user.passwordHash, input.password);
  if (!matches) {
    throw new UnauthorizedError(INVALID_CREDENTIALS);
  }

  const session = await createUserSession(db, user.id, input.now?.() ?? Date.now());
  return {
    actor: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token: session.token,
    expires: session.expires,
  };
}

export async function createStaffPassword(password: string): Promise<string> {
  if (password.length < 12) {
    throw new Error("Admin password must be at least 12 characters.");
  }
  return hashPassword(password);
}
