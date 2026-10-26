// All API calls go through here — never fetch() directly in components.

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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  billBoxId: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export const authApi = {
  register(body: { email: string; password: string; name?: string }) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login(body: { email: string; password: string }) {
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
