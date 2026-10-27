"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageErrorProps {
  title: string;
  message: string;
  /** Back link shown above the error card. Defaults to "/dashboard". */
  backHref?: string;
  backLabel?: string;
  /** Primary CTA inside the card. Defaults to pointing at backHref. */
  action?: { label: string; href: string };
  /** Show a retry button that calls router.refresh(). Default true. */
  retry?: boolean;
}

/**
 * Inline error state for dashboard pages — keeps the nav visible.
 * Use instead of notFound() / throwing for non-auth API errors.
 */
export function PageError({
  title,
  message,
  backHref = "/dashboard",
  backLabel = "GO BACK",
  action,
  retry = true,
}: PageErrorProps) {
  const router = useRouter();
  const actionHref = action?.href ?? backHref;
  const actionLabel = action?.label ?? backLabel;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back link */}
      <Button
        render={<Link href={backHref} />}
        variant="ghost"
        className="mb-6 h-auto p-0 font-mono text-[10px] tracking-widest text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        ← {backLabel}
      </Button>

      {/* Error card */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-border px-6 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full border border-border">
          <FileX className="size-4.5 text-muted-foreground" strokeWidth={1.5} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs font-medium text-foreground">{title}</span>
          <span className="max-w-sm text-[13.5px] font-light leading-[1.6] text-muted-foreground">
            {message}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-0">
          {/* Retry — left half of split button */}
          {retry && (
            <Button
              type="button"
              onClick={() => router.refresh()}
              className="h-8 rounded-l-sm rounded-r-none border-foreground bg-foreground px-4 font-mono text-[10px] tracking-widest text-background hover:bg-foreground/90"
            >
              <RotateCcw className="size-3" strokeWidth={1.5} />
              RETRY
            </Button>
          )}
          {/* Action — right half (or full button if no retry) */}
          <Button
            render={<Link href={actionHref} />}
            className={`h-8 px-4 font-mono text-[10px] tracking-widest ${
              retry
                ? "rounded-l-none rounded-r-sm border border-l-0 border-border bg-muted text-foreground hover:bg-muted/80"
                : "rounded-sm border-foreground bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </main>
  );
}
