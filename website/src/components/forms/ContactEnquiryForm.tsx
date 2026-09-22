"use client";

import { useState } from "react";
import { EnquiryFormShell } from "@/components/forms/EnquiryFormShell";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Select } from "@/design-system/components/select";
import { Textarea } from "@/design-system/components/textarea";
import { submitContactEnquiry } from "@/server/actions/enquiries";
import { CONTACT_OFFICE_OPTIONS } from "@/lib/validations/enquiry";
import type { EnquiryFormState } from "@/types";

type ContactEnquiryFormProps = {
  sourcePath?: string;
};

const emptyValues = {
  name: "",
  email: "",
  phone: "",
  office: "india",
  subject: "",
  message: "",
};

export function ContactEnquiryForm({ sourcePath = "/contact" }: ContactEnquiryFormProps) {
  return (
    <EnquiryFormShell
      action={submitContactEnquiry}
      sourcePath={sourcePath}
      submitLabel="Send message"
      pendingLabel="Sending"
    >
      {(state, pending) => <ContactFields state={state} pending={pending} />}
    </EnquiryFormShell>
  );
}

function ContactFields({
  state,
  pending,
}: {
  state: EnquiryFormState;
  pending: boolean;
}) {
  const [values, setValues] = useState(emptyValues);

  return (
    <>
      <div className="grid min-w-0 gap-5 md:grid-cols-2 md:[&>*]:min-w-0">
        <Field label="Name" htmlFor="contact-name" error={state.fieldErrors?.name}>
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
        <Field label="Email" htmlFor="contact-email" error={state.fieldErrors?.email}>
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
        <Field label="Phone" htmlFor="contact-phone" error={state.fieldErrors?.phone}>
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
        <Field label="Office" htmlFor="contact-office" error={state.fieldErrors?.office}>
          <Select
            name="office"
            required
            value={values.office}
            onChange={(event) => setValues((current) => ({ ...current, office: event.target.value }))}
          >
            {CONTACT_OFFICE_OPTIONS.map((office) => (
              <option key={office.value} value={office.value}>
                {office.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Subject" htmlFor="contact-subject" error={state.fieldErrors?.subject}>
        <Input
          name="subject"
          required
          maxLength={200}
          readOnly={pending}
          value={values.subject}
          onChange={(event) => setValues((current) => ({ ...current, subject: event.target.value }))}
        />
      </Field>
      <Field label="Message" htmlFor="contact-message" error={state.fieldErrors?.message}>
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
    </>
  );
}
