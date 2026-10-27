"use server";

import { redirect } from "next/navigation";
import { contactsApi, ApiError } from "@/lib/api";
import type { FormState } from "@/lib/definitions";

function handleApiError(err: unknown): FormState {
  if (err instanceof ApiError) {
    if (err.status === 401) redirect("/login");
    return { errors: { form: [err.message] } };
  }
  return { errors: { form: ["Could not reach the server. Check your connection and try again."] } };
}

export async function createContactAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || undefined;
  const email = (formData.get("email") as string)?.trim() || undefined;
  const billBoxId = (formData.get("billBoxId") as string)?.trim() || undefined;

  const errors: NonNullable<FormState>["errors"] = {};
  if (!name) errors.name = ["Name is required."];
  if (Object.keys(errors).length) return { errors };

  try {
    const contact = await contactsApi.create({ name, phone, email, billBoxId });
    return { message: JSON.stringify(contact) };
  } catch (err) {
    return handleApiError(err);
  }
}
