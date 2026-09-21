import type { Metadata } from "next";
import { Container } from "@/design-system/components/container";
import { Heading } from "@/design-system/components/heading";
import { Text } from "@/design-system/components/text";
import { Button } from "@/design-system/components/button";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { getCurrentActor } from "@/lib/auth/current-actor";
import { canExportEnquiries } from "@/lib/auth/permissions";
import { ENQUIRY_KINDS, ENQUIRY_STATUSES } from "@/lib/constants";
import { humanizeEnquiryKind, humanizeEnquiryStatus } from "@/lib/enquiry/excel";
import { signOutStaff } from "@/server/actions/auth";

export const metadata: Metadata = {
  title: "Enquiry export",
  robots: { index: false, follow: false },
};

const KIND_OPTIONS = ENQUIRY_KINDS.map((kind) => ({
  value: kind,
  label: humanizeEnquiryKind(kind),
}));

const STATUS_OPTIONS = ENQUIRY_STATUSES.map((status) => ({
  value: status,
  label: humanizeEnquiryStatus(status),
}));

const selectClassName =
  "h-12 w-full min-w-0 rounded-sm border border-line bg-ink px-4 text-base text-cream outline-none md:text-sm focus-visible:border-brass";

export default async function AdminHomePage() {
  const actor = await getCurrentActor();
  if (!actor) {
    return null;
  }

  const canExport = canExportEnquiries(actor.role);

  return (
    <section className="py-16 md:py-24">
      <Container width="narrow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-caption text-brass tracking-[0.18em] uppercase">
              Administration
            </p>
            <Heading variant="h1" className="mt-4">
              Enquiry export
            </Heading>
          </div>
          <form action={signOutStaff}>
            <Button type="submit" variant="secondary" size="sm">
              Sign out
            </Button>
          </form>
        </div>
        <Text variant="muted" className="mt-4">
          Signed in as {actor.email}. PostgreSQL is the system of record. Excel downloads
          are snapshots for reporting only.
        </Text>

        {canExport ? (
          <form
            method="get"
            action="/admin/enquiries/export"
            className="border-line bg-panel/80 mt-10 grid gap-5 rounded-sm border p-6 md:p-8"
          >
            <Field
              label="Enquiry type"
              htmlFor="kind"
              hint="Leave as all to export every type."
            >
              <select id="kind" name="kind" className={selectClassName} defaultValue="">
                <option value="">All types</option>
                {KIND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Status"
              htmlFor="status"
              hint="Leave as all to export every status."
            >
              <select
                id="status"
                name="status"
                className={selectClassName}
                defaultValue=""
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="From date" htmlFor="from">
                <Input id="from" name="from" type="date" />
              </Field>
              <Field label="To date" htmlFor="to">
                <Input id="to" name="to" type="date" />
              </Field>
            </div>
            <Button type="submit" className="justify-self-start">
              Export Excel
            </Button>
          </form>
        ) : (
          <p className="text-caption text-danger mt-10" role="status">
            Your role cannot export enquiries. Ask a super administrator for a download.
          </p>
        )}
      </Container>
    </section>
  );
}
