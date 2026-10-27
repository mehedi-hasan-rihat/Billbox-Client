import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Dot marker */}
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-foreground/70" />
          <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[42px] font-normal leading-[1.05] tracking-[-0.02em] text-foreground">
          Page not{" "}
          <span className="text-muted-foreground">found.</span>
        </h1>

        <p className="max-w-sm text-[15px] font-light leading-[1.6] text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex h-9.5 items-center gap-1.5 rounded-sm border border-foreground bg-foreground px-4 font-mono text-[11px] font-semibold tracking-widest text-background transition-all hover:bg-foreground/90"
        >
          <ArrowLeft className="size-3" /> BACK TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
