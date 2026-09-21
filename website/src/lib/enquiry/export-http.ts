import { NextResponse } from "next/server";
import type { PrismaClient } from "../../../generated/prisma/client";
import type { Actor } from "@/lib/auth/session";
import { exportEnquiries, parseEnquiryExportFilters } from "@/lib/enquiry/export";
import { AppError } from "@/lib/errors";
import { jsonError, jsonFromUnknownError } from "@/lib/http";
import { readClientIp } from "@/lib/security/ip";

function attachmentFilename(filename: string): string {
  return (
    filename.replace(/["\\]/g, "").replace(/[^\x20-\x7E]/g, "_") ||
    "renaatus-enquiries.xlsx"
  );
}

export async function handleEnquiryExportRequest(
  request: Request,
  deps: {
    db: PrismaClient;
    getActor: () => Promise<Actor | null>;
    ip?: string;
  },
): Promise<Response> {
  try {
    const actor = await deps.getActor();
    const filters = parseEnquiryExportFilters(new URL(request.url).searchParams);
    const exported = await exportEnquiries({
      db: deps.db,
      actor,
      filters,
    });

    if (actor) {
      await deps.db.auditLog.create({
        data: {
          userId: actor.id,
          action: "enquiry.export",
          entityType: "Enquiry",
          metadata: {
            kinds: filters.kinds,
            statuses: filters.statuses,
            from: filters.from?.toISOString() ?? null,
            to: filters.to?.toISOString() ?? null,
            ids: filters.ids,
            rowCount: exported.rowCount,
          },
          ip: deps.ip ?? readClientIp(request.headers),
        },
      });
    }

    return new NextResponse(new Uint8Array(exported.buffer), {
      status: 200,
      headers: {
        "Content-Type": exported.contentType,
        "Content-Disposition": `attachment; filename="${attachmentFilename(exported.filename)}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof AppError && error.expose) {
      return jsonError(error.message, error.status, error.code);
    }
    return jsonFromUnknownError(error, { route: "admin.enquiries.export" });
  }
}
