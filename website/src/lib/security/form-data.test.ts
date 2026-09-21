import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ValidationError } from "@/lib/errors";
import { readAllowedFormFields } from "@/lib/security/form-data";

describe("readAllowedFormFields", () => {
  it("returns only allowlisted string fields", () => {
    const formData = new FormData();
    formData.set("name", "Priya");
    formData.set("email", "priya@example.com");
    formData.set("$ACTION_ID_abc", "internal");

    const fields = readAllowedFormFields(formData, ["name", "email"]);
    assert.deepEqual(fields, {
      name: "Priya",
      email: "priya@example.com",
    });
  });

  it("rejects unexpected fields", () => {
    const formData = new FormData();
    formData.set("name", "Priya");
    formData.set("injected", "true");

    assert.throws(
      () => readAllowedFormFields(formData, ["name"]),
      (error: unknown) => error instanceof ValidationError,
    );
  });
});
