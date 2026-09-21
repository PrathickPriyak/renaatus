import type { Role } from "@/types/domain";

export function canViewAdmin(role: Role): boolean {
  return role === "SUPER_ADMIN" || role === "EDITOR" || role === "VIEWER";
}

export function canViewEnquiries(role: Role): boolean {
  return canViewAdmin(role);
}

export function canUpdateEnquiryStatus(role: Role): boolean {
  return canViewAdmin(role);
}

export function canExportEnquiries(role: Role): boolean {
  return role === "SUPER_ADMIN";
}

export function canManageBlog(role: Role): boolean {
  return role === "SUPER_ADMIN" || role === "EDITOR";
}

export function canManageMedia(role: Role): boolean {
  return role === "SUPER_ADMIN" || role === "EDITOR";
}
