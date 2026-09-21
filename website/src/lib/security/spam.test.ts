import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSpamEnquiry } from "@/lib/security/spam";

describe("isSpamEnquiry", () => {
  it("flags messages packed with links", () => {
    const spam = isSpamEnquiry({
      name: "Buyer",
      email: "spam@example.com",
      message:
        "Visit https://a.example https://b.example https://c.example https://d.example https://e.example",
    });
    assert.equal(spam, true);
  });

  it("allows a normal enquiry with one link", () => {
    const spam = isSpamEnquiry({
      name: "Priya Natarajan",
      email: "priya@example.com",
      message: "Please see our drawings at https://client.example/pack and call me.",
    });
    assert.equal(spam, false);
  });
});
