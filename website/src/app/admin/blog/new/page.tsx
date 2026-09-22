import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { JournalPostForm } from "@/components/admin/JournalPostForm";
import { requireAdminPage } from "@/lib/admin/guard";
import { listJournalEditorOptions } from "@/lib/admin/posts";
import { canManageBlog } from "@/lib/auth/permissions";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "New journal entry",
  robots: { index: false, follow: false },
};

export default async function AdminNewBlogPage() {
  const actor = await requireAdminPage("/admin/blog/new", canManageBlog);
  const options = await listJournalEditorOptions(getDb(), actor);

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        eyebrow="Journal"
        title="New entry"
        description="Saved as structured body content. Only published entries belong on the public journal."
      />
      <div className="border-line bg-panel/60 mt-8 rounded-sm border p-5 md:p-8">
        <JournalPostForm
          mode="create"
          categories={options.categories}
          images={options.images}
        />
      </div>
    </div>
  );
}
