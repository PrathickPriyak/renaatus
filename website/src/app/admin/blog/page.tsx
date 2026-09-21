import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminPageHeader";
import { Button } from "@/design-system/components/button";
import { formatAdminDateTime, humanizePostStatusLabel } from "@/lib/admin/format";
import { requireAdminPage } from "@/lib/admin/guard";
import { listJournalPosts } from "@/lib/admin/posts";
import { canManageBlog } from "@/lib/auth/permissions";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Journal",
  robots: { index: false, follow: false },
};

function postTone(status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED") {
  return status === "PUBLISHED" ? "published" : "draft";
}

export default async function AdminBlogPage() {
  const actor = await requireAdminPage("/admin/blog", canManageBlog);
  const posts = await listJournalPosts(getDb(), actor);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Journal"
        title="Entries"
        description="Draft and publish notes for the public journal. Do not invent company news."
        actions={
          <Button asChild>
            <Link href="/admin/blog/new">New entry</Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <p className="text-body text-cream-muted mt-10">No journal entries yet.</p>
      ) : (
        <>
          <ul className="mt-8 grid gap-3 md:hidden">
            {posts.map((post) => (
              <li key={post.id} className="border-line rounded-sm border p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-cream text-sm">{post.title}</p>
                  <StatusBadge
                    label={humanizePostStatusLabel(post.status)}
                    tone={postTone(post.status)}
                  />
                </div>
                <p className="text-caption text-cream-muted mt-2">{post.slug}</p>
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="text-caption text-brass mt-4 inline-block tracking-[0.12em] uppercase"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-line mt-8 hidden overflow-x-auto rounded-sm border md:block">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-ink-soft text-caption text-cream-muted tracking-[0.12em] uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-line border-t">
                    <td className="px-4 py-3">
                      <p className="text-cream">{post.title}</p>
                      <p className="text-caption text-cream-muted mt-1">{post.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={humanizePostStatusLabel(post.status)}
                        tone={postTone(post.status)}
                      />
                    </td>
                    <td className="text-cream-muted px-4 py-3 whitespace-nowrap">
                      {formatAdminDateTime(post.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="text-caption text-brass tracking-[0.12em] uppercase"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
