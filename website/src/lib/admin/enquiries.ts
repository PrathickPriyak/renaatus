import type { Prisma, PrismaClient } from "../../../generated/prisma/client";
import { writeAudit } from "@/lib/admin/audit";
import {
  requireEnquiryReader,
  requireEnquiryStatusEditor,
} from "@/lib/admin/require-actor";
import type { Actor } from "@/lib/auth/session";
import { ENQUIRY_KINDS, ENQUIRY_STATUSES } from "@/lib/constants";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { signPrivateDownloadToken } from "@/lib/storage/private-download";
import type { EnquiryKind, EnquiryStatus } from "@/types/domain";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export type EnquiryListSort = "createdAt" | "-createdAt";

export type EnquiryListFilters = {
  q?: string;
  kind?: EnquiryKind;
  status?: EnquiryStatus;
  sort: EnquiryListSort;
  page: number;
  pageSize: number;
};

export type AdminEnquiryListRow = {
  id: string;
  kind: EnquiryKind;
  status: EnquiryStatus;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  office: string | null;
  sourcePath: string | null;
  createdAt: Date;
  hasResume: boolean;
  productName: string | null;
  projectName: string | null;
};

export type AdminEnquiryResume = {
  filename: string;
  mediaId: string;
};

export type AdminEnquiryDetail = {
  id: string;
  kind: EnquiryKind;
  status: EnquiryStatus;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  office: string | null;
  sourcePath: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: { id: string; name: string; slug: string } | null;
  project: { id: string; name: string; slug: string } | null;
  resume: AdminEnquiryResume | null;
};

export type EnquiryDetailSource = {
  id: string;
  kind: EnquiryKind;
  status: EnquiryStatus;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  office: string | null;
  sourcePath: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: { id: string; name: string; slug: string } | null;
  project?: { id: string; name: string; slug: string } | null;
  resume: { id: string; filename: string } | null;
};

