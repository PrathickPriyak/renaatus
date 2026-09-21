import { createHash, createHmac } from "node:crypto";
import { AppError } from "@/lib/errors";

const REGION = "auto";
const SERVICE = "s3";

export type R2Credentials = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

function sha256Hex(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

function encodeRfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => {
    return `%${char.charCodeAt(0).toString(16).toUpperCase()}`;
  });
}

function encodeKeyPath(key: string): string {
  return key.split("/").map(encodeRfc3986).join("/");
}

function amzDateParts(now: Date): { amzDate: string; ymd: string } {
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return { amzDate, ymd: amzDate.slice(0, 8) };
}

export function isPrivateR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_PRIVATE,
  );
}

export function readPrivateR2Credentials(): R2Credentials {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_PRIVATE;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new AppError("File storage is not configured.", "STORAGE_UNAVAILABLE", 503, false);
  }
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

export async function r2Request(input: {
  method: "PUT" | "GET" | "DELETE";
  credentials: R2Credentials;
  key: string;
  body?: Uint8Array;
  mimeType?: string;
  now?: Date;
}): Promise<Response> {
  const { credentials, method, key } = input;
  const { amzDate, ymd } = amzDateParts(input.now ?? new Date());
  const host = `${credentials.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodeRfc3986(credentials.bucket)}/${encodeKeyPath(key)}`;
  const body = input.body ? Buffer.from(input.body) : Buffer.alloc(0);
  const payloadHash = sha256Hex(body);

  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (method === "PUT") {
    headers["content-type"] = input.mimeType ?? "application/octet-stream";
    headers["content-length"] = String(body.byteLength);
  }

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaderNames
    .map((name) => `${name}:${headers[name]?.trim() ?? ""}\n`)
    .join("");
  const signedHeaders = signedHeaderNames.join(";");
  const canonicalRequest = [
    method,
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${ymd}/${REGION}/${SERVICE}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join(
    "\n",
  );
  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${credentials.secretAccessKey}`, ymd), REGION), SERVICE),
    "aws4_request",
  );
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  headers.authorization = `AWS4-HMAC-SHA256 Credential=${credentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return fetch(`https://${host}${canonicalUri}`, {
    method,
    headers,
    body: method === "PUT" ? body : undefined,
  });
}

export async function putR2Object(input: {
  key: string;
  body: Uint8Array;
  mimeType: string;
}): Promise<{ bucket: string; key: string }> {
  const credentials = readPrivateR2Credentials();
  const response = await r2Request({
    method: "PUT",
    credentials,
    key: input.key,
    body: input.body,
    mimeType: input.mimeType,
  });
  if (!response.ok) {
    throw new AppError("File storage is not configured.", "STORAGE_UNAVAILABLE", 503, false);
  }
  return { bucket: credentials.bucket, key: input.key };
}

export async function getR2Object(key: string): Promise<{ body: Uint8Array } | null> {
  const credentials = readPrivateR2Credentials();
  const response = await r2Request({ method: "GET", credentials, key });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new AppError("File storage is not configured.", "STORAGE_UNAVAILABLE", 503, false);
  }
  return { body: new Uint8Array(await response.arrayBuffer()) };
}

export async function deleteR2Object(key: string): Promise<void> {
  const credentials = readPrivateR2Credentials();
  const response = await r2Request({ method: "DELETE", credentials, key });
  if (response.status !== 404 && !response.ok) {
    throw new AppError("File storage is not configured.", "STORAGE_UNAVAILABLE", 503, false);
  }
}
