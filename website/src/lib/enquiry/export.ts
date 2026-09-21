import type { Prisma, PrismaClient } from "../../../generated/prisma/client";
import ExcelJS from "exceljs";
import { ENQUIRY_KINDS, ENQUIRY_STATUSES } from "@/lib/constants";
import {
  ENQUIRY_EXPORT_COLUMNS,
  enquiryToExportCells,
  type EnquiryExportSource,
} from "@/lib/enquiry/excel";
import { canExportEnquiries } from "@/lib/auth/permissions";
import type { Actor } from "@/lib/auth/session";
import { ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/errors";
import type { EnquiryKind, EnquiryStatus } from "@/types/domain";

export const ENQUIRY_EXPORT_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const PAGE_SIZE = 500;

export type EnquiryExportFilters = {
  kinds: EnquiryKind[];
  statuses: EnquiryStatus[];
  from?: Date;
  to?: Date;
  ids: string[];
};

export type EnquiryExportResult = {
  buffer: Buffer;
  filename: string;
  contentType: string;
  rowCount: number;
};

function splitCsvParam(value: string | null): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function parseEnumList<T extends string>(
  values: string[],
  allowed: readonly T[],
  label: string,
): T[] {
  const allowedSet = new Set<string>(allowed);
  const parsed: T[] = [];
  for (const value of values) {
    if (!allowedSet.has(value)) {
      throw new ValidationError(`Invalid ${label}.`);
    }
    if (!parsed.includes(value as T)) {
      parsed.push(value as T);
    }
  }
  return parsed;
}

function parseDateOnly(value: string, bound: "start" | "end"): Date {
  if (!DATE_ONLY.test(value)) {
    throw new ValidationError("Dates must use YYYY-MM-DD.");
  }
  const iso = bound === "start" ? `${value}T00:00:00.000Z` : `${value}T23:59:59.999Z`;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new ValidationError("Dates must use YYYY-MM-DD.");
  }
  return date;
}

export function parseEnquiryExportFilters(
  searchParams: URLSearchParams,
): EnquiryExportFilters {
  const kinds = parseEnumList(
    splitCsvParam(searchParams.get("kind")),
    ENQUIRY_KINDS,
    "enquiry type",
  );
  const statuses = parseEnumList(
    splitCsvParam(searchParams.get("status")),
    ENQUIRY_STATUSES,
    "status",
  );
  const ids = splitCsvParam(searchParams.get("ids"));

  const fromValue = searchParams.get("from")?.trim() || "";
  const toValue = searchParams.get("to")?.trim() || "";
  const from = fromValue ? parseDateOnly(fromValue, "start") : undefined;
  const to = toValue ? parseDateOnly(toValue, "end") : undefined;

  if (from && to && from.getTime() > to.getTime()) {
    throw new ValidationError("The start date must be on or before the end date.");
  }

  return { kinds, statuses, from, to, ids };
}

function buildWhere(filters: EnquiryExportFilters): Prisma.EnquiryWhereInput {
  const where: Prisma.EnquiryWhereInput = {};
  if (filters.kinds.length > 0) {
    where.kind = { in: filters.kinds };
  }
  if (filters.statuses.length > 0) {
    where.status = { in: filters.statuses };
  }
  if (filters.ids.length > 0) {
    where.id = { in: filters.ids };
  }
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) {
      where.createdAt.gte = filters.from;
    }
    if (filters.to) {
      where.createdAt.lte = filters.to;
    }
  }
  return where;
}

export async function queryEnquiriesForExport(
  db: PrismaClient,
  filters: EnquiryExportFilters,
): Promise<EnquiryExportSource[]> {
  const where = buildWhere(filters);
  const rows: EnquiryExportSource[] = [];
  let cursorId: string | undefined;

  for (;;) {
    const page = await db.enquiry.findMany({
      where,
      take: PAGE_SIZE,
      ...(cursorId
        ? {
            skip: 1,
            cursor: { id: cursorId },
          }
        : {}),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
        createdAt: true,
        resumeId: true,
        product: { select: { name: true } },
        project: { select: { name: true } },
      },
    });

    for (const row of page) {
      rows.push({
        id: row.id,
        kind: row.kind,
        status: row.status,
        name: row.name,
        email: row.email,
        phone: row.phone,
        subject: row.subject,
        message: row.message,
        office: row.office,
        createdAt: row.createdAt,
        productName: row.product?.name ?? null,
        projectName: row.project?.name ?? null,
        hasResume: Boolean(row.resumeId),
      });
    }

    const last = page[page.length - 1];
    if (!last || page.length < PAGE_SIZE) {
      break;
    }
    cursorId = last.id;
  }

  return rows;
}

export async function buildEnquiryWorkbook(rows: EnquiryExportSource[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Renaatus";
  workbook.created = new Date();
  const sheet = workbook.addWorksheet("Enquiries", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.columns = ENQUIRY_EXPORT_COLUMNS.map((header) => ({
    header,
    width: header === "Message" ? 48 : header === "ID" ? 28 : 22,
  }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.numFmt = "@";
  });

  for (const row of rows) {
    const values = enquiryToExportCells(row);
    const added = sheet.addRow(values);
    added.eachCell((cell) => {
      cell.numFmt = "@";
    });
  }

  const raw = await workbook.xlsx.writeBuffer();
  return Buffer.from(raw);
}

function exportFilename(now = new Date()): string {
  const day = formatUtcDay(now);
  return `renaatus-enquiries-${day}.xlsx`;
}

function formatUtcDay(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function requireExportActor(actor: Actor | null): Actor {
  if (!actor) {
    throw new UnauthorizedError("Sign in required.");
  }
  if (!canExportEnquiries(actor.role)) {
    throw new ForbiddenError("You do not have permission to export enquiries.");
  }
  return actor;
}

export async function exportEnquiries(input: {
  db: PrismaClient;
  actor: Actor | null;
  filters: EnquiryExportFilters;
  now?: Date;
}): Promise<EnquiryExportResult> {
  requireExportActor(input.actor);
  const rows = await queryEnquiriesForExport(input.db, input.filters);
  const buffer = await buildEnquiryWorkbook(rows);
  return {
    buffer,
    filename: exportFilename(input.now ?? new Date()),
    contentType: ENQUIRY_EXPORT_CONTENT_TYPE,
    rowCount: rows.length,
  };
}
