import { createHash } from "node:crypto";

export function readClientIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first.slice(0, 64);
    }
  }

  const real = headerList.get("x-real-ip")?.trim();
  if (real) {
    return real.slice(0, 64);
  }

  return "0.0.0.0";
}

export function hashClientIp(ip: string): string {
  const salt = process.env.AUTH_SECRET ?? "renaatus-enquiry-ip";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
