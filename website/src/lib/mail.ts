import "server-only";

import { env, requireEnv } from "@/lib/env/server";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

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

export type EnquiryMailPayload = {
  to: string[];
  subject: string;
  text: string;
};

export async function sendEnquiryMail(payload: EnquiryMailPayload): Promise<void> {
  if (!isMailConfigured()) {
    logger.info("enquiry_mail_skipped", { reason: "unconfigured", subject: payload.subject });
    return;
  }

  const config = getMailConfig();
  const recipients = [...new Set(payload.to.filter(Boolean))];
  if (recipients.length === 0) {
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Renaatus <${config.notifyEmail}>`,
      to: recipients,
      subject: payload.subject,
      text: payload.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    logger.warn("enquiry_mail_failed", { status: response.status, detail: detail.slice(0, 200) });
  }
}
