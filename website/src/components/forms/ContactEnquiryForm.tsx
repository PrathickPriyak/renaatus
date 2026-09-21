"use client";

import { EnquiryFormShell } from "@/components/forms/EnquiryFormShell";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Select } from "@/design-system/components/select";
import { Textarea } from "@/design-system/components/textarea";
import { submitContactEnquiry } from "@/server/actions/enquiries";
import { CONTACT_OFFICE_OPTIONS } from "@/lib/validations/enquiry";

type ContactEnquiryFormProps = {
  sourcePath?: string;
};

export function ContactEnquiryForm({ sourcePath = "/contact" }: ContactEnquiryFormProps) {
  return (
    <EnquiryFormShell
      action={submitContactEnquiry}
      sourcePath={sourcePath}
      submitLabel="Send message"
      pendingLabel="Sending"
    >
      {(state, pending) => (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" htmlFor="contact-name" error={state.fieldErrors?.name}>
              <Input
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                disabled={pending}
              />
            </Field>
            <Field label="Email" htmlFor="contact-email" error={state.fieldErrors?.email}>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                disabled={pending}
              />
            </Field>
            <Field label="Phone" htmlFor="contact-phone" error={state.fieldErrors?.phone}>
              <Input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                maxLength={40}
                disabled={pending}
              />
            </Field>
            <Field label="Office" htmlFor="contact-office" error={state.fieldErrors?.office}>
              <Select name="office" required defaultValue="india" disabled={pending}>
                {CONTACT_OFFICE_OPTIONS.map((office) => (
                  <option key={office.value} value={office.value}>
                    {office.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Subject" htmlFor="contact-subject" error={state.fieldErrors?.subject}>
            <Input name="subject" required maxLength={200} disabled={pending} />
          </Field>
          <Field label="Message" htmlFor="contact-message" error={state.fieldErrors?.message}>
            <Textarea name="message" required rows={6} maxLength={5000} disabled={pending} />
          </Field>
        </>
      )}
    </EnquiryFormShell>
  );
}
