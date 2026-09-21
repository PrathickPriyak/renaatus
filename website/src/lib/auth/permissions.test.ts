import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canExportEnquiries } from "@/lib/auth/permissions";

describe("canExportEnquiries", () => {
  it("allows only SUPER_ADMIN", () => {
    assert.equal(canExportEnquiries("SUPER_ADMIN"), true);
    assert.equal(canExportEnquiries("EDITOR"), false);
    assert.equal(canExportEnquiries("VIEWER"), false);
  });
});
