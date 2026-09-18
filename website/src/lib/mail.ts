import "server-only";

import { env, requireEnv } from "@/lib/env/server";
import { AppError } from "@/lib/errors";

export type MailConfig = {
  apiKey: string;
  notifyEmail: string;
};

export function isMailConfigured(): boolean {
  return Boolean(env.RESEND_API_KEY && env.ENQUIRY_NOTIFY_EMAIL);
}

export function getMailConfig(): MailConfig {
  if (!isMailConfigured()) {
    throw new AppError("Email is not configured.", "MAIL_UNAVAILABLE", 503, false);
  }

  return {
    apiKey: requireEnv("RESEND_API_KEY"),
    notifyEmail: requireEnv("ENQUIRY_NOTIFY_EMAIL"),
  };
}
