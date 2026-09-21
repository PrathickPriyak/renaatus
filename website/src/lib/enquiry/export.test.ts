import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import ExcelJS from "exceljs";
import { loadPrismaEnv } from "../../../prisma/load-env";
import { createCliPrismaClient, readDatabaseUrl } from "../../../prisma/cli-client";
import { ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/errors";
import { ENQUIRY_EXPORT_COLUMNS } from "@/lib/enquiry/excel";
import { exportEnquiries, parseEnquiryExportFilters } from "@/lib/enquiry/export";
import { handleEnquiryExportRequest } from "@/lib/enquiry/export-http";
import type { Role } from "@/types/domain";

loadPrismaEnv();

const db = createCliPrismaClient(readDatabaseUrl());
const stamp = Date.now();
const createdIds: string[] = [];
const userIds: string[] = [];
const productIds: string[] = [];

const actor = {
  id: "admin-actor",
  email: `export.admin.${stamp}@renaatus.com`,
  name: "Export Admin",
  role: "SUPER_ADMIN" as const,
};

async function loadSheet(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as never);
  const sheet = workbook.worksheets[0];
  assert.ok(sheet, "workbook must contain a worksheet");
  const headers = (sheet.getRow(1).values as unknown[])
    .slice(1)
    .map((value) => String(value ?? ""));
  const rows: string[][] = [];
  sheet.eachRow((row, index) => {
    if (index === 1) {
      return;
    }
    rows.push(
      (row.values as unknown[]).slice(1).map((value) => {
        if (value == null) {
          return "";
        }
        if (typeof value === "object" && "text" in value) {
          return String((value as { text: unknown }).text);
        }
        if (typeof value === "object" && "formula" in value) {
          return `FORMULA:${String((value as { formula: unknown }).formula)}`;
        }
        return String(value);
      }),
    );
  });
  return { sheetName: sheet.name, headers, rows };
}

function cell(row: string[], header: string): string {
  const index = ENQUIRY_EXPORT_COLUMNS.indexOf(
    header as (typeof ENQUIRY_EXPORT_COLUMNS)[number],
  );
  assert.ok(index >= 0, `missing column ${header}`);
  return row[index] ?? "";
}

describe("parseEnquiryExportFilters", () => {
  it("treats empty query as export-all", () => {
    const filters = parseEnquiryExportFilters(new URLSearchParams());
    assert.deepEqual(filters.kinds, []);
    assert.deepEqual(filters.statuses, []);
    assert.equal(filters.from, undefined);
    assert.equal(filters.to, undefined);
    assert.deepEqual(filters.ids, []);
  });

  it("parses kind, status, and inclusive UTC date bounds", () => {
    const filters = parseEnquiryExportFilters(
      new URLSearchParams({
        kind: "CONTACT,CAREER",
        status: "NEW,CLOSED",
        from: "2026-01-15",
        to: "2026-01-20",
      }),
    );
    assert.deepEqual(filters.kinds, ["CONTACT", "CAREER"]);
    assert.deepEqual(filters.statuses, ["NEW", "CLOSED"]);
    assert.equal(filters.from?.toISOString(), "2026-01-15T00:00:00.000Z");
    assert.equal(filters.to?.toISOString(), "2026-01-20T23:59:59.999Z");
  });

  it("rejects unknown kinds, statuses, and inverted dates", () => {
    assert.throws(
      () => parseEnquiryExportFilters(new URLSearchParams({ kind: "SPAM" })),
      (error: unknown) => error instanceof ValidationError,
    );
    assert.throws(
      () => parseEnquiryExportFilters(new URLSearchParams({ status: "DONE" })),
      (error: unknown) => error instanceof ValidationError,
    );
    assert.throws(
      () =>
        parseEnquiryExportFilters(
          new URLSearchParams({ from: "2026-02-02", to: "2026-02-01" }),
        ),
      (error: unknown) => error instanceof ValidationError,
    );
  });
});

