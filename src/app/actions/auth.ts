"use server";

import { redirect } from "next/navigation";
import { authApi, ApiError } from "@/lib/api";
import { createSession, deleteSession } from "@/lib/session";
import type { AuthFormState } from "@/lib/definitions";

export async function registerAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  console.log(`[registerAction] attempt — email: ${email}`);

  const errors: NonNullable<AuthFormState>["errors"] = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["Please enter a valid email address."];
  }
  if (!password || password.length < 8) {
    errors.password = ["Password must be at least 8 characters."];
  }
  if (Object.keys(errors).length) {
    console.log(`[registerAction] validation failed —`, errors);
    return { errors };
  }

  try {
    const data = await authApi.register({ email, password, name: name || undefined });
    console.log(`[registerAction] success — userId: ${data.user.id}`);
    await createSession(data.access_token, data.user);
  } catch (err) {
    if (err instanceof ApiError) {
      console.error(`[registerAction] ApiError ${err.status} — ${err.message}`);
      if (err.status === 409) {
        return { errors: { email: ["An account with this email already exists."] } };
      }
      return { errors: { form: [err.message] } };
    }
    console.error(`[registerAction] unexpected error —`, err);
    return { errors: { form: ["Something went wrong. Please try again."] } };
  }

  redirect("/dashboard");
}

export async function loginAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(`[loginAction] attempt — email: ${email}`);

  const errors: NonNullable<AuthFormState>["errors"] = {};
  if (!email) errors.email = ["Email is required."];
  if (!password) errors.password = ["Password is required."];
  if (Object.keys(errors).length) {
    console.log(`[loginAction] validation failed —`, errors);
    return { errors };
  }

  try {
    const data = await authApi.login({ email, password });
    console.log(`[loginAction] success — userId: ${data.user.id}`);
    await createSession(data.access_token, data.user);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      console.error(`[loginAction] ApiError 401 — invalid credentials`);
      return { errors: { form: ["Invalid email or password."] } };
    }
    console.error(`[loginAction] unexpected error —`, err);
    return { errors: { form: ["Something went wrong. Please try again."] } };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
