"use client";

import { EnquiryFormShell } from "@/components/forms/EnquiryFormShell";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Textarea } from "@/design-system/components/textarea";
import { submitProductEnquiry } from "@/server/actions/enquiries";

type ProductEnquiryFormProps = {
  productSlug: string;
  productName: string;
  sourcePath?: string;
};

export function ProductEnquiryForm({
  productSlug,
  productName,
  sourcePath,
}: ProductEnquiryFormProps) {
  return (
    <EnquiryFormShell
      action={submitProductEnquiry}
      sourcePath={sourcePath ?? `/products/${productSlug}`}
      submitLabel="Send enquiry"
      pendingLabel="Sending"
    >
      {(state, pending) => (
        <>
          <input type="hidden" name="productSlug" value={productSlug} />
          <p className="text-caption text-cream-muted">
            Product: <span className="text-cream">{productName}</span>
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" htmlFor="product-name" error={state.fieldErrors?.name}>
              <Input
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                disabled={pending}
              />
            </Field>
            <Field label="Email" htmlFor="product-email" error={state.fieldErrors?.email}>
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
          <Field label="Phone" htmlFor="product-phone" error={state.fieldErrors?.phone}>
            <Input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={40}
              disabled={pending}
            />
          </Field>
          <Field label="Message" htmlFor="product-message" error={state.fieldErrors?.message}>
            <Textarea name="message" required rows={6} maxLength={5000} disabled={pending} />
          </Field>
        </>
      )}
    </EnquiryFormShell>
  );
}
