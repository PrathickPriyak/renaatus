import type { EnquiryKind, EnquiryStatus, PostStatus, Role } from "@/types/domain";

const KIND_LABELS: Record<EnquiryKind, string> = {
  CONTACT: "Contact",
  PRODUCT: "Product",
  PROJECT: "Project",
  CAREER: "Career application",
};

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  CLOSED: "Closed",
};

const POST_STATUS_LABELS: Record<PostStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  UNPUBLISHED: "Unpublished",
  ARCHIVED: "Archived",
};

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

const ACTION_LABELS: Record<string, string> = {
  "enquiry.status_change": "Enquiry status updated",
  "enquiry.export": "Enquiries exported",
  "post.create": "Journal entry created",
  "post.update": "Journal entry updated",
};

export function formatAdminDateTime(value: Date): string {
  const iso = value.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function humanizeEnquiryKindLabel(kind: EnquiryKind): string {
  return KIND_LABELS[kind];
}

export function humanizeEnquiryStatusLabel(status: EnquiryStatus): string {
  return STATUS_LABELS[status];
}

export function humanizePostStatusLabel(status: PostStatus): string {
  return POST_STATUS_LABELS[status];
}

export function humanizeRoleLabel(role: Role): string {
  return ROLE_LABELS[role];
}

export function humanizeAuditAction(action: string): string {
  return ACTION_LABELS[action] ?? action.replaceAll(".", " ");
}
