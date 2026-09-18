import { NextResponse } from "next/server";
import { toPublicError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export function jsonOk<T>(data: T, status = 200): NextResponse<{ ok: true } & T> {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function jsonError(message: string, status = 400, code = "BAD_REQUEST") {
  return NextResponse.json({ ok: false, error: message, code }, { status });
}

export function jsonFromUnknownError(error: unknown, context?: Record<string, unknown>) {
  logger.exception("request_failed", error, context);
  const publicError = toPublicError(error);
  return jsonError(publicError.message, publicError.status, publicError.code);
}
