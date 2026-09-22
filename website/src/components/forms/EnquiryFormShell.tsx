"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { TurnstileField } from "@/components/forms/TurnstileField";
import { Button } from "@/design-system/components/button";
import { Spinner } from "@/design-system/components/loading";
import { initialEnquiryFormState, type EnquiryFormState } from "@/types";
import { cn } from "@/lib/utils";

type EnquiryFormShellProps = {
  action: (state: EnquiryFormState, formData: FormData) => Promise<EnquiryFormState>;
  sourcePath: string;
  submitLabel: string;
  pendingLabel: string;
  children: (state: EnquiryFormState, pending: boolean) => ReactNode;
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data";
  className?: string;
};

export function EnquiryFormShell({
  action,
  sourcePath,
  submitLabel,
  pendingLabel,
  children,
  encType,
  className,
}: EnquiryFormShellProps) {
  const [state, formAction, pending] = useActionState(action, initialEnquiryFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const hasFieldErrors = Boolean(state.fieldErrors && Object.keys(state.fieldErrors).length > 0);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      encType={encType}
      noValidate
      aria-busy={pending}
      className={cn(
        "relative min-w-0 grid gap-5 rounded-sm border border-line bg-panel/80 p-5 md:p-8",
        className,
      )}
    >
      <HoneypotField />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      {children(state, pending)}
      <TurnstileField />

      {state.status === "error" && state.message && !hasFieldErrors ? (
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
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="gap-0 [&_span:last-child]:sr-only" label={pendingLabel} />
            {pendingLabel}
          </span>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
