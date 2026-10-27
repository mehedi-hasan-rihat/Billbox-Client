import type { Metadata } from "next";
import { Copy } from "lucide-react";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Profile — BillBox",
  description: "Your BillBox profile.",
};

export const instant = false;

export default async function ProfilePage() {
  const session = await getSession();
  const { user } = session!;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-foreground/70" />
          <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
            Profile
          </span>
        </div>
        <h1 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground">
          Your account{" "}
          <span className="text-muted-foreground">details.</span>
        </h1>
      </div>

      {/* Profile card */}
      <div className="max-w-md rounded-sm border border-border">
        {/* BillBox ID — dark header */}
        <div className="flex items-center justify-between border-b border-border bg-foreground px-5 py-4">
          <span className="font-mono text-[10px] font-medium tracking-widest text-background/60 uppercase">
            BillBox ID
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold tabular-nums text-background">
              {user.billBoxId}
            </span>
            <Copy className="size-3.5 text-background/40" strokeWidth={1.5} />
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col divide-y divide-border px-5">
          {[
            { label: "NAME", value: user.name || "—" },
            { label: "EMAIL", value: user.email },
            { label: "USER ID", value: user.id },
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-1 py-4">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                {row.label}
              </span>
              <span className="break-all font-mono text-sm font-medium text-foreground">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
