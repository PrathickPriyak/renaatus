import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { JournalPostForm } from "@/components/admin/JournalPostForm";
import { requireAdminPage } from "@/lib/admin/guard";
import { canManageBlog } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "New journal entry",
  robots: { index: false, follow: false },
};

export default async function AdminNewBlogPage() {
  await requireAdminPage("/admin/blog/new", canManageBlog);

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        eyebrow="Journal"
        title="New entry"
        description="Saved as structured body content. Only published entries belong on the public journal."
      />
      <div className="border-line bg-panel/60 mt-8 rounded-sm border p-5 md:p-8">
        <JournalPostForm mode="create" />
      </div>
    </div>
  );
}
