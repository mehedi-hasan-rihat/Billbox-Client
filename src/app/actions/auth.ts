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

  const errors: NonNullable<AuthFormState>["errors"] = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["Please enter a valid email address."];
  }
  if (!password || password.length < 8) {
    errors.password = ["Password must be at least 8 characters."];
  }
  if (Object.keys(errors).length) return { errors };

  try {
    const data = await authApi.register({ email, password, name: name || undefined });
    await createSession(data.access_token, data.user);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 409) return { errors: { email: ["An account with this email already exists."] } };
      if (err.status === 400) return { errors: { form: [err.message] } };
      return { errors: { form: [`Server error (${err.status}). Please try again.`] } };
    }
    return { errors: { form: ["Could not reach the server. Check your connection and try again."] } };
  }

  redirect("/dashboard");
}

export async function loginAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: NonNullable<AuthFormState>["errors"] = {};
  if (!email) errors.email = ["Email is required."];
  if (!password) errors.password = ["Password is required."];
  if (Object.keys(errors).length) return { errors };

  try {
    const data = await authApi.login({ email, password });
    await createSession(data.access_token, data.user);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401 || err.status === 400) return { errors: { form: ["Invalid email or password."] } };
      return { errors: { form: [`Server error (${err.status}). Please try again.`] } };
    }
    return { errors: { form: ["Could not reach the server. Check your connection and try again."] } };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
