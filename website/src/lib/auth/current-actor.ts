import "server-only";

import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import {
  getActorBySessionToken,
  SESSION_COOKIE_NAME,
  type Actor,
} from "@/lib/auth/session";

export async function getCurrentActor(): Promise<Actor | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return getActorBySessionToken(getDb(), token ?? null);
}
