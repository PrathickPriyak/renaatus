import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ENQUIRY_EXPORT_COLUMNS,
  formatExportDateTime,
  humanizeEnquiryKind,
  humanizeEnquiryStatus,
  sanitizeExcelCell,
} from "@/lib/enquiry/excel";

describe("sanitizeExcelCell", () => {
  it("prefixes formula-triggering characters so Excel treats them as text", () => {
    assert.equal(sanitizeExcelCell("=CMD()"), "'=CMD()");
    assert.equal(sanitizeExcelCell("+1+1"), "'+1+1");
    assert.equal(sanitizeExcelCell("-1+cmd|'/C calc'!A0"), "'-1+cmd|'/C calc'!A0");
    assert.equal(sanitizeExcelCell("@SUM(A1:A2)"), "'@SUM(A1:A2)");
    assert.equal(
      sanitizeExcelCell('\t=HYPERLINK("http://evil")'),
      '\'\t=HYPERLINK("http://evil")',
    );
    assert.equal(sanitizeExcelCell("\r=cmd|' /C calc'!A0"), "'\r=cmd|' /C calc'!A0");
    assert.equal(sanitizeExcelCell("\n=1+1"), "'\n=1+1");
  });

  it("prefixes values that only become formulas after leading whitespace", () => {
    assert.equal(sanitizeExcelCell("  =CMD()"), "'  =CMD()");
    assert.equal(sanitizeExcelCell("\u00a0+cmd"), "'\u00a0+cmd");
  });

  it("leaves ordinary text unchanged", () => {
    assert.equal(sanitizeExcelCell("Priya Natarajan"), "Priya Natarajan");
    assert.equal(sanitizeExcelCell("capability pack"), "capability pack");
    assert.equal(sanitizeExcelCell(""), "");
  });

  it("stringifies nullish and numeric values without introducing formulas", () => {
    assert.equal(sanitizeExcelCell(null), "");
    assert.equal(sanitizeExcelCell(undefined), "");
    assert.equal(sanitizeExcelCell(42), "42");
  });
});

describe("export column labels", () => {
  it("uses clean human-readable headers", () => {
    assert.deepEqual(ENQUIRY_EXPORT_COLUMNS, [
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
    ]);
  });

  it("humanizes kinds, statuses, and timestamps", () => {
    assert.equal(humanizeEnquiryKind("CONTACT"), "Contact");
    assert.equal(humanizeEnquiryKind("PRODUCT"), "Product");
    assert.equal(humanizeEnquiryKind("PROJECT"), "Project");
    assert.equal(humanizeEnquiryKind("CAREER"), "Career application");
    assert.equal(humanizeEnquiryStatus("NEW"), "New");
    assert.equal(humanizeEnquiryStatus("IN_PROGRESS"), "In progress");
    assert.equal(humanizeEnquiryStatus("CLOSED"), "Closed");
    assert.equal(
      formatExportDateTime(new Date("2026-09-21T12:55:03.000Z")),
      "2026-09-21 12:55:03 UTC",
    );
  });
});
