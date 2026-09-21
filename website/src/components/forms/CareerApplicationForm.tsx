"use client";

import { EnquiryFormShell } from "@/components/forms/EnquiryFormShell";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Textarea } from "@/design-system/components/textarea";
import { submitCareerEnquiry } from "@/server/actions/enquiries";

type CareerApplicationFormProps = {
  sourcePath?: string;
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
      {(state, pending) => (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" htmlFor="career-name" error={state.fieldErrors?.name}>
              <Input
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                disabled={pending}
              />
            </Field>
            <Field label="Email" htmlFor="career-email" error={state.fieldErrors?.email}>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                disabled={pending}
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
              disabled={pending}
            />
          </Field>
          <Field
            label="Role of interest"
            htmlFor="career-role"
            hint="Optional"
            error={state.fieldErrors?.role}
          >
            <Input name="role" maxLength={120} disabled={pending} />
          </Field>
          <Field
            label="Cover note"
            htmlFor="career-message"
            error={state.fieldErrors?.message}
          >
            <Textarea name="message" required rows={6} maxLength={5000} disabled={pending} />
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
              disabled={pending}
            />
          </Field>
        </>
      )}
    </EnquiryFormShell>
  );
}
