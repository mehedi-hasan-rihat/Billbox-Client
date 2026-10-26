"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormError } from "@/components/auth/auth-form-error";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

/**
 * Register form — calls registerAction via useActionState.
 * Displays per-field and form-level errors inline.
 */
export function RegisterForm() {
  const [state, action] = useActionState(registerAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <AuthFormError errors={state?.errors?.form} />

      <AuthField
        id="name"
        name="name"
        label="Name"
        placeholder="Mehedi"
        autoComplete="name"
        errors={state?.errors?.name}
      />
      <AuthField
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        errors={state?.errors?.email}
        required
      />
      <AuthField
        id="password"
        name="password"
        label="Password"
        type="password"
        placeholder="Min 8 characters"
        autoComplete="new-password"
        errors={state?.errors?.password}
        required
      />

      <AuthSubmitButton label="CREATE ACCOUNT" loadingLabel="CREATING..." />

      <p className="text-center font-mono text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
