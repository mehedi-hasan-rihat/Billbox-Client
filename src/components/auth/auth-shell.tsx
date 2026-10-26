import Link from "next/link";
import { Receipt } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/**
 * Centered auth page wrapper — brand header + card + children.
 * Used by both /login and /register pages.
 */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Brand */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-70"
      >
        <Receipt className="size-5 text-foreground" strokeWidth={1.5} />
        <span className="font-mono text-sm font-medium tracking-[0.02em]">
          BILLBOX
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm rounded-sm border border-border bg-card p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-foreground/70" />
            <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
              {subtitle}
            </span>
          </div>
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            {title}
          </h1>
        </div>

        {children}
      </div>
    </div>
  );
}
