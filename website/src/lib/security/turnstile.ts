import { AppError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(input: {
  token?: string;
  ip: string;
}): Promise<void> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return;
  }

  if (!input.token) {
    throw new ValidationError("Unable to verify this request. Please try again.");
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: input.token,
      remoteip: input.ip,
    });
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      throw new AppError("Unable to verify this request.", "TURNSTILE_UNAVAILABLE", 503, true);
    }

    const payload = (await response.json()) as { success?: boolean };
    if (!payload.success) {
      throw new ValidationError("Unable to verify this request. Please try again.");
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.exception("turnstile_verify_failed", error);
    throw new AppError("Unable to verify this request.", "TURNSTILE_UNAVAILABLE", 503, true);
  }
}
