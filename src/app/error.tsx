"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Dot marker */}
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-destructive/70" />
          <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
            Error
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[42px] font-normal leading-[1.05] tracking-[-0.02em] text-foreground">
          Something went{" "}
          <span className="text-muted-foreground">wrong.</span>
        </h1>

        <p className="max-w-sm text-[15px] font-light leading-[1.6] text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-0">
          <button
            onClick={reset}
            className="inline-flex h-9.5 items-center gap-1.5 rounded-l-sm border border-foreground bg-foreground px-4 font-mono text-[11px] font-semibold tracking-widest text-background transition-all hover:bg-foreground/90"
          >
            TRY AGAIN
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-9.5 items-center gap-1.5 rounded-r-sm border border-l-0 border-border bg-muted px-4 font-mono text-[11px] font-semibold tracking-widest text-foreground transition-colors hover:bg-muted/80"
          >
            <ArrowLeft className="size-3" /> DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  );
}
