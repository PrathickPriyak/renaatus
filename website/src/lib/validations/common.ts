import { z } from "zod";
import { OFFICE_EMAILS } from "@/lib/constants";

export const emailSchema = z.email({ error: "Please enter a valid email address." });

function digitCount(value: string): number {
  return value.replace(/\D/g, "").length;
}

export const phoneSchema = z
  .string({ error: "Please enter a phone number." })
  .trim()
  .min(1, "Please enter a phone number.")
  .max(40, "Phone number is too long.")
  .refine((value) => /^\+?[0-9][0-9\s().-]*[0-9]$/.test(value), {
    error: "Please enter a valid phone number.",
  })
  .refine((value) => {
    const digits = digitCount(value);
    return digits >= 8 && digits <= 15;
  }, { error: "Please enter a valid phone number." });

export const optionalPhoneSchema = z
  .string()
  .trim()
  .max(40, "Phone number is too long.")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

export const nameSchema = z
  .string({ error: "Please enter your name." })
  .trim()
  .min(2, "Please enter your name.")
  .max(120, "Name is too long.");

export const messageSchema = z
  .string({ error: "Please include a short message." })
  .trim()
  .min(10, "Please include a short message.")
  .max(5000, "Message is too long.");

export const subjectSchema = z
  .string({ error: "Please add a subject." })
  .trim()
  .min(3, "Please add a subject.")
  .max(200, "Subject is too long.");

export const sourcePathSchema = z
  .string()
  .trim()
  .max(200, "Source is too long.")
  .refine((value) => value.length === 0 || (value.startsWith("/") && !value.includes("://")), {
    error: "Invalid page.",
  })
  .optional()
  .transform((value) => (value && value.length > 0 ? value : "/"));

export const honeypotSchema = z.string().max(200).optional();

export const turnstileTokenSchema = z.string().max(2048).optional();

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase hyphenated slug.")
  .max(96);

export const officeEmailSchema = z.enum(OFFICE_EMAILS);
