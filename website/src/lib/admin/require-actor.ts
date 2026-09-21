import type { Actor } from "@/lib/auth/session";
import {
  canManageBlog,
  canManageMedia,
  canUpdateEnquiryStatus,
  canViewAdmin,
  canViewEnquiries,
} from "@/lib/auth/permissions";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

export function requireStaff(actor: Actor | null): Actor {
  if (!actor) {
    throw new UnauthorizedError("Sign in required.");
  }
  if (!canViewAdmin(actor.role)) {
    throw new ForbiddenError("You do not have access to the admin dashboard.");
  }
  return actor;
}

export function requireEnquiryReader(actor: Actor | null): Actor {
  const staff = requireStaff(actor);
  if (!canViewEnquiries(staff.role)) {
    throw new ForbiddenError("You do not have permission to view enquiries.");
  }
  return staff;
}

export function requireEnquiryStatusEditor(actor: Actor | null): Actor {
  const staff = requireStaff(actor);
  if (!canUpdateEnquiryStatus(staff.role)) {
    throw new ForbiddenError("You do not have permission to update enquiry status.");
  }
  return staff;
}

export function requireBlogEditor(actor: Actor | null): Actor {
  const staff = requireStaff(actor);
  if (!canManageBlog(staff.role)) {
    throw new ForbiddenError("You do not have permission to manage the journal.");
  }
  return staff;
}

export function requireMediaEditor(actor: Actor | null): Actor {
  const staff = requireStaff(actor);
  if (!canManageMedia(staff.role)) {
    throw new ForbiddenError("You do not have permission to manage media.");
  }
  return staff;
}
