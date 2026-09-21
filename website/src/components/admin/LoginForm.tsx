"use client";

import { useActionState } from "react";
import { Button } from "@/design-system/components/button";
import { Field } from "@/design-system/components/field";
import { Input } from "@/design-system/components/input";
import { Spinner } from "@/design-system/components/loading";
import {
  initialLoginFormState,
  signInStaff,
  type LoginFormState,
} from "@/server/actions/auth";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, action, pending] = useActionState(
    signInStaff,
    initialLoginFormState as LoginFormState,
  );

  return (
    <form action={action} noValidate className="grid gap-5" aria-busy={pending}>
      <input type="hidden" name="next" value={nextPath} />
      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </Field>
      <Field label="Password" htmlFor="password" error={state.fieldErrors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      {state.status === "error" &&
      state.message &&
      !state.fieldErrors?.email &&
      !state.fieldErrors?.password ? (
        <p className="text-caption text-danger" role="alert">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="gap-0 [&_span:last-child]:sr-only" label="Signing in" />
            Signing in
          </span>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
