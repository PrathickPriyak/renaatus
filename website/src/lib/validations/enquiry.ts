import { z } from "zod";
import { ENQUIRY_KINDS } from "@/lib/constants";
import {
  emailSchema,
  honeypotSchema,
  messageSchema,
  nameSchema,
  phoneSchema,
  slugSchema,
  sourcePathSchema,
  subjectSchema,
  turnstileTokenSchema,
} from "@/lib/validations/common";

export const CONTACT_OFFICES = ["india", "maldives", "mauritius"] as const;
export type ContactOffice = (typeof CONTACT_OFFICES)[number];

export const CONTACT_OFFICE_OPTIONS = [
  { value: "india", label: "India / Headquarters", email: "bd@renaatus.com" },
  { value: "maldives", label: "Maldives", email: "maldives@renaatus.com" },
  { value: "mauritius", label: "Mauritius", email: "mauritius@renaatus.com" },
] as const;

export const CONTACT_FORM_KEYS = [
  "name",
  "email",
  "phone",
  "subject",
  "message",
  "office",
  "sourcePath",
  "website",
  "turnstileToken",
  "cf-turnstile-response",
] as const;

export const PRODUCT_FORM_KEYS = [
  "name",
  "email",
  "phone",
  "message",
  "productSlug",
  "sourcePath",
  "website",
  "turnstileToken",
  "cf-turnstile-response",
] as const;

export const CAREER_FORM_KEYS = [
  "name",
  "email",
  "phone",
  "message",
  "role",
  "resume",
  "sourcePath",
  "website",
  "turnstileToken",
  "cf-turnstile-response",
] as const;

const officeSchema = z.enum(CONTACT_OFFICES, { error: "Please choose an office." });

export const contactEnquirySchema = z
  .strictObject({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    subject: subjectSchema,
    message: messageSchema,
    office: officeSchema,
    sourcePath: sourcePathSchema,
    website: honeypotSchema,
    turnstileToken: turnstileTokenSchema,
    "cf-turnstile-response": turnstileTokenSchema,
  })
  .transform((value) => ({
    kind: "CONTACT" as const,
    name: value.name,
    email: value.email,
    phone: value.phone,
    subject: value.subject,
    message: value.message,
    office: value.office,
    sourcePath: value.sourcePath,
    honeypot: value.website ?? "",
    turnstileToken: value.turnstileToken ?? value["cf-turnstile-response"],
  }));

export const productEnquirySchema = z
  .strictObject({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    message: messageSchema,
    productSlug: slugSchema,
    sourcePath: sourcePathSchema,
    website: honeypotSchema,
    turnstileToken: turnstileTokenSchema,
    "cf-turnstile-response": turnstileTokenSchema,
  })
  .transform((value) => ({
    kind: "PRODUCT" as const,
    name: value.name,
    email: value.email,
    phone: value.phone,
    message: value.message,
    productSlug: value.productSlug,
    sourcePath: value.sourcePath,
    honeypot: value.website ?? "",
    turnstileToken: value.turnstileToken ?? value["cf-turnstile-response"],
  }));

export const careerEnquirySchema = z
  .strictObject({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    message: messageSchema,
    role: z
      .string()
      .trim()
      .max(120, "Role is too long.")
      .optional()
      .or(z.literal(""))
      .transform((value) => (value ? value : undefined)),
    sourcePath: sourcePathSchema,
    website: honeypotSchema,
    turnstileToken: turnstileTokenSchema,
    "cf-turnstile-response": turnstileTokenSchema,
  })
  .transform((value) => ({
    kind: "CAREER" as const,
    name: value.name,
    email: value.email,
    phone: value.phone,
    message: value.message,
    role: value.role,
    sourcePath: value.sourcePath,
    honeypot: value.website ?? "",
    turnstileToken: value.turnstileToken ?? value["cf-turnstile-response"],
  }));

export const projectEnquirySchema = z
  .strictObject({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    message: messageSchema,
    projectSlug: slugSchema,
    sourcePath: sourcePathSchema,
    website: honeypotSchema,
    turnstileToken: turnstileTokenSchema,
    "cf-turnstile-response": turnstileTokenSchema,
  })
  .transform((value) => ({
    kind: "PROJECT" as const,
    name: value.name,
    email: value.email,
    phone: value.phone,
    message: value.message,
    projectSlug: value.projectSlug,
    sourcePath: value.sourcePath,
    honeypot: value.website ?? "",
    turnstileToken: value.turnstileToken ?? value["cf-turnstile-response"],
  }));

export const enquiryKindSchema = z.enum(ENQUIRY_KINDS);

export function staffEmailForOffice(office: ContactOffice): string {
  const match = CONTACT_OFFICE_OPTIONS.find((item) => item.value === office);
  return match?.email ?? "bd@renaatus.com";
}

export type ContactEnquiryInput = z.input<typeof contactEnquirySchema>;
export type ContactEnquiry = z.output<typeof contactEnquirySchema>;
export type ProductEnquiryInput = z.input<typeof productEnquirySchema>;
export type ProductEnquiry = z.output<typeof productEnquirySchema>;
export type CareerEnquiryInput = z.input<typeof careerEnquirySchema>;
export type CareerEnquiry = z.output<typeof careerEnquirySchema>;
export type ProjectEnquiryInput = z.input<typeof projectEnquirySchema>;
export type ProjectEnquiry = z.output<typeof projectEnquirySchema>;
