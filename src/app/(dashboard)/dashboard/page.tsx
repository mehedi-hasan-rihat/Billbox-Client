import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Receipt, FileText, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { getSession } from "@/lib/session";
import { authApi } from "@/lib/api";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata: Metadata = {
  title: "Dashboard — BillBox",
  description: "Your BillBox dashboard.",
};

export const instant = false;

const statCards = [
  {
    label: "TOTAL BILLS",
    value: "0",
    icon: FileText,
    sub: "No bills yet",
  },
  {
    label: "UPCOMING",
    value: "0",
    icon: Clock,
    sub: "Due in 7 days",
  },
  {
    label: "OVERDUE",
    value: "0",
    icon: AlertTriangle,
    sub: "Needs attention",
    alert: true,
  },
  {
    label: "PAID THIS MONTH",
    value: "0",
    icon: CheckCircle,
    sub: "All clear",
  },
];

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await authApi.me(session.accessToken);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <Receipt className="size-5 text-foreground" strokeWidth={1.5} />
            <span className="font-mono text-sm font-medium tracking-[0.02em]">BILLBOX</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/profile"
              className="flex size-7 items-center justify-center rounded-full border border-border bg-muted font-mono text-[10px] font-semibold tracking-widest text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/80"
              title={user.name || user.email}
            >
              {user.name
                ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
                : user.email.slice(0, 2).toUpperCase()}
            </a>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-foreground/70" />
            <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
              Dashboard
            </span>
          </div>
          <h1 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground">
            Welcome back
            {user.name ? (
              <>
                ,{" "}
                <span className="text-muted-foreground">{user.name}.</span>
              </>
            ) : (
              "."
            )}
          </h1>
        </div>

        {/* Stat row */}
        <div className="mb-8 grid grid-cols-2 gap-0 lg:grid-cols-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            const isFirst = idx === 0;
            const isLast = idx === statCards.length - 1;
            return (
              <div
                key={stat.label}
                className={`flex flex-col gap-3 border border-border p-5 ${
                  isFirst ? "rounded-l-sm" : "border-l-0"
                } ${isLast ? "rounded-r-sm" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] tracking-widest ${stat.alert ? "text-destructive" : "text-muted-foreground"}`}>
                    {stat.label}
                  </span>
                  <Icon
                    className={`size-3.5 ${stat.alert ? "text-destructive/60" : "text-muted-foreground/50"}`}
                    strokeWidth={1.5}
                  />
                </div>
                <span className={`font-mono text-2xl font-semibold tabular-nums ${stat.alert ? "text-destructive" : "text-foreground"}`}>
                  {stat.value}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/60">
                  {stat.sub}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main content grid */}
        <div className="grid gap-0 lg:grid-cols-3">
          {/* Bills inbox — takes 2 cols */}
          <div className="flex flex-col rounded-l-sm border border-border lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Receipt className="size-3.5 text-foreground" strokeWidth={1.5} />
                <span className="font-mono text-xs font-medium tracking-[0.02em]">
                  Bill Inbox
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">0 bills</span>
            </div>

            {/* Empty state */}
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full border border-border">
                <FileText className="size-4.5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-medium text-foreground">No bills yet</span>
                <span className="text-[13.5px] font-light leading-[1.6] text-muted-foreground">
                  Your bills will appear here once you start adding them.
                </span>
              </div>
              <button
                disabled
                className="mt-2 inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-sm border border-border bg-muted px-4 font-mono text-[10px] font-semibold tracking-widest text-muted-foreground opacity-50"
              >
                ADD BILL — COMING SOON
              </button>
            </div>
          </div>

          {/* Profile panel — 1 col */}
          <div className="flex flex-col rounded-r-sm border border-l-0 border-border">
            {/* BillBox ID — dark header */}
            <div className="flex items-center justify-between border-b border-border bg-foreground px-5 py-3.5">
              <span className="font-mono text-[10px] font-medium tracking-widest text-background/60 uppercase">
                BillBox ID
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-background">
                {user.billBoxId}
              </span>
            </div>

            {/* Profile fields */}
            <div className="flex flex-col divide-y divide-border px-5 py-1">
              {[
                { label: "NAME", value: user.name || "—" },
                { label: "EMAIL", value: user.email },
                { label: "USER ID", value: user.id },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5 py-3.5">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="break-all font-mono text-xs font-medium text-foreground">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
