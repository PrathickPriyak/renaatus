import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminPageHeader";
import { EnquiryStatusForm } from "@/components/admin/EnquiryStatusForm";
import { Card } from "@/design-system/components/card";
import {
  getAuthorizedResumeDownloadHref,
  getEnquiryForAdmin,
} from "@/lib/admin/enquiries";
import {
  formatAdminDateTime,
  humanizeEnquiryKindLabel,
  humanizeEnquiryStatusLabel,
} from "@/lib/admin/format";
import { requireAdminPage } from "@/lib/admin/guard";
import { canViewEnquiries } from "@/lib/auth/permissions";
import { getDb } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";

export const metadata: Metadata = {
  title: "Enquiry",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEnquiryDetailPage({ params }: PageProps) {
  const actor = await requireAdminPage("/admin/enquiries", canViewEnquiries);
  const { id } = await params;
  const db = getDb();

  let enquiry;
  try {
    enquiry = await getEnquiryForAdmin(db, actor, id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const resumeHref = await getAuthorizedResumeDownloadHref(db, actor, enquiry.id);
  const tone =
    enquiry.status === "NEW"
      ? "new"
      : enquiry.status === "IN_PROGRESS"
        ? "progress"
        : "closed";

  return (
    <div>
      <AdminPageHeader
        eyebrow="Enquiry"
        title={enquiry.name}
        description={`${humanizeEnquiryKindLabel(enquiry.kind)} received ${formatAdminDateTime(enquiry.createdAt)}.`}
        actions={
          <Link
            href="/admin/enquiries"
            className="text-caption text-cream-muted hover:text-cream tracking-[0.12em] uppercase"
          >
            Back to inbox
          </Link>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Card>
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-caption text-cream-muted">Email</dt>
              <dd className="text-cream mt-1 break-all">{enquiry.email}</dd>
            </div>
            <div>
              <dt className="text-caption text-cream-muted">Phone</dt>
              <dd className="text-cream mt-1">{enquiry.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-caption text-cream-muted">Type</dt>
              <dd className="text-cream mt-1">
                {humanizeEnquiryKindLabel(enquiry.kind)}
              </dd>
            </div>
            <div>
              <dt className="text-caption text-cream-muted">Status</dt>
              <dd className="mt-1">
                <StatusBadge
                  label={humanizeEnquiryStatusLabel(enquiry.status)}
                  tone={tone}
                />
              </dd>
            </div>
            <div>
              <dt className="text-caption text-cream-muted">Subject</dt>
              <dd className="text-cream mt-1">{enquiry.subject ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-caption text-cream-muted">Office</dt>
              <dd className="text-cream mt-1">{enquiry.office ?? "—"}</dd>
            </div>
            {enquiry.product ? (
              <div>
                <dt className="text-caption text-cream-muted">Product</dt>
                <dd className="text-cream mt-1">{enquiry.product.name}</dd>
              </div>
            ) : null}
            {enquiry.project ? (
              <div>
                <dt className="text-caption text-cream-muted">Project</dt>
                <dd className="text-cream mt-1">{enquiry.project.name}</dd>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <dt className="text-caption text-cream-muted">Message</dt>
              <dd className="text-cream mt-2 max-w-prose whitespace-pre-wrap">
                {enquiry.message}
              </dd>
            </div>
            {enquiry.resume ? (
              <div className="sm:col-span-2">
                <dt className="text-caption text-cream-muted">Resume</dt>
                <dd className="mt-2">
                  {resumeHref ? (
                    <a
                      href={resumeHref}
                      className="text-brass tracking-[0.12em] uppercase"
                    >
                      Download {enquiry.resume.filename}
                    </a>
                  ) : (
                    <span className="text-cream">{enquiry.resume.filename}</span>
                  )}
                </dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <Card>
          <h2 className="font-display text-h4 text-cream">Update status</h2>
          <p className="text-caption text-cream-muted mt-2">
            Changes are written to PostgreSQL and recorded in the audit log.
          </p>
          <div className="mt-6">
            <EnquiryStatusForm enquiryId={enquiry.id} status={enquiry.status} />
          </div>
        </Card>
      </div>
    </div>
  );
}
