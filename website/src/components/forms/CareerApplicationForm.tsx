"use client";

import { useState } from "react";
import { EnquiryFormShell } from "@/components/forms/EnquiryFormShell";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Textarea } from "@/design-system/components/textarea";
import { submitCareerEnquiry } from "@/server/actions/enquiries";
import type { EnquiryFormState } from "@/types";

type CareerApplicationFormProps = {
  sourcePath?: string;
};

const emptyValues = {
  name: "",
  email: "",
  phone: "",
  role: "",
  message: "",
};

export function CareerApplicationForm({ sourcePath = "/careers" }: CareerApplicationFormProps) {
  return (
    <EnquiryFormShell
      action={submitCareerEnquiry}
      sourcePath={sourcePath}
      submitLabel="Submit application"
      pendingLabel="Submitting"
      encType="multipart/form-data"
    >
      {(state, pending) => <CareerFields state={state} pending={pending} />}
    </EnquiryFormShell>
  );
}

function CareerFields({
  state,
  pending,
}: {
  state: EnquiryFormState;
  pending: boolean;
}) {
  const [values, setValues] = useState(emptyValues);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" htmlFor="career-name" error={state.fieldErrors?.name}>
          <Input
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            readOnly={pending}
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          />
        </Field>
        <Field label="Email" htmlFor="career-email" error={state.fieldErrors?.email}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            readOnly={pending}
            value={values.email}
            onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          />
        </Field>
      </div>
      <Field label="Phone" htmlFor="career-phone" error={state.fieldErrors?.phone}>
        <Input
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          maxLength={40}
          readOnly={pending}
          value={values.phone}
          onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
        />
      </Field>
      <Field
        label="Role of interest"
        htmlFor="career-role"
        hint="Optional"
        error={state.fieldErrors?.role}
      >
        <Input
          name="role"
          maxLength={120}
          readOnly={pending}
          value={values.role}
          onChange={(event) => setValues((current) => ({ ...current, role: event.target.value }))}
        />
      </Field>
      <Field label="Cover note" htmlFor="career-message" error={state.fieldErrors?.message}>
        <Textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          readOnly={pending}
          value={values.message}
          onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
        />
      </Field>
      <Field
        label="Resume"
        htmlFor="career-resume"
        hint="PDF or Word document, 5 MB or smaller."
        error={state.fieldErrors?.resume}
      >
        <Input
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className={pending ? "pointer-events-none opacity-60" : undefined}
        />
      </Field>
    </>
  );
}
