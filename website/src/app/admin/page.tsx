import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/design-system/components/card";
import { getDashboardSnapshot } from "@/lib/admin/dashboard";
import { formatAdminDateTime, humanizeAuditAction } from "@/lib/admin/format";
import { requireAdminPage } from "@/lib/admin/guard";
import { canManageBlog } from "@/lib/auth/permissions";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const actor = await requireAdminPage("/admin");
  const snapshot = await getDashboardSnapshot(getDb(), actor);

  const stats = [
    {
      label: "Total enquiries",
      value: snapshot.totalEnquiries,
      href: "/admin/enquiries",
    },
    {
      label: "New enquiries",
      value: snapshot.newEnquiries,
      href: "/admin/enquiries?status=NEW",
    },
    {
      label: "Contact enquiries",
      value: snapshot.contactEnquiries,
      href: "/admin/enquiries?kind=CONTACT",
    },
    {
      label: "Product enquiries",
      value: snapshot.productEnquiries,
      href: "/admin/enquiries?kind=PRODUCT",
    },
    {
      label: "Career applications",
      value: snapshot.careerApplications,
      href: "/admin/enquiries?kind=CAREER",
    },
    {
      label: "Journal entries",
      value: snapshot.blogCount,
      href: canManageBlog(actor.role) ? "/admin/blog" : "/admin",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Administration"
        title="Dashboard"
        description="Counts from PostgreSQL. Enquiry details stay on protected enquiry pages."
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link href={stat.href} className="block h-full">
              <Card className="hover:border-brass/50 h-full transition-colors duration-200">
                <p className="text-caption text-cream-muted tracking-[0.14em] uppercase">
                  {stat.label}
                </p>
                <p className="font-display text-cream mt-4 text-4xl tabular-nums">
                  {stat.value}
                </p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="font-display text-h3 text-cream">Recent activity</h2>
        {snapshot.recentActivity.length === 0 ? (
          <p className="text-body text-cream-muted mt-4">
            No staff actions have been logged yet.
          </p>
        ) : (
          <ul className="border-line divide-line mt-5 divide-y overflow-hidden rounded-sm border">
            {snapshot.recentActivity.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-cream text-sm">{humanizeAuditAction(item.action)}</p>
                  <p className="text-caption text-cream-muted mt-1">
                    {item.entityType}
                    {item.actorName ? ` · ${item.actorName}` : ""}
                  </p>
                </div>
                <p className="text-caption text-cream-muted whitespace-nowrap">
                  {formatAdminDateTime(item.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
