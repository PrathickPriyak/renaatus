import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentActor } from "@/lib/auth/current-actor";
import { canViewAdmin } from "@/lib/auth/permissions";
import { adminNavItems } from "@/lib/admin/nav";
import { humanizeRoleLabel } from "@/lib/admin/format";
import { pageMetadata } from "@/lib/seo/metadata";
import type { ReactNode } from "react";

export const metadata: Metadata = pageMetadata({
  path: "/admin",
  title: "Admin",
  description: "Staff dashboard for authorised Renaatus administrators.",
  index: false,
});

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const actor = await getCurrentActor();
  if (!actor || !canViewAdmin(actor.role)) {
    redirect("/login?next=/admin");
  }

  return (
    <AdminShell
      actorName={actor.name}
      actorEmail={actor.email}
      actorRole={humanizeRoleLabel(actor.role)}
      items={adminNavItems(actor.role)}
    >
      {children}
    </AdminShell>
  );
}
