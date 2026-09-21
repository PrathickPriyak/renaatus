import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { loadPrivateDownload } from "@/lib/storage/private-download";

function notFound(): NextResponse {
  return new NextResponse(null, {
    status: 404,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function attachmentFilename(filename: string): string {
  const safe = filename.replace(/["\\]/g, "").replace(/[^\x20-\x7E]/g, "_");
  return safe || "resume";
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  if (!token) {
    return notFound();
  }

  const db = getDb();
  const file = await loadPrivateDownload(token, {
    lookupMedia: async (id) => {
      const media = await db.media.findUnique({ where: { id } });
      if (!media) {
        return null;
      }
      return {
        key: media.key,
        filename: media.filename,
        mimeType: media.mimeType,
        visibility: media.visibility,
      };
    },
  });

  if (!file) {
    return notFound();
  }

  return new NextResponse(Buffer.from(file.body), {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename="${attachmentFilename(file.filename)}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Length": String(file.body.byteLength),
    },
  });
}
