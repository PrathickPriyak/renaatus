import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/design-system/components/button";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function AdminNotFound() {
  return (
    <div className="max-w-xl">
      <AdminPageHeader
        eyebrow="Not found"
        title="That admin page does not exist."
        description="Return to the dashboard or open the enquiry inbox."
      />
      <Button asChild className="mt-8">
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
