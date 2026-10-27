import { redirect } from "next/navigation";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { getSession } from "@/lib/session";
import { authApi, ApiError } from "@/lib/api";
import type { AuthUser } from "@/lib/definitions";
import { DashboardNav } from "@/components/dashboard-nav";
import { LogoutButton } from "@/components/auth/logout-button";

/**
 * Shared layout for all dashboard pages.
 * Handles auth and renders the navbar — pages don't repeat this.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch user — keep async work outside JSX
  let user: AuthUser | null = null;
  let error: { isAuth: boolean } | null = null;

  try {
    user = await authApi.me(session.accessToken);
  } catch (err) {
    error = { isAuth: err instanceof ApiError && err.status === 401 };
  }

  if (error || !user) {
    const isAuth = error?.isAuth ?? false;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
            <Receipt className="size-5 text-foreground" strokeWidth={1.5} />
            <span className="font-mono text-sm font-medium tracking-[0.02em]">BILLBOX</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-destructive/70" />
            <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
              {isAuth ? "Session expired" : "Service unavailable"}
            </span>
          </div>

          <h1 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground">
            {isAuth ? (
              <>Your session has <span className="text-muted-foreground">expired.</span></>
            ) : (
              <>Unable to reach <span className="text-muted-foreground">the server.</span></>
            )}
          </h1>

          <p className="max-w-sm text-[15px] font-light leading-[1.6] text-muted-foreground">
            {isAuth
              ? "Please sign in again to continue."
              : "The server is temporarily unavailable. Please try again in a moment."}
          </p>

          <div className="flex items-center gap-0">
            {isAuth ? (
              <LogoutButton label="SIGN IN AGAIN" className="h-9.5 rounded-sm border border-foreground bg-foreground px-4 text-[11px] tracking-widest text-background hover:bg-foreground/90 hover:text-background" />
            ) : (
              <>
                <a
                  href="/dashboard"
                  className="inline-flex h-9.5 items-center gap-1.5 rounded-l-sm border border-foreground bg-foreground px-4 font-mono text-[11px] font-semibold tracking-widest text-background transition-all hover:bg-foreground/90"
                >
                  TRY AGAIN
                </a>
                <LogoutButton className="h-9.5 rounded-r-sm border border-l-0 border-border bg-muted px-4 text-[11px] tracking-widest text-foreground hover:bg-muted/80 hover:text-foreground" />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav user={user} />
      {children}
    </div>
  );
}
