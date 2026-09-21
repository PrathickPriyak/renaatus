"use client";

import { useActionState } from "react";
import { Button } from "@/design-system/components/button";
import { Field } from "@/design-system/components/field";
import { Select } from "@/design-system/components/select";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { humanizeEnquiryStatusLabel } from "@/lib/admin/format";
import { changeEnquiryStatusAction } from "@/server/actions/admin-enquiries";
import { initialAdminFormState } from "@/types";
import type { EnquiryStatus } from "@/types/domain";

type EnquiryStatusFormProps = {
  enquiryId: string;
  status: EnquiryStatus;
};

export function EnquiryStatusForm({ enquiryId, status }: EnquiryStatusFormProps) {
  const [state, action, pending] = useActionState(
    changeEnquiryStatusAction,
    initialAdminFormState,
  );

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="enquiryId" value={enquiryId} />
      <Field label="Status" htmlFor="status">
        <Select id="status" name="status" defaultValue={status} disabled={pending}>
          {ENQUIRY_STATUSES.map((value) => (
            <option key={value} value={value}>
              {humanizeEnquiryStatusLabel(value)}
            </option>
          ))}
        </Select>
      </Field>
      {state.status === "error" && state.message ? (
        <p className="text-caption text-danger" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === "success" && state.message ? (
        <p className="text-caption text-brass" role="status">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving" : "Update status"}
      </Button>
    </form>
  );
}
