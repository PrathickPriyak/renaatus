import type { Prisma, PrismaClient } from "../../../generated/prisma/client";

export async function writeAudit(
  db: PrismaClient,
  input: {
    userId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Prisma.InputJsonValue;
    ip?: string | null;
  },
): Promise<void> {
  await db.auditLog.create({
    data: {
      userId: input.userId ?? undefined,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? undefined,
      metadata: input.metadata,
      ip: input.ip ?? undefined,
    },
  });
}
