import "server-only";

import { ZodError } from "zod";
import { AppError, ValidationError, toPublicError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { ActionResult } from "@/types";

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
      return { ok: false, error: message, code: "VALIDATION_ERROR" };
    }

    if (error instanceof ValidationError || error instanceof AppError) {
      const publicError = toPublicError(error);
      logger.warn("action_rejected", { name, code: publicError.code });
      return {
        ok: false,
        error: publicError.message,
        code: publicError.code,
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
