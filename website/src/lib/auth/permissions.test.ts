import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canExportEnquiries,
  canManageBlog,
  canManageMedia,
  canUpdateEnquiryStatus,
  canViewAdmin,
  canViewEnquiries,
} from "@/lib/auth/permissions";

describe("admin permissions", () => {
  it("lets every staff role into the admin shell", () => {
    assert.equal(canViewAdmin("SUPER_ADMIN"), true);
    assert.equal(canViewAdmin("EDITOR"), true);
    assert.equal(canViewAdmin("VIEWER"), true);
  });

  it("lets viewers read enquiries and change status but not export", () => {
    assert.equal(canViewEnquiries("VIEWER"), true);
    assert.equal(canUpdateEnquiryStatus("VIEWER"), true);
    assert.equal(canExportEnquiries("VIEWER"), false);
    assert.equal(canManageBlog("VIEWER"), false);
    assert.equal(canManageMedia("VIEWER"), false);
  });

  it("lets editors manage journal and media but not export", () => {
    assert.equal(canManageBlog("EDITOR"), true);
    assert.equal(canManageMedia("EDITOR"), true);
    assert.equal(canViewEnquiries("EDITOR"), true);
    assert.equal(canExportEnquiries("EDITOR"), false);
  });

  it("lets super admins export and manage everything", () => {
    assert.equal(canExportEnquiries("SUPER_ADMIN"), true);
    assert.equal(canManageBlog("SUPER_ADMIN"), true);
    assert.equal(canManageMedia("SUPER_ADMIN"), true);
    assert.equal(canUpdateEnquiryStatus("SUPER_ADMIN"), true);
  });
});
