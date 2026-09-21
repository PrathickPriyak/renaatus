import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader, StatusBadge } from "@/components/admin/AdminPageHeader";
import { Button } from "@/design-system/components/button";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Select } from "@/design-system/components/select";
import { listEnquiriesForAdmin, parseEnquiryListFilters } from "@/lib/admin/enquiries";
import {
  formatAdminDateTime,
  humanizeEnquiryKindLabel,
  humanizeEnquiryStatusLabel,
} from "@/lib/admin/format";
import { requireAdminPage } from "@/lib/admin/guard";
import { enquiryListHref, toURLSearchParams } from "@/lib/admin/search-params";
import { canExportEnquiries, canViewEnquiries } from "@/lib/auth/permissions";
import { ENQUIRY_KINDS, ENQUIRY_STATUSES } from "@/lib/constants";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function statusTone(status: "NEW" | "IN_PROGRESS" | "CLOSED") {
  if (status === "NEW") return "new" as const;
  if (status === "IN_PROGRESS") return "progress" as const;
  return "closed" as const;
}

export default async function AdminEnquiriesPage({ searchParams }: PageProps) {
  const actor = await requireAdminPage("/admin/enquiries", canViewEnquiries);
  const raw = await searchParams;
  const filters = parseEnquiryListFilters(toURLSearchParams(raw));
  const listed = await listEnquiriesForAdmin(getDb(), actor, filters);
  const canExport = canExportEnquiries(actor.role);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Enquiries"
        title="Inbox"
        description="Search, filter, and review submissions. Private resume files are only available from the detail page."
      />

      <form
        method="get"
        className="border-line bg-panel/60 mt-8 grid gap-4 rounded-sm border p-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end"
      >
        <Field label="Search" htmlFor="q">
          <Input
            id="q"
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Name or email"
          />
        </Field>
        <Field label="Type" htmlFor="kind">
          <Select id="kind" name="kind" defaultValue={filters.kind ?? ""}>
            <option value="">All types</option>
            {ENQUIRY_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {humanizeEnquiryKindLabel(kind)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={filters.status ?? ""}>
            <option value="">All statuses</option>
            {ENQUIRY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {humanizeEnquiryStatusLabel(status)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Sort" htmlFor="sort">
          <Select id="sort" name="sort" defaultValue={filters.sort}>
            <option value="-createdAt">Newest first</option>
            <option value="createdAt">Oldest first</option>
          </Select>
        </Field>
        <Button type="submit" className="w-full lg:mb-0.5">
          Apply
        </Button>
      </form>

      {canExport ? (
        <form
          method="get"
          action="/admin/enquiries/export"
          className="border-line bg-panel/40 mt-4 grid gap-4 rounded-sm border p-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end"
        >
          {filters.kind ? <input type="hidden" name="kind" value={filters.kind} /> : null}
          {filters.status ? (
            <input type="hidden" name="status" value={filters.status} />
          ) : null}
          <Field label="From date" htmlFor="from">
            <Input id="from" name="from" type="date" />
          </Field>
          <Field label="To date" htmlFor="to">
            <Input id="to" name="to" type="date" />
          </Field>
          <div className="lg:col-span-3">
            <Button type="submit" variant="secondary">
              Export Excel
            </Button>
            <p className="text-caption text-cream-muted mt-2">
              Downloads the current type and status, optionally limited by date.
              PostgreSQL remains the record.
            </p>
          </div>
        </form>
      ) : null}

      <p className="text-caption text-cream-muted mt-8">
        {listed.total} {listed.total === 1 ? "enquiry" : "enquiries"}
      </p>

      {listed.rows.length === 0 ? (
        <p className="text-body text-cream-muted mt-6">
          No enquiries match these filters.
        </p>
      ) : (
        <>
          <ul className="mt-4 grid gap-3 md:hidden">
            {listed.rows.map((row) => (
              <li key={row.id} className="border-line rounded-sm border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-cream text-sm">{row.name}</p>
                    <p className="text-caption text-cream-muted mt-1">{row.email}</p>
                  </div>
                  <StatusBadge
                    label={humanizeEnquiryStatusLabel(row.status)}
                    tone={statusTone(row.status)}
                  />
                </div>
                <p className="text-caption text-cream-muted mt-3">
                  {humanizeEnquiryKindLabel(row.kind)} ·{" "}
                  {formatAdminDateTime(row.createdAt)}
                </p>
                <Link
                  href={`/admin/enquiries/${row.id}`}
                  className="text-caption text-brass mt-4 inline-block tracking-[0.12em] uppercase"
                >
                  View details
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-line mt-4 hidden overflow-x-auto rounded-sm border md:block">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-ink-soft text-caption text-cream-muted tracking-[0.12em] uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {listed.rows.map((row) => (
                  <tr key={row.id} className="border-line border-t">
                    <td className="px-4 py-3">
                      <p className="text-cream">{row.name}</p>
                      <p className="text-caption text-cream-muted mt-1">{row.email}</p>
                    </td>
                    <td className="text-cream-muted px-4 py-3">
                      {humanizeEnquiryKindLabel(row.kind)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={humanizeEnquiryStatusLabel(row.status)}
                        tone={statusTone(row.status)}
                      />
                    </td>
                    <td className="text-cream-muted px-4 py-3 whitespace-nowrap">
                      {formatAdminDateTime(row.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/enquiries/${row.id}`}
                        className="text-caption text-brass tracking-[0.12em] uppercase"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {listed.pageCount > 1 ? (
        <nav
          className="mt-8 flex items-center justify-between gap-4"
          aria-label="Pagination"
        >
          {listed.page > 1 ? (
            <Link
              href={enquiryListHref({ ...filters, page: listed.page - 1 })}
              className="text-caption text-cream tracking-[0.12em] uppercase"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <p className="text-caption text-cream-muted">
            Page {listed.page} of {listed.pageCount}
          </p>
          {listed.page < listed.pageCount ? (
            <Link
              href={enquiryListHref({ ...filters, page: listed.page + 1 })}
              className="text-caption text-cream tracking-[0.12em] uppercase"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
