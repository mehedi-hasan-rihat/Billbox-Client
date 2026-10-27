// All API calls go through here — never fetch() directly in components.

import { getSession } from "@/lib/session";
import type {
  AuthResponse,
  AuthUser,
  RegisterBody,
  LoginBody,
  Bill,
  Contact,
  ContactLookupResult,
  Payment,
  RecurringRule,
  BillTimelineEvent,
  PaginatedResponse,
  BillListParams,
  CreateBillBody,
  EditBillBody,
  AddPaymentBody,
  UpdatePaymentBody,
  CreateContactBody,
  EditContactBody,
  CreateRecurringBody,
  EditRecurringBody,
} from "@/lib/definitions";

const BASE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1`;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const method = options?.method ?? "GET";
  console.log(`[api] → ${method} ${url}`);
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) {
    console.error(`[api] ✗ ${method} ${url} — ${res.status} ${body?.message ?? res.statusText}`);
    throw new ApiError(res.status, body?.message ?? res.statusText);
  }
  console.log(`[api] ✓ ${method} ${url} — ${res.status}`);
  return body.data as T;
}

/**
 * Authenticated request — reads session cookie, injects Bearer token.
 * Always no-store: user-specific data must never be shared across users.
 */
async function authedRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const session = await getSession();
  if (!session) throw new ApiError(401, "Not authenticated");

  return request<T>(path, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
      ...(options?.headers ?? {}),
    },
  });
}

/** Convert a params object to a query string, skipping undefined/empty values. */
function qs(params?: Record<string, string | number | undefined | null>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (!entries.length) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
}

// ---------------------------------------------------------------------------
// Auth (public — no session needed)
// ---------------------------------------------------------------------------

export const authApi = {
  register(body: RegisterBody) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login(body: LoginBody) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  me(token: string) {
    return request<AuthUser>("/auth/me", {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// ---------------------------------------------------------------------------
// Bills
// ---------------------------------------------------------------------------

export const billsApi = {
  /** POST /bills — create a bill. */
  create(body: CreateBillBody) {
    return authedRequest<Bill>("/bills", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** GET /bills — list with search/filter/sort/pagination. */
  list(params?: BillListParams) {
    const query = qs(params as Record<string, string | number | undefined> | undefined);
    return authedRequest<PaginatedResponse<Bill>>(`/bills${query}`);
  },

  /** GET /bills/:id — single bill. */
  get(id: string) {
    return authedRequest<Bill>(`/bills/${id}`);
  },

  /** PATCH /bills/:id — edit bill details. */
  edit(id: string, body: EditBillBody) {
    return authedRequest<Bill>(`/bills/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  /** GET /bills/:id/timeline — full event history. */
  timeline(id: string) {
    return authedRequest<BillTimelineEvent[]>(`/bills/${id}/timeline`);
  },

  /** POST /bills/:id/payments — add a payment. */
  addPayment(id: string, body: AddPaymentBody) {
    return authedRequest<Bill>(`/bills/${id}/payments`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** GET /bills/:id/payments — list all payments. */
  getPayments(id: string) {
    return authedRequest<Payment[]>(`/bills/${id}/payments`);
  },

  /** PATCH /bills/:id/payments/:paymentId — update a payment. */
  updatePayment(id: string, paymentId: string, body: UpdatePaymentBody) {
    return authedRequest<Bill>(`/bills/${id}/payments/${paymentId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  /** DELETE /bills/:id/payments/:paymentId — delete a payment. */
  deletePayment(id: string, paymentId: string) {
    return authedRequest<Bill>(`/bills/${id}/payments/${paymentId}`, {
      method: "DELETE",
    });
  },

  /** POST /bills/:id/notes — append a note. */
  addNote(id: string, note: string) {
    return authedRequest<Bill>(`/bills/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    });
  },

  /** PATCH /bills/:id/notes/:noteIndex — update a note by index. */
  updateNote(id: string, noteIndex: number, note: string) {
    return authedRequest<Bill>(`/bills/${id}/notes/${noteIndex}`, {
      method: "PATCH",
      body: JSON.stringify({ note }),
    });
  },

  /** DELETE /bills/:id/notes/:noteIndex — delete a note by index. */
  deleteNote(id: string, noteIndex: number) {
    return authedRequest<Bill>(`/bills/${id}/notes/${noteIndex}`, {
      method: "DELETE",
    });
  },
};

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export const contactsApi = {
  /** GET /contacts/lookup?billBoxId= — look up a BillBox user. */
  lookup(billBoxId: string) {
    return authedRequest<ContactLookupResult>(`/contacts/lookup${qs({ billBoxId })}`);
  },

  /** POST /contacts — create a contact. */
  create(body: CreateContactBody) {
    return authedRequest<Contact>("/contacts", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** GET /contacts — list all contacts. */
  list() {
    return authedRequest<Contact[]>("/contacts");
  },

  /** GET /contacts/:id — single contact. */
  get(id: string) {
    return authedRequest<Contact>(`/contacts/${id}`);
  },

  /** PATCH /contacts/:id — edit a contact. */
  edit(id: string, body: EditContactBody) {
    return authedRequest<Contact>(`/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  /** DELETE /contacts/:id — delete a contact. */
  delete(id: string) {
    return authedRequest<{ deleted: boolean }>(`/contacts/${id}`, {
      method: "DELETE",
    });
  },
};

// ---------------------------------------------------------------------------
// Recurring
// ---------------------------------------------------------------------------

export const recurringApi = {
  /** POST /recurring — create a rule. */
  create(body: CreateRecurringBody) {
    return authedRequest<RecurringRule>("/recurring", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** GET /recurring — list all rules. */
  list() {
    return authedRequest<RecurringRule[]>("/recurring");
  },

  /** GET /recurring/:id — single rule. */
  get(id: string) {
    return authedRequest<RecurringRule>(`/recurring/${id}`);
  },

  /** PATCH /recurring/:id — edit a rule. */
  edit(id: string, body: EditRecurringBody) {
    return authedRequest<RecurringRule>(`/recurring/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  /** POST /recurring/:id/pause */
  pause(id: string) {
    return authedRequest<RecurringRule>(`/recurring/${id}/pause`, { method: "POST" });
  },

  /** POST /recurring/:id/resume */
  resume(id: string) {
    return authedRequest<RecurringRule>(`/recurring/${id}/resume`, { method: "POST" });
  },

  /** POST /recurring/:id/stop */
  stop(id: string) {
    return authedRequest<RecurringRule>(`/recurring/${id}/stop`, { method: "POST" });
  },
};
