"use server";

import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { submitEnquiry, type EnquirySubmitInput } from "@/lib/enquiry/submit";
import { logger } from "@/lib/logger";
import { readAllowedFormFields, readOptionalFile } from "@/lib/security/form-data";
import { readClientIp } from "@/lib/security/ip";
import { runAction } from "@/server/safe-action";
import {
  CAREER_FORM_KEYS,
  CONTACT_FORM_KEYS,
  PRODUCT_FORM_KEYS,
} from "@/lib/validations/enquiry";
import type { EnquiryFormState } from "@/types";
import type { EnquiryKind } from "@/types/domain";

const SUCCESS_MESSAGE =
  "Thank you. We have received your message and will respond shortly.";

async function resumeFromFormData(formData: FormData) {
  const file = readOptionalFile(formData, "resume");
  if (!file) {
    return null;
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = file.name.split(".").pop()?.toLowerCase();
  const inferredMime =
    file.type ||
    (extension === "pdf"
      ? "application/pdf"
      : extension === "doc"
        ? "application/msword"
        : extension === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "");

  return {
    filename: file.name,
    mimeType: inferredMime,
    byteSize: file.size,
    bytes,
  };
}

async function runEnquiryForm(
  kind: Exclude<EnquiryKind, "PROJECT">,
  formData: FormData,
): Promise<EnquiryFormState> {
  const allowed =
    kind === "CONTACT"
      ? CONTACT_FORM_KEYS
      : kind === "PRODUCT"
        ? PRODUCT_FORM_KEYS
        : CAREER_FORM_KEYS;

  const result = await runAction(`submit_${kind.toLowerCase()}_enquiry`, async () => {
    const fields = readAllowedFormFields(formData, allowed);
    const headerList = await headers();
    const ip = readClientIp(headerList);
    const resume = kind === "CAREER" ? await resumeFromFormData(formData) : null;

    const input: EnquirySubmitInput = {
      kind,
      fields,
      ip,
      resume,
    };

    return submitEnquiry(input, { db: getDb() });
  });

  if (result.ok) {
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  logger.warn("enquiry_form_rejected", { kind, code: result.code });
  return {
    status: "error",
    message: result.error,
    fieldErrors: result.fieldErrors,
  };
}

export async function submitContactEnquiry(
  _previous: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  return runEnquiryForm("CONTACT", formData);
}

export async function submitProductEnquiry(
  _previous: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  return runEnquiryForm("PRODUCT", formData);
}

export async function submitCareerEnquiry(
  _previous: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  return runEnquiryForm("CAREER", formData);
}
