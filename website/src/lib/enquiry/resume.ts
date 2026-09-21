import { randomUUID } from "node:crypto";
import { ALLOWED_RESUME_MIME_TYPES, MAX_RESUME_BYTES } from "@/lib/constants";
import { ValidationError } from "@/lib/errors";

const EXTENSION_TO_MIME: Record<string, (typeof ALLOWED_RESUME_MIME_TYPES)[number]> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

const DANGEROUS_EXTENSIONS = new Set([
  "exe",
  "bat",
  "cmd",
  "com",
  "scr",
  "pif",
  "cpl",
  "msi",
  "msp",
  "dll",
  "so",
  "dylib",
  "js",
  "mjs",
  "cjs",
  "jsx",
  "ts",
  "tsx",
  "php",
  "phtml",
  "phar",
  "asp",
  "aspx",
  "jsp",
  "cgi",
  "sh",
  "bash",
  "zsh",
  "ps1",
  "vbs",
  "vbe",
  "wsf",
  "wsh",
  "hta",
  "html",
  "htm",
  "shtml",
  "svg",
  "xhtml",
  "wasm",
  "jar",
  "apk",
  "app",
  "deb",
  "rpm",
  "dmg",
  "iso",
  "lnk",
  "reg",
  "inf",
  "msc",
  "cab",
]);

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

function resumeError(message: string): ValidationError {
  return new ValidationError(message, undefined, { resume: message });
}

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

function readU16(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
}

function readU32(bytes: Uint8Array, offset: number): number {
  const b0 = bytes[offset] ?? 0;
  const b1 = bytes[offset + 1] ?? 0;
  const b2 = bytes[offset + 2] ?? 0;
  const b3 = bytes[offset + 3] ?? 0;
  return (b0 | (b1 << 8) | (b2 << 16) | (b3 << 24)) >>> 0;
}

function listZipEntryNames(bytes: Uint8Array): string[] | null {
  const maxComment = 65_535;
  const minEocd = 22;
  if (bytes.byteLength < minEocd) {
    return null;
  }

  const scanStart = Math.max(0, bytes.byteLength - minEocd - maxComment);
  let eocd = -1;
  for (let index = bytes.byteLength - minEocd; index >= scanStart; index -= 1) {
    if (
      bytes[index] === 0x50 &&
      bytes[index + 1] === 0x4b &&
      bytes[index + 2] === 0x05 &&
      bytes[index + 3] === 0x06
    ) {
      eocd = index;
      break;
    }
  }
  if (eocd < 0) {
    return null;
  }

  const entryCount = readU16(bytes, eocd + 10);
  const cdSize = readU32(bytes, eocd + 12);
  const cdOffset = readU32(bytes, eocd + 16);
  if (entryCount === 0 || cdOffset + cdSize > bytes.byteLength) {
    return null;
  }

  const names: string[] = [];
  const decoder = new TextDecoder("utf-8");
  let offset = cdOffset;
  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > bytes.byteLength || readU32(bytes, offset) !== 0x02014b50) {
      return null;
    }
    const nameLen = readU16(bytes, offset + 28);
    const extraLen = readU16(bytes, offset + 30);
    const commentLen = readU16(bytes, offset + 32);
    const nameStart = offset + 46;
    const nameEnd = nameStart + nameLen;
    if (nameEnd > bytes.byteLength) {
      return null;
    }
    names.push(decoder.decode(bytes.subarray(nameStart, nameEnd)));
    offset = nameEnd + extraLen + commentLen;
  }

  return names;
}

function isDocxArchive(bytes: Uint8Array): boolean {
  const names = listZipEntryNames(bytes);
  if (!names) {
    return false;
  }
  const hasContentTypes = names.includes("[Content_Types].xml");
  const hasWord = names.some((name) => name === "word/" || name.startsWith("word/"));
  return hasContentTypes && hasWord;
}

function detectKind(bytes: Uint8Array): "pdf" | "doc" | "docx" | "exe" | "unknown" {
  if (startsWith(bytes, [0x4d, 0x5a]) || startsWith(bytes, [0x7f, 0x45, 0x4c, 0x46])) {
    return "exe";
  }
  if (startsWith(bytes, Buffer.from("%PDF"))) {
    return "pdf";
  }
  if (startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) {
    return "doc";
  }
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) || startsWith(bytes, [0x50, 0x4b, 0x05, 0x06])) {
    return isDocxArchive(bytes) ? "docx" : "unknown";
  }
  return "unknown";
}

export function sanitizeResumeFilename(filename: string): string {
  const base = filename.replace(/\\/g, "/").split("/").pop() ?? "";
  const cleaned = base
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^\.+/, "")
    .replace(/\.+$/, "");
  if (!cleaned) {
    return "";
  }

  const parts = cleaned.split(".").filter((part) => part.length > 0);
  if (parts.length < 2) {
    return "";
  }

  const extension = parts.pop()?.toLowerCase();
  if (!extension || !(extension in EXTENSION_TO_MIME)) {
    return "";
  }

  const safeParts = parts.filter((part) => !DANGEROUS_EXTENSIONS.has(part.toLowerCase()));
  const stem = (safeParts.join("-") || "resume").replace(/^-+|-+$/g, "").slice(0, 80) || "resume";
  return `${stem}.${extension}`;
}

export function buildResumeObjectKey(extension: string): string {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `private/careers/${year}/${month}/${randomUUID()}.${extension}`;
}

export function validateResumeUpload(upload: ResumeUpload | null | undefined): ValidatedResume {
  if (!upload) {
    throw resumeError("A resume is required.");
  }

  if (upload.byteSize <= 0 || upload.bytes.byteLength <= 0) {
    throw resumeError("A resume is required.");
  }

  if (upload.byteSize > MAX_RESUME_BYTES || upload.bytes.byteLength > MAX_RESUME_BYTES) {
    throw resumeError("Resume must be 5 MB or smaller.");
  }

  const filename = sanitizeResumeFilename(upload.filename);
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!filename || !extension || !(extension in EXTENSION_TO_MIME)) {
    throw resumeError("Upload a PDF or Word document.");
  }

  const expectedMime = EXTENSION_TO_MIME[extension];
  if (!expectedMime) {
    throw resumeError("Upload a PDF or Word document.");
  }

  const declaredMime = upload.mimeType.trim().toLowerCase();
  const allowedMimes = ALLOWED_RESUME_MIME_TYPES as readonly string[];
  if (declaredMime) {
    if (!allowedMimes.includes(declaredMime) || declaredMime !== expectedMime) {
      throw resumeError("Upload a PDF or Word document.");
    }
  }

  const kind = detectKind(upload.bytes);
  if (kind === "exe" || kind === "unknown") {
    throw resumeError("Upload a PDF or Word document.");
  }
  if (kind !== extension) {
    throw resumeError("Upload a PDF or Word document.");
  }

  return {
    filename,
    mimeType: expectedMime,
    extension,
    byteSize: upload.bytes.byteLength,
    bytes: upload.bytes,
  };
}
