"use client";

import { useState } from "react";
import { EnquiryFormShell } from "@/components/forms/EnquiryFormShell";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Textarea } from "@/design-system/components/textarea";
import { submitProductEnquiry } from "@/server/actions/enquiries";
import type { EnquiryFormState } from "@/types";

type ProductEnquiryFormProps = {
  productSlug: string;
  productName: string;
  sourcePath?: string;
};

const emptyValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
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
        <ProductFields
          state={state}
          pending={pending}
          productSlug={productSlug}
          productName={productName}
        />
      )}
    </EnquiryFormShell>
  );
}

function ProductFields({
  state,
  pending,
  productSlug,
  productName,
}: {
  state: EnquiryFormState;
  pending: boolean;
  productSlug: string;
  productName: string;
}) {
  const [values, setValues] = useState(emptyValues);

  return (
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
            readOnly={pending}
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          />
        </Field>
        <Field label="Email" htmlFor="product-email" error={state.fieldErrors?.email}>
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
      <Field label="Phone" htmlFor="product-phone" error={state.fieldErrors?.phone}>
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
      <Field label="Message" htmlFor="product-message" error={state.fieldErrors?.message}>
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