describe("enquiry excel export from postgres", () => {
  before(async () => {
    await db.$queryRaw`SELECT 1`;

    const product = await db.product.create({
      data: {
        name: `Export AAC ${stamp}`,
        slug: `export-aac-${stamp}`,
        summary: "AAC blocks used only in export tests.",
        published: true,
      },
    });
    productIds.push(product.id);

    const contact = await db.enquiry.create({
      data: {
        kind: "CONTACT",
        status: "NEW",
        name: "=CMD()",
        email: `export.contact.${stamp}@example.com`,
        phone: "+91 44 42654557",
        subject: "+1+1",
        message: "@SUM(1,1) Please share a capability pack.",
        office: "india",
        sourcePath: "/contact",
        createdAt: new Date("2026-03-10T08:00:00.000Z"),
      },
    });
    createdIds.push(contact.id);

    const productEnquiry = await db.enquiry.create({
      data: {
        kind: "PRODUCT",
        status: "IN_PROGRESS",
        name: "Anand Rao",
        email: `export.product.${stamp}@example.com`,
        phone: "+91 98765 43210",
        message: "Need AAC blocks for a Chennai hospital campus.",
        productId: product.id,
        sourcePath: "/products/renacon-aac-blocks",
        createdAt: new Date("2026-04-12T08:00:00.000Z"),
      },
    });
    createdIds.push(productEnquiry.id);

    const career = await db.enquiry.create({
      data: {
        kind: "CAREER",
        status: "CLOSED",
        name: "Meera Iyer",
        email: `export.career.${stamp}@example.com`,
        phone: "+91 99887 76655",
        subject: "Project controls",
        message: "Applying for a project controls role in Chennai.",
        sourcePath: "/careers",
        createdAt: new Date("2026-05-20T08:00:00.000Z"),
        resume: {
          create: {
            key: `private/careers/2099/01/export-${stamp}.pdf`,
            bucket: "local-private",
            filename: "meera.pdf",
            mimeType: "application/pdf",
            byteSize: 120,
            visibility: "PRIVATE",
          },
        },
      },
    });
    createdIds.push(career.id);
  });

  after(async () => {
    if (createdIds.length > 0) {
      await db.enquiry.deleteMany({ where: { id: { in: createdIds } } });
    }
    await db.media.deleteMany({
      where: { key: { startsWith: `private/careers/2099/01/export-${stamp}` } },
    });
    if (productIds.length > 0) {
      await db.product.deleteMany({ where: { id: { in: productIds } } });
    }
    if (userIds.length > 0) {
      await db.auditLog.deleteMany({ where: { userId: { in: userIds } } });
      await db.session.deleteMany({ where: { userId: { in: userIds } } });
      await db.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await db.$disconnect();
  });

  it("exports matching rows with human-readable columns and formula-safe cells", async () => {
    const result = await exportEnquiries({
      db,
      actor,
      filters: parseEnquiryExportFilters(new URLSearchParams()),
    });

    const sheet = await loadSheet(result.buffer);
    assert.equal(sheet.sheetName, "Enquiries");
    assert.deepEqual(sheet.headers, [...ENQUIRY_EXPORT_COLUMNS]);

    const contact = sheet.rows.find((row) => cell(row, "ID") === createdIds[0]);
    const product = sheet.rows.find((row) => cell(row, "ID") === createdIds[1]);
    const career = sheet.rows.find((row) => cell(row, "ID") === createdIds[2]);
    assert.ok(contact);
    assert.ok(product);
    assert.ok(career);

    assert.equal(cell(contact, "Name"), "'=CMD()");
    assert.equal(cell(contact, "Phone"), "'+91 44 42654557");
    assert.equal(cell(contact, "Subject"), "'+1+1");
    assert.ok(cell(contact, "Message").startsWith("'@SUM(1,1)"));
    assert.equal(cell(contact, "Enquiry Type"), "Contact");
    assert.equal(cell(contact, "Status"), "New");
    assert.equal(cell(contact, "Company"), "");
    assert.equal(cell(contact, "Office"), "india");
    assert.equal(cell(contact, "Resume Attached"), "No");
    assert.equal(cell(contact, "Created At"), "2026-03-10 08:00:00 UTC");

    assert.equal(cell(product, "Enquiry Type"), "Product");
    assert.equal(cell(product, "Product"), `Export AAC ${stamp}`);
    assert.equal(cell(product, "Status"), "In progress");

    assert.equal(cell(career, "Enquiry Type"), "Career application");
    assert.equal(cell(career, "Subject"), "Project controls");
    assert.equal(cell(career, "Resume Attached"), "Yes");
    assert.equal(cell(career, "Status"), "Closed");

    const asText = result.buffer.toString("utf8");
    assert.equal(asText.includes("DATABASE_URL"), false);
    assert.equal(asText.includes("postgresql://"), false);
    const databaseUrl = process.env.DATABASE_URL ?? "";
    if (databaseUrl) {
      assert.equal(asText.includes(databaseUrl), false);
    }
    assert.equal(asText.includes(`private/careers/2099/01/export-${stamp}.pdf`), false);
    assert.equal(
      sheet.rows.some((row) => row.some((value) => value.startsWith("FORMULA:"))),
      false,
    );
  });

  it("exports by enquiry type, status, and date range", async () => {
    const byKind = await exportEnquiries({
      db,
      actor,
      filters: parseEnquiryExportFilters(new URLSearchParams({ kind: "PRODUCT" })),
    });
    const kindSheet = await loadSheet(byKind.buffer);
    const kindIds = kindSheet.rows.map((row) => cell(row, "ID"));
    assert.ok(kindIds.includes(createdIds[1] ?? ""));
    assert.equal(kindIds.includes(createdIds[0] ?? ""), false);
    assert.equal(kindIds.includes(createdIds[2] ?? ""), false);

    const byStatus = await exportEnquiries({
      db,
      actor,
      filters: parseEnquiryExportFilters(new URLSearchParams({ status: "CLOSED" })),
    });
    const statusIds = (await loadSheet(byStatus.buffer)).rows.map((row) =>
      cell(row, "ID"),
    );
    assert.ok(statusIds.includes(createdIds[2] ?? ""));
    assert.equal(statusIds.includes(createdIds[0] ?? ""), false);

    const byDate = await exportEnquiries({
      db,
      actor,
      filters: parseEnquiryExportFilters(
        new URLSearchParams({ from: "2026-04-01", to: "2026-04-30" }),
      ),
    });
    const dateIds = (await loadSheet(byDate.buffer)).rows.map((row) => cell(row, "ID"));
    assert.ok(dateIds.includes(createdIds[1] ?? ""));
    assert.equal(dateIds.includes(createdIds[0] ?? ""), false);
    assert.equal(dateIds.includes(createdIds[2] ?? ""), false);
  });

  it("exports only the selected filtered record ids", async () => {
    const selectedId = createdIds[0];
    assert.ok(selectedId);
    const result = await exportEnquiries({
      db,
      actor,
      filters: parseEnquiryExportFilters(new URLSearchParams({ ids: selectedId })),
    });
    const ids = (await loadSheet(result.buffer)).rows.map((row) => cell(row, "ID"));
    assert.deepEqual(ids, [selectedId]);
  });

  it("rejects unauthenticated and non-admin actors before reading rows", async () => {
    await assert.rejects(
      () =>
        exportEnquiries({
          db,
          actor: null,
          filters: parseEnquiryExportFilters(new URLSearchParams()),
        }),
      (error: unknown) => error instanceof UnauthorizedError,
    );

    await assert.rejects(
      () =>
        exportEnquiries({
          db,
          actor: { ...actor, role: "VIEWER" },
          filters: parseEnquiryExportFilters(new URLSearchParams()),
        }),
      (error: unknown) => error instanceof ForbiddenError,
    );

    await assert.rejects(
      () =>
        exportEnquiries({
          db,
          actor: { ...actor, role: "EDITOR" },
          filters: parseEnquiryExportFilters(new URLSearchParams()),
        }),
      (error: unknown) => error instanceof ForbiddenError,
    );
  });

  describe("handleEnquiryExportRequest", () => {
    it("returns 401 JSON without a workbook when there is no actor", async () => {
      const response = await handleEnquiryExportRequest(
        new Request("http://localhost/admin/enquiries/export"),
        {
          db,
          getActor: async () => null,
        },
      );

      assert.equal(response.status, 401);
      assert.match(response.headers.get("content-type") ?? "", /application\/json/);
      const body = (await response.json()) as { ok: boolean; code: string };
      assert.equal(body.ok, false);
      assert.equal(body.code, "UNAUTHORIZED");
    });

    it("returns 403 JSON without a workbook for viewers", async () => {
      const response = await handleEnquiryExportRequest(
        new Request("http://localhost/admin/enquiries/export"),
        {
          db,
          getActor: async (): Promise<{
            id: string;
            email: string;
            name: string;
            role: Role;
          }> => ({
            id: "viewer-1",
            email: "viewer@renaatus.com",
            name: "Viewer",
            role: "VIEWER",
          }),
        },
      );

      assert.equal(response.status, 403);
      assert.match(response.headers.get("content-type") ?? "", /application\/json/);
    });

    it("returns an xlsx attachment for SUPER_ADMIN and writes an audit log", async () => {
      const admin = await db.user.create({
        data: {
          name: "Export Super Admin",
          email: `export.super.${stamp}@renaatus.com`,
          role: "SUPER_ADMIN",
        },
      });
      userIds.push(admin.id);

      const response = await handleEnquiryExportRequest(
        new Request(
          `http://localhost/admin/enquiries/export?kind=CONTACT&from=2026-03-01&to=2026-03-31`,
        ),
        {
          db,
          getActor: async () => ({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: "SUPER_ADMIN",
          }),
          ip: "203.0.113.80",
        },
      );

      assert.equal(response.status, 200);
      assert.equal(
        response.headers.get("content-type"),
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      assert.match(
        response.headers.get("content-disposition") ?? "",
        /attachment; filename="/,
      );
      assert.equal(response.headers.get("cache-control"), "private, no-store");

      const buffer = Buffer.from(await response.arrayBuffer());
      const sheet = await loadSheet(buffer);
      assert.ok(sheet.rows.some((row) => cell(row, "ID") === createdIds[0]));

      const audit = await db.auditLog.findFirst({
        where: { userId: admin.id, action: "enquiry.export" },
        orderBy: { createdAt: "desc" },
      });
      assert.ok(audit);
      assert.equal(audit.entityType, "Enquiry");
      assert.equal(audit.ip, "203.0.113.80");
    });
  });
});
