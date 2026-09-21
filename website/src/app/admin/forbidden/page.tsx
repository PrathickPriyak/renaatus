import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/design-system/components/button";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Access denied",
  robots: { index: false, follow: false },
};

export default async function AdminForbiddenPage() {
  await requireAdminPage("/admin/forbidden");

  return (
    <div className="max-w-xl">
      <AdminPageHeader
        eyebrow="Forbidden"
        title="You do not have access to that page."
        description="Your role can use the dashboard and enquiry inbox. Journal and media tools are limited to editors and super administrators."
      />
      <Button asChild className="mt-8">
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
