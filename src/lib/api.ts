// All API calls go through here — never fetch() directly in components.

import { getSession } from "@/lib/session";
import type {
  AuthResponse,
  AuthUser,
  RegisterBody,
  LoginBody,
  Bill,
  Biller,
  BillerLookupResult,
  RecurringRule,
  BillTimelineEvent,
  PaginatedResponse,
  BillListParams,
  CreateBillBody,
  EditBillBody,
  PayBillBody,
  UpdatePaymentBody,
  CreateBillerBody,
  EditBillerBody,
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
 * Authenticated request — reads session, injects Bearer token.
 * Use for all protected endpoints (bills, billers, recurring).
 */
async function authedRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const session = await getSession();
  if (!session) throw new ApiError(401, "Not authenticated");

  return request<T>(path, {
    cache: "no-store",
    ...options,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...(options?.headers ?? {}),
    },
  });
}

/**
 * Authenticated GET with caching (tag-based revalidation).
 */
async function authedCachedRequest<T>(
  path: string,
  tags: string[],
): Promise<T> {
  const session = await getSession();
  if (!session) throw new ApiError(401, "Not authenticated");

  return request<T>(path, {
    next: { tags },
    headers: { Authorization: `Bearer ${session.accessToken}` },
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
      headers: { Authorization: `Bearer ${token}` },
      next: { tags: ["auth-me"] },
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
    return authedCachedRequest<PaginatedResponse<Bill>>(
      `/bills${query}`,
      ["bills"],
    );
  },

  /** GET /bills/:id — single bill. */
  get(id: string) {
    return authedCachedRequest<Bill>(`/bills/${id}`, ["bills"]);
  },

  /** PATCH /bills/:id — edit bill details (no status transitions). */
  edit(id: string, body: EditBillBody) {
    return authedRequest<Bill>(`/bills/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  /** GET /bills/:id/timeline — full event history. */
  timeline(id: string) {
    return authedCachedRequest<BillTimelineEvent[]>(`/bills/${id}/timeline`, [
      "bills",
    ]);
  },

  /** POST /bills/:id/pay — mark UNPAID → PAID. */
  pay(id: string, body: PayBillBody) {
    return authedRequest<Bill>(`/bills/${id}/pay`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** PATCH /bills/:id/payment — update payment metadata on PAID bill. */
  updatePayment(id: string, body: UpdatePaymentBody) {
    return authedRequest<Bill>(`/bills/${id}/payment`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  /** PATCH /bills/:id/notes — add/update/remove note. */
  updateNotes(id: string, note: string | null) {
    return authedRequest<Bill>(`/bills/${id}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ note }),
    });
  },
};

// ---------------------------------------------------------------------------
// Billers
// ---------------------------------------------------------------------------

export const billersApi = {
  /** GET /billers/lookup?billBoxId= — look up a BillBox user. */
  lookup(billBoxId: string) {
    return authedCachedRequest<BillerLookupResult>(
      `/billers/lookup${qs({ billBoxId })}`,
      ["billers-lookup"],
    );
  },

  /** POST /billers — create a biller. */
  create(body: CreateBillerBody) {
    return authedRequest<Biller>("/billers", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** GET /billers — list all billers (sorted by name). */
  list() {
    return authedCachedRequest<Biller[]>("/billers", ["billers"]);
  },

  /** GET /billers/:id — single biller. */
  get(id: string) {
    return authedCachedRequest<Biller>(`/billers/${id}`, ["billers"]);
  },

  /** PATCH /billers/:id — edit a biller. */
  edit(id: string, body: EditBillerBody) {
    return authedRequest<Biller>(`/billers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  /** DELETE /billers/:id — soft-delete a biller. */
  delete(id: string) {
    return authedRequest<{ deleted: boolean }>(`/billers/${id}`, {
      method: "DELETE",
    });
  },
};

// ---------------------------------------------------------------------------
// Recurring
// ---------------------------------------------------------------------------

export const recurringApi = {
  /** POST /recurring — create a recurring rule. */
  create(body: CreateRecurringBody) {
    return authedRequest<RecurringRule>("/recurring", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /** GET /recurring — list all rules. */
  list() {
    return authedCachedRequest<RecurringRule[]>("/recurring", ["recurring"]);
  },

  /** GET /recurring/:id — single rule. */
  get(id: string) {
    return authedCachedRequest<RecurringRule>(`/recurring/${id}`, ["recurring"]);
  },

  /** PATCH /recurring/:id — edit a rule. */
  edit(id: string, body: EditRecurringBody) {
    return authedRequest<RecurringRule>(`/recurring/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  /** POST /recurring/:id/pause — pause ACTIVE rule. */
  pause(id: string) {
    return authedRequest<RecurringRule>(`/recurring/${id}/pause`, {
      method: "POST",
    });
  },

  /** POST /recurring/:id/resume — resume PAUSED rule. */
  resume(id: string) {
    return authedRequest<RecurringRule>(`/recurring/${id}/resume`, {
      method: "POST",
    });
  },

  /** POST /recurring/:id/stop — permanently stop a rule. */
  stop(id: string) {
    return authedRequest<RecurringRule>(`/recurring/${id}/stop`, {
      method: "POST",
    });
  },
};
