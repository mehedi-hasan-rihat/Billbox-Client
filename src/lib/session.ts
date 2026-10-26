import "server-only";
import { cookies } from "next/headers";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  billBoxId: string;
}

export interface Session {
  accessToken: string;
  user: SessionUser;
}

export async function createSession(accessToken: string, user: SessionUser) {
  const cookieStore = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24, // 24h — matches JWT_EXPIRES_IN
  };
  cookieStore.set("bb_token", accessToken, opts);
  cookieStore.set("bb_user", JSON.stringify(user), opts);
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("bb_token")?.value;
  const userRaw = cookieStore.get("bb_user")?.value;
  if (!token || !userRaw) return null;
  try {
    return { accessToken: token, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("bb_token");
  cookieStore.delete("bb_user");
}
