import type { PrismaClient } from "../../../generated/prisma/client";
import { requireMediaEditor } from "@/lib/admin/require-actor";
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

function publicMediaUrl(visibility: MediaVisibility, key: string): string | null {
  if (visibility !== "PUBLIC") {
    return null;
  }
  const base = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (!base) {
    return null;
  }
  return `${base.replace(/\/$/, "")}/${key}`;
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
    const { key, ...item } = row;
    return {
      ...item,
      publicUrl: publicMediaUrl(item.visibility, key),
    };
  });
}
