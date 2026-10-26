"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { AuthField } from "@/components/auth/auth-field";
import { AuthFormError } from "@/components/auth/auth-form-error";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

/**
 * Login form — calls loginAction via useActionState.
 * Displays form-level errors (invalid credentials) inline.
 */
export function LoginForm() {
  const [state, action] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <AuthFormError errors={state?.errors?.form} />

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
        placeholder="Your password"
        autoComplete="current-password"
        errors={state?.errors?.password}
        required
      />

      <AuthSubmitButton label="SIGN IN" loadingLabel="SIGNING IN..." />

      <p className="text-center font-mono text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
