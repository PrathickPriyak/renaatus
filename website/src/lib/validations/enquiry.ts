import { z } from "zod";
import { ENQUIRY_KINDS } from "@/lib/constants";
import {
  emailSchema,
  honeypotSchema,
  officeEmailSchema,
  optionalPhoneSchema,
} from "@/lib/validations/common";

const nameSchema = z.string().trim().min(2, "Please enter your name.").max(120);
const subjectSchema = z.string().trim().min(3, "Please add a subject.").max(200);
const messageSchema = z
  .string()
  .trim()
  .min(10, "Please include a short message.")
  .max(5000);

export const contactEnquirySchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: optionalPhoneSchema,
    subject: subjectSchema,
    message: messageSchema.optional(),
    body: messageSchema.optional(),
    office: z.string().trim().max(80).optional(),
    to: officeEmailSchema.optional(),
    website: honeypotSchema,
    turnstileToken: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.message && !value.body) {
      ctx.addIssue({
        code: "custom",
        path: ["message"],
        message: "Please include a short message.",
      });
    }
  })
  .transform((value) => ({
    kind: "CONTACT" as const,
    name: value.name,
    email: value.email,
    phone: value.phone,
    subject: value.subject,
    message: value.message ?? value.body ?? "",
    office: value.office,
    officeEmail: value.to,
    turnstileToken: value.turnstileToken,
    honeypot: value.website,
  }));

export const productEnquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: optionalPhoneSchema,
  message: messageSchema,
  productId: z.string().min(1, "Product is required."),
  website: honeypotSchema,
  turnstileToken: z.string().optional(),
});

export const projectEnquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: optionalPhoneSchema,
  message: messageSchema,
  projectId: z.string().min(1, "Project is required."),
  website: honeypotSchema,
  turnstileToken: z.string().optional(),
});

export const careerEnquirySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: optionalPhoneSchema,
  message: messageSchema,
  resumeKey: z.string().min(1, "A resume upload is required."),
  website: honeypotSchema,
  turnstileToken: z.string().optional(),
});

export const enquiryKindSchema = z.enum(ENQUIRY_KINDS);

export type ContactEnquiryInput = z.input<typeof contactEnquirySchema>;
export type ContactEnquiry = z.output<typeof contactEnquirySchema>;
export type ProductEnquiryInput = z.infer<typeof productEnquirySchema>;
export type ProjectEnquiryInput = z.infer<typeof projectEnquirySchema>;
export type CareerEnquiryInput = z.infer<typeof careerEnquirySchema>;
