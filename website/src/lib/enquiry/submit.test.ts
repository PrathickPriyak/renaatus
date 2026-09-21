import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { loadPrismaEnv } from "../../../prisma/load-env";
import { createCliPrismaClient, readDatabaseUrl } from "../../../prisma/cli-client";
import { RateLimitError, ValidationError } from "@/lib/errors";
import { resetMemoryRateLimitStore } from "@/lib/security/rate-limit";
import { submitEnquiry } from "@/lib/enquiry/submit";

loadPrismaEnv();

const db = createCliPrismaClient(readDatabaseUrl());

const baseContact = {
  kind: "CONTACT" as const,
  fields: {
    name: "Priya Natarajan",
    email: `priya.forms.${Date.now()}@example.com`,
    phone: "+91 44 42654557",
    subject: "Capability document",
    message: "Please share the process for an infrastructure capability pack.",
    office: "india",
    sourcePath: "/contact",
    website: "",
  },
  ip: "203.0.113.10",
};

describe("submitEnquiry pipeline", () => {
  before(async () => {
    resetMemoryRateLimitStore();
    await db.$queryRaw`SELECT 1`;
  });

  after(async () => {
    await db.$disconnect();
  });

  it("writes a contact enquiry server-side and returns no PII", async () => {
    const result = await submitEnquiry(baseContact, {
      db,
      notify: async () => undefined,
      now: () => Date.now(),
    });

    assert.equal(result.status, "stored");
    if (result.status !== "stored") {
      return;
    }
    assert.equal("email" in result, false);
    assert.equal(typeof result.id, "string");

    const row = await db.enquiry.findUniqueOrThrow({ where: { id: result.id } });
    assert.equal(row.kind, "CONTACT");
    assert.equal(row.status, "NEW");
    assert.equal(row.name, "Priya Natarajan");
    assert.equal(row.sourcePath, "/contact");
    assert.equal(row.office, "india");
    assert.ok(row.createdAt instanceof Date);
    assert.ok(row.updatedAt instanceof Date);
    assert.equal(row.ipHash?.includes("."), false);
  });

  it("stores a product enquiry against the catalogue slug", async () => {
    const result = await submitEnquiry(
      {
        kind: "PRODUCT",
        fields: {
          name: "Anand Rao",
          email: `anand.forms.${Date.now()}@example.com`,
          phone: "+91 98765 43210",
          message: "Need AAC blocks for a Chennai hospital campus.",
          productSlug: "renacon-aac-blocks",
          sourcePath: "/products/renacon-aac-blocks",
          website: "",
        },
        ip: "203.0.113.11",
      },
      {
        db,
        notify: async () => undefined,
      },
    );

    assert.equal(result.status, "stored");
    if (result.status !== "stored") {
      return;
    }
    const row = await db.enquiry.findUniqueOrThrow({ where: { id: result.id } });
    assert.equal(row.kind, "PRODUCT");
    assert.ok(row.productId);
    const product = await db.product.findUniqueOrThrow({ where: { id: row.productId } });
    assert.equal(product.slug, "renacon-aac-blocks");
  });

  it("stores a career application with private resume metadata", async () => {
    const pdf = new Uint8Array(Buffer.concat([Buffer.from("%PDF-1.4"), Buffer.alloc(120, 32)]));
    const result = await submitEnquiry(
      {
        kind: "CAREER",
        fields: {
          name: "Meera Iyer",
          email: `meera.forms.${Date.now()}@example.com`,
          phone: "+91 99887 76655",
          message: "Applying for a project controls role in Chennai.",
          role: "Project controls",
          sourcePath: "/careers",
          website: "",
        },
        ip: "203.0.113.12",
        resume: {
          filename: "Meera Iyer.pdf",
          mimeType: "application/pdf",
          byteSize: pdf.byteLength,
          bytes: pdf,
        },
      },
      {
        db,
        notify: async () => undefined,
      },
    );

    assert.equal(result.status, "stored");
    if (result.status !== "stored") {
      return;
    }
    const row = await db.enquiry.findUniqueOrThrow({
      where: { id: result.id },
      include: { resume: true },
    });
    assert.equal(row.kind, "CAREER");
    assert.ok(row.resume);
    assert.equal(row.resume.visibility, "PRIVATE");
    assert.match(row.resume.key, /^private\/careers\//);
    assert.equal(row.resume.key.startsWith("http"), false);
  });

  it("fakes success for honeypot submissions without writing", async () => {
    const before = await db.enquiry.count();
    const result = await submitEnquiry(
      {
        ...baseContact,
        fields: {
          ...baseContact.fields,
          email: `bot.forms.${Date.now()}@example.com`,
          website: "https://spam.example",
        },
        ip: "198.51.100.9",
      },
      { db, notify: async () => undefined },
    );

    assert.equal(result.status, "ignored");
    const after = await db.enquiry.count();
    assert.equal(after, before);
  });

  it("does not write invalid enquiries", async () => {
    await assert.rejects(
      () =>
        submitEnquiry(
          {
            kind: "CONTACT",
            fields: {
              name: "",
              email: "bad",
              phone: "nope",
              subject: "",
              message: "",
              office: "india",
              sourcePath: "/contact",
            },
            ip: "203.0.113.13",
          },
          { db, notify: async () => undefined },
        ),
      (error: unknown) => error instanceof ValidationError || error instanceof Error,
    );
  });

  it("rate limits repeated submissions from the same IP", async () => {
    resetMemoryRateLimitStore();
    const ip = `198.51.100.${Math.floor(Math.random() * 200) + 20}`;

    for (let index = 0; index < 5; index += 1) {
      const result = await submitEnquiry(
        {
          kind: "CONTACT",
          fields: {
            ...baseContact.fields,
            email: `rate.${ip}.${index}.${Date.now()}@example.com`,
            subject: `Rate ${index}`,
          },
          ip,
        },
        { db, notify: async () => undefined },
      );
      assert.equal(result.status, "stored");
    }

    await assert.rejects(
      () =>
        submitEnquiry(
          {
            kind: "CONTACT",
            fields: {
              ...baseContact.fields,
              email: `rate.overflow.${Date.now()}@example.com`,
            },
            ip,
          },
          { db, notify: async () => undefined },
        ),
      (error: unknown) => error instanceof RateLimitError,
    );
  });
});
