import { canManageBlog, canManageMedia } from "@/lib/auth/permissions";
import type { Role } from "@/types/domain";

export type AdminNavItem = {
  href: string;
  label: string;
};

export function adminNavItems(role: Role): AdminNavItem[] {
  const items: AdminNavItem[] = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/enquiries", label: "Enquiries" },
  ];
  if (canManageBlog(role)) {
    items.push({ href: "/admin/blog", label: "Journal" });
  }
  if (canManageMedia(role)) {
    items.push({ href: "/admin/media", label: "Media" });
  }
  return items;
}

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
