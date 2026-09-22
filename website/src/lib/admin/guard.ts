import "server-only";

import { redirect } from "next/navigation";
import { getCurrentActor } from "@/lib/auth/current-actor";
import { canViewAdmin } from "@/lib/auth/permissions";
import type { Actor } from "@/lib/auth/session";
import type { Role } from "@/types/domain";

export async function requireAdminPage(
  nextPath: string,
  capability?: (role: Role) => boolean,
): Promise<Actor> {
  const actor = await getCurrentActor();
  if (!actor || !canViewAdmin(actor.role)) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (capability && !capability(actor.role)) {
    redirect("/admin/forbidden");
  }
  return actor;
}
