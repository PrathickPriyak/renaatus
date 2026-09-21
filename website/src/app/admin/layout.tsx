import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentActor } from "@/lib/auth/current-actor";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const actor = await getCurrentActor();
  if (!actor) {
    redirect("/login?next=/admin");
  }

  return <div className="bg-ink min-h-full">{children}</div>;
}
