export const OFFICE_EMAILS = [
  "bd@renaatus.com",
  "hr@renaatus.com",
  "maldives@renaatus.com",
  "mauritius@renaatus.com",
] as const;

export type OfficeEmail = (typeof OFFICE_EMAILS)[number];

export const DEFAULT_OFFICE_EMAIL: OfficeEmail = "bd@renaatus.com";

export const ENQUIRY_KINDS = ["CONTACT", "PRODUCT", "PROJECT", "CAREER"] as const;
export const ENQUIRY_STATUSES = ["NEW", "IN_PROGRESS", "CLOSED"] as const;
export const POST_STATUSES = ["DRAFT", "PUBLISHED", "UNPUBLISHED", "ARCHIVED"] as const;
export const PROJECT_TYPES = ["REALTY", "INFRASTRUCTURE"] as const;
export const INDUSTRIES = [
  "AVIATION",
  "HEALTHCARE",
  "WATER",
  "TRANSPORT",
  "CIVIC",
  "RESIDENTIAL",
] as const;
export const ROLES = ["SUPER_ADMIN", "EDITOR", "VIEWER"] as const;
export const MEDIA_VISIBILITIES = ["PUBLIC", "PRIVATE"] as const;

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
export const ALLOWED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
