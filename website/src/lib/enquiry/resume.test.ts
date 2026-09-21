import assert from "node:assert/strict";
import { crc32 } from "node:zlib";
import { describe, it } from "node:test";
import { ValidationError } from "@/lib/errors";
import { MAX_RESUME_BYTES } from "@/lib/constants";
import {
  buildResumeObjectKey,
  sanitizeResumeFilename,
  validateResumeUpload,
} from "@/lib/enquiry/resume";

function pdfBytes(size = 64): Uint8Array {
  const bytes = new Uint8Array(size);
  bytes.set(Buffer.from("%PDF-1.4"), 0);
  return bytes;
}

function oleDocBytes(): Uint8Array {
  return new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0x00, 0x00, 0x00, 0x00]);
}

function makeZip(entries: Array<{ name: string; data: Uint8Array }>): Uint8Array {
  const encoder = new TextEncoder();
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = Buffer.from(encoder.encode(entry.name));
    const data = Buffer.from(entry.data);
    const crc = crc32(data) >>> 0;
    const local = Buffer.alloc(30 + nameBytes.length + data.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    nameBytes.copy(local, 30);
    data.copy(local, 30 + nameBytes.length);
    locals.push(local);

    const central = Buffer.alloc(46 + nameBytes.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    nameBytes.copy(central, 46);
    centrals.push(central);
    offset += local.length;
  }

  const cd = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return new Uint8Array(Buffer.concat([...locals, cd, eocd]));
}

function validDocxBytes(): Uint8Array {
  return makeZip([
    {
      name: "[Content_Types].xml",
      data: Buffer.from('<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"></Types>'),
    },
    { name: "word/document.xml", data: Buffer.from("<w:document />") },
  ]);
}

function assertResumeRejected(upload: Parameters<typeof validateResumeUpload>[0]) {
  assert.throws(
    () => validateResumeUpload(upload),
    (error: unknown) =>
      error instanceof ValidationError &&
      error.fields?.resume !== undefined &&
      error.fields.resume.length > 0,
  );
}

describe("sanitizeResumeFilename", () => {
  it("strips path traversal from the stored filename", () => {
    const filename = sanitizeResumeFilename("../../etc/passwd.pdf");
    assert.equal(filename.includes(".."), false);
    assert.equal(filename.includes("/"), false);
    assert.equal(filename, "passwd.pdf");
  });

  it("does not rewrite unknown extensions into a pdf", () => {
    assert.equal(sanitizeResumeFilename("shell.php"), "");
    assert.equal(sanitizeResumeFilename("payload.js"), "");
    assert.equal(sanitizeResumeFilename("image.svg"), "");
    assert.equal(sanitizeResumeFilename("page.html"), "");
    assert.equal(sanitizeResumeFilename("resume.pdf.exe"), "");
  });

  it("strips executable inner extensions from an otherwise allowed name", () => {
    assert.equal(sanitizeResumeFilename("malware.exe.pdf"), "malware.pdf");
    assert.equal(sanitizeResumeFilename("cv.php.docx"), "cv.docx");
  });
});

describe("validateResumeUpload", () => {
  it("accepts a modest PDF resume", () => {
    const result = validateResumeUpload({
      filename: "Priya Natarajan.pdf",
      mimeType: "application/pdf",
      byteSize: 64,
      bytes: pdfBytes(),
    });
    assert.equal(result.extension, "pdf");
    assert.equal(result.mimeType, "application/pdf");
    assert.equal(result.filename, "Priya-Natarajan.pdf");
  });

  it("accepts a PDF when the browser omits a MIME type", () => {
    const result = validateResumeUpload({
      filename: "cv.pdf",
      mimeType: "",
      byteSize: 64,
      bytes: pdfBytes(),
    });
    assert.equal(result.mimeType, "application/pdf");
  });

  it("accepts a Word .doc with an OLE header", () => {
    const bytes = oleDocBytes();
    const result = validateResumeUpload({
      filename: "cv.doc",
      mimeType: "application/msword",
      byteSize: bytes.byteLength,
      bytes,
    });
    assert.equal(result.extension, "doc");
  });

  it("accepts a real DOCX zip with Word internals", () => {
    const bytes = validDocxBytes();
    const result = validateResumeUpload({
      filename: "cv.docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      byteSize: bytes.byteLength,
      bytes,
    });
    assert.equal(result.extension, "docx");
  });

  it("rejects an oversized resume", () => {
    assertResumeRejected({
      filename: "cv.pdf",
      mimeType: "application/pdf",
      byteSize: MAX_RESUME_BYTES + 1,
      bytes: pdfBytes(),
    });
  });

  it("rejects an empty file", () => {
    assertResumeRejected({
      filename: "cv.pdf",
      mimeType: "application/pdf",
      byteSize: 0,
      bytes: new Uint8Array(),
    });
  });

  it("rejects a missing file", () => {
    assertResumeRejected(null);
  });

  it("rejects executable files even with a pdf name", () => {
    const bytes = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]);
    assertResumeRejected({
      filename: "cv.pdf",
      mimeType: "application/pdf",
      byteSize: bytes.byteLength,
      bytes,
    });
  });

  it("rejects HTML disguised as a PDF", () => {
    const bytes = Buffer.from("<!DOCTYPE html><html><script>alert(1)</script></html>");
    assertResumeRejected({
      filename: "cv.pdf",
      mimeType: "application/pdf",
      byteSize: bytes.byteLength,
      bytes,
    });
  });

  it("rejects SVG disguised as a PDF", () => {
    const bytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script></script></svg>');
    assertResumeRejected({
      filename: "cv.pdf",
      mimeType: "application/pdf",
      byteSize: bytes.byteLength,
      bytes,
    });
  });

  it("rejects PHP and JavaScript uploads", () => {
    const php = Buffer.from("<?php echo 1;");
    const js = Buffer.from("console.log(1)");
    assertResumeRejected({
      filename: "shell.php",
      mimeType: "application/pdf",
      byteSize: php.byteLength,
      bytes: php,
    });
    assertResumeRejected({
      filename: "payload.js",
      mimeType: "text/javascript",
      byteSize: js.byteLength,
      bytes: js,
    });
  });

  it("rejects a zip that is not a Word document even with a docx name", () => {
    const bytes = makeZip([{ name: "readme.txt", data: Buffer.from("not a document") }]);
    assertResumeRejected({
      filename: "cv.docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      byteSize: bytes.byteLength,
      bytes,
    });
  });

  it("rejects a MIME type that does not match the file bytes", () => {
    assertResumeRejected({
      filename: "cv.pdf",
      mimeType: "application/msword",
      byteSize: 64,
      bytes: pdfBytes(),
    });
  });

  it("rejects an extension that does not match the file bytes", () => {
    assertResumeRejected({
      filename: "cv.docx",
      mimeType: "application/pdf",
      byteSize: 64,
      bytes: pdfBytes(),
    });
  });
});

describe("resume object keys", () => {
  it("builds a private randomised careers key", () => {
    const key = buildResumeObjectKey("pdf");
    assert.match(key, /^private\/careers\/\d{4}\/\d{2}\/[a-z0-9-]+\.pdf$/);
    assert.equal(key.includes("Priya"), false);
  });
});
