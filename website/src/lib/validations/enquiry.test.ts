import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  careerEnquirySchema,
  contactEnquirySchema,
  productEnquirySchema,
} from "@/lib/validations/enquiry";

const validContact = {
  name: "Priya Natarajan",
  email: "priya@example.com",
  phone: "+91 44 42654557",
  subject: "Infrastructure bid question",
  message: "Please share the process for submitting an EPC capability pack.",
  office: "india",
  sourcePath: "/contact",
  website: "",
};

const validProduct = {
  name: "Priya Natarajan",
  email: "priya@example.com",
  phone: "+91 98765 43210",
  message: "We need AAC blocks for a hospital campus in Chennai.",
  productSlug: "renacon-aac-blocks",
  sourcePath: "/products/renacon-aac-blocks",
  website: "",
};

const validCareer = {
  name: "Priya Natarajan",
  email: "priya@example.com",
  phone: "+91 98765 43210",
  message: "Applying for a site engineering role across India and Maldives.",
  role: "Site engineer",
  sourcePath: "/careers",
  website: "",
};

describe("contact enquiry schema", () => {
  it("accepts a complete contact enquiry", () => {
    const parsed = contactEnquirySchema.safeParse(validContact);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.kind, "CONTACT");
      assert.equal(parsed.data.office, "india");
      assert.equal(parsed.data.message.includes("EPC"), true);
    }
  });

  it("rejects empty required fields", () => {
    const parsed = contactEnquirySchema.safeParse({
      name: " ",
      email: "",
      phone: "",
      subject: "",
      message: "",
      office: "",
      sourcePath: "/contact",
    });
    assert.equal(parsed.success, false);
  });

  it("rejects an invalid email", () => {
    const parsed = contactEnquirySchema.safeParse({
      ...validContact,
      email: "not-an-email",
    });
    assert.equal(parsed.success, false);
  });

  it("rejects an invalid phone", () => {
    const parsed = contactEnquirySchema.safeParse({
      ...validContact,
      phone: "abc",
    });
    assert.equal(parsed.success, false);
  });

  it("rejects excessive input length", () => {
    const parsed = contactEnquirySchema.safeParse({
      ...validContact,
      message: "a".repeat(5001),
    });
    assert.equal(parsed.success, false);
  });

  it("rejects unexpected fields", () => {
    const parsed = contactEnquirySchema.safeParse({
      ...validContact,
      admin: true,
    });
    assert.equal(parsed.success, false);
  });

  it("rejects an unknown office", () => {
    const parsed = contactEnquirySchema.safeParse({
      ...validContact,
      office: "hr@renaatus.com",
    });
    assert.equal(parsed.success, false);
  });
});

describe("product enquiry schema", () => {
  it("accepts a catalogue product slug", () => {
    const parsed = productEnquirySchema.safeParse(validProduct);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.kind, "PRODUCT");
      assert.equal(parsed.data.productSlug, "renacon-aac-blocks");
    }
  });

  it("rejects a missing product slug", () => {
    const parsed = productEnquirySchema.safeParse({
      name: validProduct.name,
      email: validProduct.email,
      phone: validProduct.phone,
      message: validProduct.message,
      sourcePath: validProduct.sourcePath,
      website: validProduct.website,
    });
    assert.equal(parsed.success, false);
  });

  it("rejects unexpected fields", () => {
    const parsed = productEnquirySchema.safeParse({
      ...validProduct,
      productId: "injected",
    });
    assert.equal(parsed.success, false);
  });
});

describe("career enquiry schema", () => {
  it("accepts a career application without a resume key", () => {
    const parsed = careerEnquirySchema.safeParse(validCareer);
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.kind, "CAREER");
      assert.equal(parsed.data.role, "Site engineer");
    }
  });

  it("rejects an empty name", () => {
    const parsed = careerEnquirySchema.safeParse({
      ...validCareer,
      name: "",
    });
    assert.equal(parsed.success, false);
  });

  it("rejects unexpected fields", () => {
    const parsed = careerEnquirySchema.safeParse({
      ...validCareer,
      resumeKey: "private/careers/evil.exe",
    });
    assert.equal(parsed.success, false);
  });
});
