"use server";

import { redirect } from "next/navigation";
import { billsApi, ApiError } from "@/lib/api";
import type { FormState, BillCategory, BillDirection, PaymentMethod } from "@/lib/definitions";

// ---------------------------------------------------------------------------
// Shared error handler
// ---------------------------------------------------------------------------

function handleApiError(err: unknown): FormState {
  if (err instanceof ApiError) {
    if (err.status === 401) redirect("/login");
    if (err.status === 400) return { errors: { form: [err.message] } };
    if (err.status === 404) return { errors: { form: [err.message] } };
    return { errors: { form: [`Server error: ${err.message}`] } };
  }
  return { errors: { form: ["Could not reach the server. Check your connection and try again."] } };
}

// ---------------------------------------------------------------------------
// Create Bill
// ---------------------------------------------------------------------------

export async function createBillAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = (formData.get("name") as string)?.trim();
  const category = formData.get("category") as BillCategory;
  const amount = (formData.get("amount") as string)?.trim();
  const issueDate = (formData.get("issueDate") as string)?.trim() || undefined;
  const dueDate = (formData.get("dueDate") as string)?.trim() || undefined;
  const note = (formData.get("note") as string)?.trim() || undefined;
  const contactId = (formData.get("contactId") as string)?.trim() || undefined;
  const direction = (formData.get("direction") as BillDirection) || undefined;

  const errors: NonNullable<FormState>["errors"] = {};
  if (!name) errors.name = ["Bill name is required."];
  if (!category) errors.category = ["Category is required."];
  if (!amount) {
    errors.amount = ["Amount is required."];
  } else if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    errors.amount = ["Enter a valid amount (e.g. 1200.00)."];
  }
  if (Object.keys(errors).length) return { errors };

  try {
    await billsApi.create({ name, category, amount, issueDate, dueDate, note, contactId, direction });
  } catch (err) {
    return handleApiError(err);
  }

  redirect("/bills");
}

// ---------------------------------------------------------------------------
// Add Payment
// ---------------------------------------------------------------------------

export async function addPaymentAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const billId = formData.get("billId") as string;
  const amount = (formData.get("amount") as string)?.trim();
  const paidOn = (formData.get("paidOn") as string)?.trim();
  const paymentMethod = (formData.get("paymentMethod") as PaymentMethod) || undefined;
  const paymentReference = (formData.get("paymentReference") as string)?.trim() || undefined;
  const note = (formData.get("note") as string)?.trim() || undefined;

  const errors: NonNullable<FormState>["errors"] = {};
  if (!amount) {
    errors.amount = ["Amount is required."];
  } else if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    errors.amount = ["Enter a valid amount (e.g. 600.00)."];
  }
  if (!paidOn) errors.paidOn = ["Payment date is required."];
  if (Object.keys(errors).length) return { errors };

  try {
    await billsApi.addPayment(billId, { amount, paidOn, paymentMethod, paymentReference, note });
  } catch (err) {
    return handleApiError(err);
  }

  redirect(`/bills/${billId}`);
}

// ---------------------------------------------------------------------------
// Add Note
// ---------------------------------------------------------------------------

export async function addNoteAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const billId = formData.get("billId") as string;
  const note = (formData.get("note") as string)?.trim();

  if (!note) return { errors: { note: ["Note cannot be empty."] } };

  try {
    await billsApi.addNote(billId, note);
  } catch (err) {
    return handleApiError(err);
  }

  redirect(`/bills/${billId}`);
}

// ---------------------------------------------------------------------------
// Update Note
// ---------------------------------------------------------------------------

export async function updateNoteAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const billId = formData.get("billId") as string;
  const noteIndex = Number(formData.get("noteIndex"));
  const note = (formData.get("note") as string)?.trim();

  if (!note) return { errors: { note: ["Note cannot be empty."] } };

  try {
    await billsApi.updateNote(billId, noteIndex, note);
  } catch (err) {
    return handleApiError(err);
  }

  redirect(`/bills/${billId}`);
}

// ---------------------------------------------------------------------------
// Delete Note
// ---------------------------------------------------------------------------

export async function deleteNoteAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const billId = formData.get("billId") as string;
  const noteIndex = Number(formData.get("noteIndex"));

  try {
    await billsApi.deleteNote(billId, noteIndex);
  } catch (err) {
    return handleApiError(err);
  }

  redirect(`/bills/${billId}`);
}
