import type { PrismaClient } from "../../../generated/prisma/client";
import { requireStaff } from "@/lib/admin/require-actor";
import type { Actor } from "@/lib/auth/session";

export type DashboardActivity = {
  id: string;
  action: string;
  entityType: string;
  createdAt: Date;
  actorName: string | null;
};

export type DashboardSnapshot = {
  totalEnquiries: number;
  newEnquiries: number;
  contactEnquiries: number;
  productEnquiries: number;
  careerApplications: number;
  blogCount: number;
  recentActivity: DashboardActivity[];
};

export async function getDashboardSnapshot(
  db: PrismaClient,
  actor: Actor | null,
): Promise<DashboardSnapshot> {
  requireStaff(actor);

  const [
    totalEnquiries,
    newEnquiries,
    contactEnquiries,
    productEnquiries,
    careerApplications,
    blogCount,
    recentLogs,
  ] = await Promise.all([
    db.enquiry.count(),
    db.enquiry.count({ where: { status: "NEW" } }),
    db.enquiry.count({ where: { kind: "CONTACT" } }),
    db.enquiry.count({ where: { kind: "PRODUCT" } }),
    db.enquiry.count({ where: { kind: "CAREER" } }),
    db.post.count(),
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        action: true,
        entityType: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    }),
  ]);

  return {
    totalEnquiries,
    newEnquiries,
    contactEnquiries,
    productEnquiries,
    careerApplications,
    blogCount,
    recentActivity: recentLogs.map((row) => ({
      id: row.id,
      action: row.action,
      entityType: row.entityType,
      createdAt: row.createdAt,
      actorName: row.user?.name ?? null,
    })),
  };
}
