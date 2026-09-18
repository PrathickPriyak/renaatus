import { z } from "zod";
import { OFFICE_EMAILS } from "@/lib/constants";

export const emailSchema = z.email({ error: "Please enter a valid email address." });

export const optionalPhoneSchema = z
  .string()
  .trim()
  .max(40, "Phone number is too long.")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase hyphenated slug.")
  .max(96);

export const honeypotSchema = z.string().max(0).optional();

export const officeEmailSchema = z.enum(OFFICE_EMAILS);
