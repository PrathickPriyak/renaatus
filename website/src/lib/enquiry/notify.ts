import { logger } from "@/lib/logger";
import { isMailConfigured, sendEnquiryMail } from "@/lib/mail";
import { staffEmailForOffice, type ContactOffice } from "@/lib/validations/enquiry";
import type { EnquiryKind } from "@/types/domain";

export type EnquiryNotification = {
  kind: EnquiryKind;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  office?: string;
  sourcePath: string;
  productSlug?: string;
  role?: string;
  hasResume?: boolean;
};

function staffRecipients(notification: EnquiryNotification): string[] {
  if (notification.kind === "CAREER") {
    return ["hr@renaatus.com"];
  }
  if (notification.kind === "PRODUCT") {
    return ["bd@renaatus.com"];
  }
  if (notification.kind === "CONTACT" && notification.office) {
    return [staffEmailForOffice(notification.office as ContactOffice)];
  }
  return ["bd@renaatus.com"];
}

function staffSubject(notification: EnquiryNotification): string {
  if (notification.kind === "CAREER") {
    return notification.role
      ? `Career application: ${notification.role}`
      : "Career application";
  }
  if (notification.kind === "PRODUCT") {
    return `Product enquiry: ${notification.productSlug ?? "Renacon"}`;
  }
  return notification.subject ?? "Website enquiry";
}

function staffBody(notification: EnquiryNotification): string {
  return [
    `Kind: ${notification.kind}`,
    `Name: ${notification.name}`,
    `Email: ${notification.email}`,
    `Phone: ${notification.phone}`,
    notification.office ? `Office: ${notification.office}` : null,
    notification.productSlug ? `Product: ${notification.productSlug}` : null,
    notification.role ? `Role: ${notification.role}` : null,
    `Source: ${notification.sourcePath}`,
    notification.hasResume ? "Resume: attached in records (private)" : null,
    "",
    notification.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export async function notifyEnquiry(notification: EnquiryNotification): Promise<void> {
  if (!isMailConfigured()) {
    logger.info("enquiry_notify_skipped", { kind: notification.kind });
    return;
  }

  try {
    await sendEnquiryMail({
      to: staffRecipients(notification),
      subject: staffSubject(notification),
      text: staffBody(notification),
    });
    await sendEnquiryMail({
      to: [notification.email],
      subject: "We received your message — Renaatus",
      text: "Thank you for contacting Renaatus. We have received your message and will respond shortly.",
    });
  } catch (error) {
    logger.exception("enquiry_notify_failed", error, { kind: notification.kind });
  }
}
