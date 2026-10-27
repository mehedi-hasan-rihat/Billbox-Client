export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="size-1.5 animate-pulse rounded-full bg-foreground/70" />
        <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
          Loading...
        </span>
      </div>
    </div>
  );
}
