import { ZodError } from "zod";
import { AppError, ValidationError, toPublicError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { ActionResult } from "@/types";

function fieldErrorsFrom(error: unknown): Record<string, string> | undefined {
  if (error instanceof ValidationError && error.fields && Object.keys(error.fields).length > 0) {
    return error.fields;
  }

  const zod =
    error instanceof ZodError
      ? error
      : error instanceof ValidationError && error.cause instanceof ZodError
        ? error.cause
        : null;

  if (!zod) {
    return undefined;
  }

  const fieldErrors: Record<string, string> = {};
  for (const issue of zod.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && fieldErrors[key] === undefined) {
      fieldErrors[key] = issue.message;
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export async function runAction<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? "Invalid input.";
      logger.warn("action_validation_failed", { name, issueCount: error.issues.length });
      return { ok: false, error: message, code: "VALIDATION_ERROR", fieldErrors: fieldErrorsFrom(error) };
    }

    if (error instanceof ValidationError || error instanceof AppError) {
      const publicError = toPublicError(error);
      logger.warn("action_rejected", { name, code: publicError.code });
      return {
        ok: false,
        error: publicError.message,
        code: publicError.code,
        fieldErrors: fieldErrorsFrom(error),
      };
    }

    logger.exception("action_failed", error, { name });
    const publicError = toPublicError(error);
    return {
      ok: false,
      error: publicError.message,
      code: publicError.code,
    };
  }
}

export { fieldErrorsFrom };
