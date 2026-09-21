import type { Role } from "@/types/domain";

export function canExportEnquiries(role: Role): boolean {
  return role === "SUPER_ADMIN";
}
