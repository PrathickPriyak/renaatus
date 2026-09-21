import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ValidationError } from "@/lib/errors";
import { fieldErrorsFrom } from "@/server/safe-action";

describe("fieldErrorsFrom", () => {
  it("maps resume validation fields onto the form state", () => {
    const error = new ValidationError("Upload a PDF or Word document.", undefined, {
      resume: "Upload a PDF or Word document.",
    });
    assert.deepEqual(fieldErrorsFrom(error), {
      resume: "Upload a PDF or Word document.",
    });
  });
});
