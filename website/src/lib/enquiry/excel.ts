import type { EnquiryKind, EnquiryStatus } from "@/types/domain";

export const ENQUIRY_EXPORT_COLUMNS = [
  "ID",
  "Name",
  "Email",
  "Phone",
  "Company",
  "Enquiry Type",
  "Product",
  "Project",
  "Subject",
  "Message",
  "Status",
  "Office",
  "Resume Attached",
  "Created At",
] as const;

export type EnquiryExportColumn = (typeof ENQUIRY_EXPORT_COLUMNS)[number];

const KIND_LABELS: Record<EnquiryKind, string> = {
  CONTACT: "Contact",
  PRODUCT: "Product",
  PROJECT: "Project",
  CAREER: "Career application",
};

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  CLOSED: "Closed",
};

const LEADING_IGNORABLE =
  /^[\s\u00a0\u1680\u180e\u2000-\u200b\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
const FORMULA_PREFIX = /^[=+\-@\t\r\n]/;

/**
 * Neutralize CSV/Excel formula injection. Values that Excel would treat as
 * formulas are prefixed with a single quote so they stay literal text.
 */
export function sanitizeExcelCell(value: unknown): string {
  if (value == null) {
    return "";
  }

  const text = typeof value === "string" ? value : String(value);
  if (text.length === 0) {
    return "";
  }

  if (isFormulaInjectionRisk(text)) {
    return `'${text}`;
  }

  return text;
}

function isFormulaInjectionRisk(text: string): boolean {
  if (FORMULA_PREFIX.test(text)) {
    return true;
  }

  const withoutIgnorable = text.replace(LEADING_IGNORABLE, "");
  return withoutIgnorable !== text && FORMULA_PREFIX.test(withoutIgnorable);
}

export function humanizeEnquiryKind(kind: EnquiryKind): string {
  return KIND_LABELS[kind];
}

export function humanizeEnquiryStatus(status: EnquiryStatus): string {
  return STATUS_LABELS[status];
}

export function formatExportDateTime(value: Date): string {
  const iso = value.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)} UTC`;
}

export type EnquiryExportSource = {
  id: string;
  kind: EnquiryKind;
  status: EnquiryStatus;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  office: string | null;
  createdAt: Date;
  productName: string | null;
  projectName: string | null;
  hasResume: boolean;
};

export function enquiryToExportCells(row: EnquiryExportSource): string[] {
  return [
    sanitizeExcelCell(row.id),
    sanitizeExcelCell(row.name),
    sanitizeExcelCell(row.email),
    sanitizeExcelCell(row.phone ?? ""),
    // Company is not collected on Enquiry; keep the column for the report contract.
    "",
    sanitizeExcelCell(humanizeEnquiryKind(row.kind)),
    sanitizeExcelCell(row.productName ?? ""),
    sanitizeExcelCell(row.projectName ?? ""),
    sanitizeExcelCell(row.subject ?? ""),
    sanitizeExcelCell(row.message),
    sanitizeExcelCell(humanizeEnquiryStatus(row.status)),
    sanitizeExcelCell(row.office ?? ""),
    row.hasResume ? "Yes" : "No",
    sanitizeExcelCell(formatExportDateTime(row.createdAt)),
  ];
}
