import { NextResponse } from "next/server";
import { toPublicError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { PRIVATE_ROBOTS_HEADER_VALUE } from "@/lib/seo/robots";

const privateJsonHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": PRIVATE_ROBOTS_HEADER_VALUE,
};

export function jsonOk<T>(data: T, status = 200): NextResponse<{ ok: true } & T> {
  return NextResponse.json({ ok: true, ...data }, { status, headers: privateJsonHeaders });
}

export function jsonError(message: string, status = 400, code = "BAD_REQUEST") {
  return NextResponse.json(
    { ok: false, error: message, code },
    { status, headers: privateJsonHeaders },
  );
}

export function jsonFromUnknownError(error: unknown, context?: Record<string, unknown>) {
  logger.exception("request_failed", error, context);
  const publicError = toPublicError(error);
  return jsonError(publicError.message, publicError.status, publicError.code);
}
