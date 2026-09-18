import { DEFAULT_OFFICE_EMAIL } from "@/lib/constants";
import { jsonError, jsonFromUnknownError, jsonOk } from "@/lib/http";
import { logger } from "@/lib/logger";
import { contactEnquirySchema } from "@/lib/validations/enquiry";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  const parsed = contactEnquirySchema.safeParse(payload);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    return jsonError(message);
  }

  const enquiry = parsed.data;

  if (enquiry.honeypot) {
    logger.warn("enquiry_honeypot_triggered");
    return jsonOk({ accepted: true });
  }

  try {
    const officeEmail = enquiry.officeEmail ?? DEFAULT_OFFICE_EMAIL;
    const composed = [
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      enquiry.phone ? `Phone: ${enquiry.phone}` : null,
      "",
      enquiry.message,
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    const mailto = `mailto:${officeEmail}?subject=${encodeURIComponent(enquiry.subject)}&body=${encodeURIComponent(composed)}`;

    logger.info("enquiry_validated", { kind: enquiry.kind });
    return jsonOk({ mailto });
  } catch (error) {
    return jsonFromUnknownError(error, { kind: enquiry.kind });
  }
}
