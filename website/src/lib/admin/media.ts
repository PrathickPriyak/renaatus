import type { PrismaClient } from "../../../generated/prisma/client";
import { requireMediaEditor } from "@/lib/admin/require-actor";
import { publicMediaDisplayUrl } from "@/lib/blog/media-url";
import type { Actor } from "@/lib/auth/session";
import type { MediaVisibility } from "@/types/domain";

export type AdminMediaItem = {
  id: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  visibility: MediaVisibility;
  createdAt: Date;
  publicUrl: string | null;
};

function publicMediaUrl(
  visibility: MediaVisibility,
  key: string,
  bucket: string,
): string | null {
  return publicMediaDisplayUrl({ visibility, key, bucket });
}

export async function listMediaForAdmin(
  db: PrismaClient,
  actor: Actor | null,
): Promise<AdminMediaItem[]> {
  requireMediaEditor(actor);

  const rows = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      key: true,
      bucket: true,
      filename: true,
      mimeType: true,
      byteSize: true,
      width: true,
      height: true,
      alt: true,
      visibility: true,
      createdAt: true,
    },
  });

  return rows.map((row) => {
    const { key, bucket, ...item } = row;
    return {
      ...item,
      publicUrl: publicMediaUrl(item.visibility, key, bucket),
    };
  });
}