export type EnquiryListResult = {
  rows: AdminEnquiryListRow[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

function parsePositiveInt(value: string | null, fallback: number, max?: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  if (max !== undefined && parsed > max) {
    return max;
  }
  return parsed;
}

function parseEnumValue<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  if (!value) {
    return undefined;
  }
  return allowed.includes(value as T) ? (value as T) : undefined;
}

export function parseEnquiryListFilters(
  searchParams: URLSearchParams,
): EnquiryListFilters {
  const q = searchParams.get("q")?.trim() || undefined;
  const sortValue = searchParams.get("sort");
  const sort: EnquiryListSort = sortValue === "createdAt" ? "createdAt" : "-createdAt";

  return {
    q,
    kind: parseEnumValue(searchParams.get("kind"), ENQUIRY_KINDS),
    status: parseEnumValue(searchParams.get("status"), ENQUIRY_STATUSES),
    sort,
    page: parsePositiveInt(searchParams.get("page"), 1),
    pageSize: parsePositiveInt(
      searchParams.get("pageSize"),
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    ),
  };
}

function listWhere(filters: EnquiryListFilters): Prisma.EnquiryWhereInput {
  const where: Prisma.EnquiryWhereInput = {};
  if (filters.kind) {
    where.kind = filters.kind;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  return where;
}

export function toAdminEnquiryListRow(row: {
  id: string;
  kind: EnquiryKind;
  status: EnquiryStatus;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  office: string | null;
  sourcePath: string | null;
  createdAt: Date;
  resumeId: string | null;
  product: { name: string } | null;
  project: { name: string } | null;
}): AdminEnquiryListRow {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    office: row.office,
    sourcePath: row.sourcePath,
    createdAt: row.createdAt,
    hasResume: Boolean(row.resumeId),
    productName: row.product?.name ?? null,
    projectName: row.project?.name ?? null,
  };
}

export function toAdminEnquiryDetail(record: EnquiryDetailSource): AdminEnquiryDetail {
  return {
    id: record.id,
    kind: record.kind,
    status: record.status,
    name: record.name,
    email: record.email,
    phone: record.phone,
    subject: record.subject,
    message: record.message,
    office: record.office,
    sourcePath: record.sourcePath,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    product: record.product,
    project: record.project ?? null,
    resume: record.resume
      ? { filename: record.resume.filename, mediaId: record.resume.id }
      : null,
  };
}

export async function listEnquiriesForAdmin(
  db: PrismaClient,
  actor: Actor | null,
  filters: EnquiryListFilters,
): Promise<EnquiryListResult> {
  requireEnquiryReader(actor);

  const where = listWhere(filters);
  const skip = (filters.page - 1) * filters.pageSize;
  const orderBy: Prisma.EnquiryOrderByWithRelationInput = {
    createdAt: filters.sort === "createdAt" ? "asc" : "desc",
  };

  const [total, rows] = await Promise.all([
    db.enquiry.count({ where }),
    db.enquiry.findMany({
      where,
      skip,
      take: filters.pageSize,
      orderBy: [orderBy, { id: "desc" }],
      select: {
        id: true,
        kind: true,
        status: true,
        name: true,
        email: true,
        phone: true,
        subject: true,
        office: true,
        sourcePath: true,
        createdAt: true,
        resumeId: true,
        product: { select: { name: true } },
        project: { select: { name: true } },
      },
    }),
  ]);

  return {
    rows: rows.map(toAdminEnquiryListRow),
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    pageCount: Math.max(1, Math.ceil(total / filters.pageSize)),
  };
}

export async function getEnquiryForAdmin(
  db: PrismaClient,
  actor: Actor | null,
  enquiryId: string,
): Promise<AdminEnquiryDetail> {
  requireEnquiryReader(actor);

  const record = await db.enquiry.findUnique({
    where: { id: enquiryId },
    select: {
      id: true,
      kind: true,
      status: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      office: true,
      sourcePath: true,
      createdAt: true,
      updatedAt: true,
      product: { select: { id: true, name: true, slug: true } },
      project: { select: { id: true, name: true, slug: true } },
      resume: { select: { id: true, filename: true } },
    },
  });

  if (!record) {
    throw new NotFoundError("Enquiry");
  }

  return toAdminEnquiryDetail(record);
}

export async function updateEnquiryStatus(
  db: PrismaClient,
  actor: Actor | null,
  input: { enquiryId: string; status: EnquiryStatus; ip?: string | null },
): Promise<AdminEnquiryDetail> {
  const staff = requireEnquiryStatusEditor(actor);
  if (!ENQUIRY_STATUSES.includes(input.status)) {
    throw new ValidationError("Invalid status.");
  }

  const existing = await db.enquiry.findUnique({
    where: { id: input.enquiryId },
    select: {
      id: true,
      status: true,
    },
  });
  if (!existing) {
    throw new NotFoundError("Enquiry");
  }

  if (existing.status !== input.status) {
    await db.enquiry.update({
      where: { id: existing.id },
      data: { status: input.status },
    });
    await writeAudit(db, {
      userId: staff.id,
      action: "enquiry.status_change",
      entityType: "Enquiry",
      entityId: existing.id,
      metadata: { from: existing.status, to: input.status },
      ip: input.ip,
    });
  }

  return getEnquiryForAdmin(db, staff, existing.id);
}

export async function getAuthorizedResumeDownloadHref(
  db: PrismaClient,
  actor: Actor | null,
  enquiryId: string,
): Promise<string | null> {
  requireEnquiryReader(actor);

  const enquiry = await db.enquiry.findUnique({
    where: { id: enquiryId },
    select: {
      resume: {
        select: { id: true, key: true, visibility: true },
      },
    },
  });

  const resume = enquiry?.resume;
  if (!resume || resume.visibility !== "PRIVATE") {
    return null;
  }

  try {
    const token = signPrivateDownloadToken({ mediaId: resume.id, key: resume.key });
    return `/api/private-files/${encodeURIComponent(token)}`;
  } catch {
    return null;
  }
}
