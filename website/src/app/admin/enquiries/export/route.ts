import { getDb } from "@/lib/db";
import { getActorFromRequest } from "@/lib/auth/session";
import { handleEnquiryExportRequest } from "@/lib/enquiry/export-http";
import { readClientIp } from "@/lib/security/ip";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const db = getDb();
  return handleEnquiryExportRequest(request, {
    db,
    getActor: () => getActorFromRequest(db, request),
    ip: readClientIp(request.headers),
  });
}
