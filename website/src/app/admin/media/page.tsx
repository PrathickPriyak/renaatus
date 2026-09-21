import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatAdminDateTime, formatByteSize } from "@/lib/admin/format";
import { requireAdminPage } from "@/lib/admin/guard";
import { listMediaForAdmin } from "@/lib/admin/media";
import { canManageMedia } from "@/lib/auth/permissions";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Media",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const actor = await requireAdminPage("/admin/media", canManageMedia);
  const media = await listMediaForAdmin(getDb(), actor);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Library"
        title="Media"
        description="Public files may show a preview URL. Private objects never expose storage keys or public links."
      />

      {media.length === 0 ? (
        <p className="text-body text-cream-muted mt-10">No media files are stored yet.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {media.map((item) => (
            <li key={item.id} className="border-line overflow-hidden rounded-sm border">
              <div className="bg-ink-soft relative aspect-[16/10]">
                {item.publicUrl && item.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.publicUrl}
                    alt={item.alt ?? ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center">
                    <p className="text-caption text-cream-muted">
                      {item.visibility === "PRIVATE" ? "Private file" : item.mimeType}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-cream truncate text-sm">{item.filename}</p>
                <p className="text-caption text-cream-muted mt-2">
                  {item.visibility === "PRIVATE" ? "Private" : "Public"} ·{" "}
                  {formatByteSize(item.byteSize)} · {formatAdminDateTime(item.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
