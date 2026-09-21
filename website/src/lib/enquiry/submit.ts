import type { PrismaClient } from "../../../generated/prisma/client";
import { getProductBySlug } from "@/lib/catalog";
import { ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import {
  buildResumeObjectKey,
  validateResumeUpload,
  type ResumeUpload,
  type ValidatedResume,
} from "@/lib/enquiry/resume";
import type { EnquiryNotification } from "@/lib/enquiry/notify";
import { consumeEnquiryRateLimits } from "@/lib/security/rate-limit";
import { hashClientIp } from "@/lib/security/ip";
import { sanitizeEnquiryFields } from "@/lib/security/sanitize";
import { isSpamEnquiry } from "@/lib/security/spam";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import { putPrivateObject, deletePrivateObject } from "@/lib/storage/private-object";
import {
  careerEnquirySchema,
  contactEnquirySchema,
  productEnquirySchema,
} from "@/lib/validations/enquiry";
import type { EnquiryKind } from "@/types/domain";

export type EnquirySubmitInput = {
  kind: Exclude<EnquiryKind, "PROJECT">;
  fields: Record<string, string>;
  ip: string;
  resume?: ResumeUpload | null;
};

export type EnquirySubmitResult =
  | { status: "stored"; id: string }
  | { status: "ignored" };

export type StoredResume = {
  id: string;
  key: string;
};

export type EnquirySubmitDeps = {
  db: PrismaClient;
  now?: () => number;
  notify?: (notification: EnquiryNotification) => Promise<void>;
  rateLimit?: (input: { ip: string; email: string; now?: () => number }) => Promise<void>;
  verifyTurnstile?: (input: { token?: string; ip: string }) => Promise<void>;
  storeResume?: (resume: ValidatedResume) => Promise<StoredResume>;
};

async function defaultStoreResume(
  db: PrismaClient,
  resume: ValidatedResume,
): Promise<StoredResume> {
  const key = buildResumeObjectKey(resume.extension);
  const stored = await putPrivateObject({
    key,
    body: resume.bytes,
    mimeType: resume.mimeType,
  });

  try {
    const media = await db.media.create({
      data: {
        key: stored.key,
        bucket: stored.bucket,
        filename: resume.filename,
        mimeType: resume.mimeType,
        byteSize: resume.byteSize,
        visibility: "PRIVATE",
      },
    });

    return { id: media.id, key: media.key };
  } catch (error) {
    try {
      await deletePrivateObject(stored.key);
    } catch (cleanupError) {
      logger.exception("resume_object_cleanup_failed", cleanupError, { key: stored.key });
    }
    throw error;
  }
}

async function resolveProductId(db: PrismaClient, slug: string): Promise<string> {
  const catalog = getProductBySlug(slug);
  if (!catalog) {
    throw new ValidationError("Unknown product.");
  }

  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    return existing.id;
  }

  const created = await db.product.create({
    data: {
      name: catalog.name,
      slug: catalog.slug,
      summary: catalog.copy,
      published: true,
    },
  });
  return created.id;
}

function parseKind(kind: EnquirySubmitInput["kind"], fields: Record<string, string>) {
  if (kind === "CONTACT") {
    const parsed = contactEnquirySchema.safeParse(fields);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid input.",
        parsed.error,
      );
    }
    return parsed.data;
  }

  if (kind === "PRODUCT") {
    const parsed = productEnquirySchema.safeParse(fields);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid input.",
        parsed.error,
      );
    }
    return parsed.data;
  }

  const parsed = careerEnquirySchema.safeParse(fields);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues[0]?.message ?? "Invalid input.",
      parsed.error,
    );
  }
  return parsed.data;
}

export async function submitEnquiry(
  input: EnquirySubmitInput,
  deps: EnquirySubmitDeps,
): Promise<EnquirySubmitResult> {
  const sanitized = sanitizeEnquiryFields(input.fields);
  const parsed = parseKind(input.kind, sanitized);

  if (parsed.honeypot.trim().length > 0) {
    logger.warn("enquiry_honeypot_triggered", { kind: input.kind });
    return { status: "ignored" };
  }

  if (isSpamEnquiry({ name: parsed.name, email: parsed.email, message: parsed.message })) {
    throw new ValidationError("Unable to send your message.");
  }

  const rateLimit = deps.rateLimit ?? consumeEnquiryRateLimits;
  await rateLimit({ ip: input.ip, email: parsed.email, now: deps.now });

  const verifyTurnstile = deps.verifyTurnstile ?? verifyTurnstileToken;
  await verifyTurnstile({ token: parsed.turnstileToken, ip: input.ip });

  let productId: string | undefined;
  let resumeId: string | undefined;
  let productSlug: string | undefined;
  let role: string | undefined;
  let subject: string | undefined;
  let office: string | undefined;
  let hasResume = false;

  if (parsed.kind === "PRODUCT") {
    productSlug = parsed.productSlug;
    productId = await resolveProductId(deps.db, parsed.productSlug);
    subject = `Product enquiry: ${parsed.productSlug}`;
  }

  if (parsed.kind === "CONTACT") {
    office = parsed.office;
    subject = parsed.subject;
  }

  let storedResume: StoredResume | undefined;

  if (parsed.kind === "CAREER") {
    role = parsed.role;
    subject = parsed.role ? `Career application: ${parsed.role}` : "Career application";
    const validated = validateResumeUpload(input.resume);
    const storeResume = deps.storeResume ?? ((resume) => defaultStoreResume(deps.db, resume));
    storedResume = await storeResume(validated);
    resumeId = storedResume.id;
    hasResume = true;
  }

  let enquiry;
  try {
    enquiry = await deps.db.enquiry.create({
      data: {
        kind: parsed.kind,
        status: "NEW",
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        subject,
        message: parsed.message,
        office,
        sourcePath: parsed.sourcePath,
        ipHash: hashClientIp(input.ip),
        productId,
        resumeId,
      },
    });
  } catch (error) {
    if (storedResume) {
      try {
        await deletePrivateObject(storedResume.key);
      } catch (cleanupError) {
        logger.exception("resume_object_cleanup_failed", cleanupError, {
          key: storedResume.key,
        });
      }
      try {
        await deps.db.media.delete({ where: { id: storedResume.id } });
      } catch (cleanupError) {
        logger.exception("resume_media_cleanup_failed", cleanupError, {
          mediaId: storedResume.id,
        });
      }
    }
    throw error;
  }

  const notification: EnquiryNotification = {
    kind: parsed.kind,
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    subject,
    message: parsed.message,
    office,
    sourcePath: parsed.sourcePath,
    productSlug,
    role,
    hasResume,
  };

  try {
    const notify =
      deps.notify ?? (await import("@/lib/enquiry/notify")).notifyEnquiry;
    await notify(notification);
  } catch (error) {
    logger.exception("enquiry_notify_failed", error, { kind: parsed.kind });
  }

  return { status: "stored", id: enquiry.id };
}
