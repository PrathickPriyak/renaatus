import { randomBytes } from "node:crypto";
import type { PrismaClient } from "../../../generated/prisma/client";
import type { Role } from "@/types/domain";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS };

export type Actor = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export function sessionCookieOptions(expires: Date): {
  httpOnly: true;
  sameSite: "lax";
  path: "/";
  secure: boolean;
  expires: Date;
} {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires,
  };
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function readSessionTokenFromRequest(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) {
    return null;
  }

  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const separator = trimmed.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const name = trimmed.slice(0, separator);
    if (name !== SESSION_COOKIE_NAME) {
      continue;
    }
    const value = trimmed.slice(separator + 1);
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  return null;
}

export async function createUserSession(
  db: PrismaClient,
  userId: string,
  now = Date.now(),
): Promise<{ token: string; expires: Date }> {
  const token = createSessionToken();
  const expires = new Date(now + SESSION_MAX_AGE_MS);
  await db.session.create({
    data: {
      sessionToken: token,
      userId,
      expires,
    },
  });
  return { token, expires };
}

export async function getActorBySessionToken(
  db: PrismaClient,
  token: string | null | undefined,
  now = Date.now(),
): Promise<Actor | null> {
  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { sessionToken: token },
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  if (!session || session.expires.getTime() <= now) {
    if (session && session.expires.getTime() <= now) {
      await db.session.delete({ where: { sessionToken: token } }).catch(() => undefined);
    }
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

export async function getActorFromRequest(
  db: PrismaClient,
  request: Request,
  now = Date.now(),
): Promise<Actor | null> {
  return getActorBySessionToken(db, readSessionTokenFromRequest(request), now);
}

export async function destroyUserSession(db: PrismaClient, token: string): Promise<void> {
  await db.session.deleteMany({ where: { sessionToken: token } });
}
