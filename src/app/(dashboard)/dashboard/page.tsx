import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — BillBox",
  description: "Your BillBox dashboard.",
};

export const instant = false;

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-foreground/70" />
          <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
            Dashboard
          </span>
        </div>
        <h1 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground">
          Welcome back.
        </h1>
      </div>
    </main>
  );
}
