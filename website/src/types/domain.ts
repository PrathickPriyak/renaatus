import type {
  ENQUIRY_KINDS,
  ENQUIRY_STATUSES,
  INDUSTRIES,
  MEDIA_VISIBILITIES,
  POST_STATUSES,
  PROJECT_TYPES,
  ROLES,
} from "@/lib/constants";

export type Role = (typeof ROLES)[number];
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number];
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export type PostStatus = (typeof POST_STATUSES)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type Industry = (typeof INDUSTRIES)[number];
export type MediaVisibility = (typeof MEDIA_VISIBILITIES)[number];

export type Country = "India" | "Maldives" | "Mauritius";
