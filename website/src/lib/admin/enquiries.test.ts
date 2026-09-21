import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { loadPrismaEnv } from "../../../prisma/load-env";
import { createCliPrismaClient, readDatabaseUrl } from "../../../prisma/cli-client";
import { getDashboardSnapshot } from "@/lib/admin/dashboard";
import {
  getEnquiryForAdmin,
  listEnquiriesForAdmin,
  parseEnquiryListFilters,
  toAdminEnquiryDetail,
  updateEnquiryStatus,
} from "@/lib/admin/enquiries";
import { UnauthorizedError } from "@/lib/errors";
import type { Actor } from "@/lib/auth/session";

loadPrismaEnv();

const db = createCliPrismaClient(readDatabaseUrl());
const stamp = Date.now();
const createdIds: string[] = [];
const userIds: string[] = [];

const viewer: Actor = {
  id: "viewer-actor",
  email: `dash.viewer.${stamp}@renaatus.com`,
  name: "Dashboard Viewer",
  role: "VIEWER",
};

describe("admin enquiry workspace", () => {
  before(async () => {
    await db.$queryRaw`SELECT 1`;
    const contact = await db.enquiry.create({
      data: {
        kind: "CONTACT",
        status: "NEW",
        name: "Priya Natarajan",
        email: `dash.contact.${stamp}@example.com`,
        phone: "+91 44 42654557",
        subject: "Capability pack",
        message: "Please share the infrastructure capability pack.",
        office: "india",
        sourcePath: "/contact",
        ipHash: "should-never-leave-the-server",
      },
    });
    createdIds.push(contact.id);

    const career = await db.enquiry.create({
      data: {
        kind: "CAREER",
        status: "IN_PROGRESS",
        name: "Meera Iyer",
        email: `dash.career.${stamp}@example.com`,
        message: "Applying for a project controls role in Chennai.",
        subject: "Project controls",
        sourcePath: "/careers",
        ipHash: "career-ip-hash",
        resume: {
          create: {
            key: `private/careers/2099/01/dash-${stamp}.pdf`,
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
      where: { key: { startsWith: `private/careers/2099/01/dash-${stamp}` } },
    });
    if (userIds.length > 0) {
      await db.auditLog.deleteMany({ where: { userId: { in: userIds } } });
      await db.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await db.$disconnect();
  });

  it("parses list filters for search, kind, status, sort, and page", () => {
    const filters = parseEnquiryListFilters(
      new URLSearchParams({
        q: "priya",
        kind: "CONTACT",
        status: "NEW",
        sort: "createdAt",
        page: "2",
      }),
    );
    assert.equal(filters.q, "priya");
    assert.equal(filters.kind, "CONTACT");
    assert.equal(filters.status, "NEW");
    assert.equal(filters.sort, "createdAt");
    assert.equal(filters.page, 2);
  });

  it("lists, searches, and paginates enquiries without leaking ip hashes or resume keys", async () => {
    const listed = await listEnquiriesForAdmin(
      db,
      viewer,
      parseEnquiryListFilters(new URLSearchParams()),
    );
    const contact = listed.rows.find((row) => row.id === createdIds[0]);
    const career = listed.rows.find((row) => row.id === createdIds[1]);
    assert.ok(contact);
    assert.ok(career);
    assert.equal("ipHash" in contact, false);
    assert.equal("resumeKey" in career, false);
    assert.ok(!JSON.stringify(listed).includes("should-never-leave-the-server"));
    assert.ok(
      !JSON.stringify(listed).includes(`private/careers/2099/01/dash-${stamp}.pdf`),
    );

    const searched = await listEnquiriesForAdmin(
      db,
      viewer,
      parseEnquiryListFilters(new URLSearchParams({ q: `dash.career.${stamp}` })),
    );
    assert.ok(searched.rows.some((row) => row.id === createdIds[1]));
    assert.equal(
      searched.rows.some((row) => row.id === createdIds[0]),
      false,
    );

    const paged = await listEnquiriesForAdmin(
      db,
      viewer,
      parseEnquiryListFilters(new URLSearchParams({ page: "1" })),
    );
    assert.ok(paged.pageSize >= 1);
    assert.ok(paged.total >= 2);
  });

  it("returns enquiry detail without ipHash and with a resume filename only", async () => {
    const careerId = createdIds[1];
    assert.ok(careerId);
    const detail = await getEnquiryForAdmin(db, viewer, careerId);
    assert.equal(detail.kind, "CAREER");
    assert.equal(detail.resume?.filename, "meera.pdf");
    assert.equal("ipHash" in detail, false);
    assert.equal(detail.resume && "key" in detail.resume, false);
    const serialized = JSON.stringify(detail);
    assert.equal(serialized.includes("career-ip-hash"), false);
    assert.equal(serialized.includes(`private/careers/2099/01/dash-${stamp}.pdf`), false);
  });

  it("updates status for viewers and writes an audit row", async () => {
    const admin = await db.user.create({
      data: {
        name: "Status Viewer",
        email: `dash.status.${stamp}@renaatus.com`,
        role: "VIEWER",
      },
    });
    userIds.push(admin.id);
    const contactId = createdIds[0];
    assert.ok(contactId);

    const updated = await updateEnquiryStatus(
      db,
      { ...viewer, id: admin.id },
      { enquiryId: contactId, status: "CLOSED" },
    );
    assert.equal(updated.status, "CLOSED");

    const audit = await db.auditLog.findFirst({
      where: { userId: admin.id, action: "enquiry.status_change" },
      orderBy: { createdAt: "desc" },
    });
    assert.ok(audit);
    assert.equal(audit.entityType, "Enquiry");
    assert.equal(audit.entityId, contactId);
  });

  it("rejects unauthenticated enquiry reads", async () => {
    await assert.rejects(
      () =>
        listEnquiriesForAdmin(db, null, parseEnquiryListFilters(new URLSearchParams())),
      (error: unknown) => error instanceof UnauthorizedError,
    );
  });

  it("omits ipHash when mapping a raw record", () => {
    const mapped = toAdminEnquiryDetail({
      id: "enq_1",
      kind: "CONTACT",
      status: "NEW",
      name: "A",
      email: "a@example.com",
      phone: null,
      subject: null,
      message: "Hello there from the site.",
      office: null,
      sourcePath: "/contact",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      product: null,
      project: null,
      resume: null,
    });
    assert.equal("ipHash" in mapped, false);
  });

  it("returns the required dashboard counts for staff", async () => {
    const snapshot = await getDashboardSnapshot(db, viewer);
    assert.equal(typeof snapshot.totalEnquiries, "number");
    assert.equal(typeof snapshot.newEnquiries, "number");
    assert.equal(typeof snapshot.contactEnquiries, "number");
    assert.equal(typeof snapshot.productEnquiries, "number");
    assert.equal(typeof snapshot.careerApplications, "number");
    assert.equal(typeof snapshot.blogCount, "number");
    assert.ok(Array.isArray(snapshot.recentActivity));
    assert.ok(snapshot.totalEnquiries >= snapshot.contactEnquiries);
  });

  it("rejects a missing dashboard actor", async () => {
    await assert.rejects(
      () => getDashboardSnapshot(db, null),
      (error: unknown) => error instanceof UnauthorizedError,
    );
  });
});
