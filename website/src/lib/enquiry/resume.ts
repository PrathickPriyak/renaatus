import { randomUUID } from "node:crypto";
import { ALLOWED_RESUME_MIME_TYPES, MAX_RESUME_BYTES } from "@/lib/constants";
import { ValidationError } from "@/lib/errors";

const EXTENSION_TO_MIME: Record<string, (typeof ALLOWED_RESUME_MIME_TYPES)[number]> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export type ResumeUpload = {
  filename: string;
  mimeType: string;
  byteSize: number;
  bytes: Uint8Array;
};

export type ValidatedResume = {
  filename: string;
  mimeType: (typeof ALLOWED_RESUME_MIME_TYPES)[number];
  extension: string;
  byteSize: number;
  bytes: Uint8Array;
};

function startsWith(bytes: Uint8Array, signature: number[] | Uint8Array): boolean {
  if (bytes.byteLength < signature.length) {
    return false;
  }
  for (let index = 0; index < signature.length; index += 1) {
    if (bytes[index] !== signature[index]) {
      return false;
    }
  }
  return true;
}

function detectKind(bytes: Uint8Array): "pdf" | "doc" | "docx" | "exe" | "unknown" {
  if (startsWith(bytes, [0x4d, 0x5a])) {
    return "exe";
  }
  if (startsWith(bytes, Buffer.from("%PDF"))) {
    return "pdf";
  }
  if (startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) {
    return "doc";
  }
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) || startsWith(bytes, [0x50, 0x4b, 0x05, 0x06])) {
    return "docx";
  }
  return "unknown";
}

export function sanitizeResumeFilename(filename: string): string {
  const base = filename.replace(/\\/g, "/").split("/").pop() ?? "resume";
  const cleaned = base.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^\.+/, "");
  const match = cleaned.match(/(.+?)\.(pdf|doc|docx)$/i);
  if (!match?.[1] || !match[2]) {
    return "resume.pdf";
  }
  const stem = match[1].slice(0, 80) || "resume";
  return `${stem}.${match[2].toLowerCase()}`;
}

export function buildResumeObjectKey(extension: string): string {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `private/careers/${year}/${month}/${randomUUID()}.${extension}`;
}

export function validateResumeUpload(upload: ResumeUpload | null | undefined): ValidatedResume {
  if (!upload) {
    throw new ValidationError("A resume is required.");
  }

  if (upload.byteSize <= 0 || upload.bytes.byteLength <= 0) {
    throw new ValidationError("A resume is required.");
  }

  if (upload.byteSize > MAX_RESUME_BYTES || upload.bytes.byteLength > MAX_RESUME_BYTES) {
    throw new ValidationError("Resume must be 5 MB or smaller.");
  }

  const filename = sanitizeResumeFilename(upload.filename);
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension || !(extension in EXTENSION_TO_MIME)) {
    throw new ValidationError("Upload a PDF or Word document.");
  }

  const expectedMime = EXTENSION_TO_MIME[extension];
  const declaredMime = upload.mimeType.toLowerCase();
  const allowedMimes = ALLOWED_RESUME_MIME_TYPES as readonly string[];
  if (!expectedMime || !allowedMimes.includes(declaredMime) || declaredMime !== expectedMime) {
    throw new ValidationError("Upload a PDF or Word document.");
  }

  const kind = detectKind(upload.bytes);
  if (kind === "exe" || kind === "unknown") {
    throw new ValidationError("Upload a PDF or Word document.");
  }
  if (kind === "pdf" && extension !== "pdf") {
    throw new ValidationError("Upload a PDF or Word document.");
  }
  if (kind === "doc" && extension !== "doc") {
    throw new ValidationError("Upload a PDF or Word document.");
  }
  if (kind === "docx" && extension !== "docx") {
    throw new ValidationError("Upload a PDF or Word document.");
  }

  return {
    filename,
    mimeType: expectedMime,
    extension,
    byteSize: upload.bytes.byteLength,
    bytes: upload.bytes,
  };
}
