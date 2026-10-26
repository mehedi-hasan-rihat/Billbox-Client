import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section id="get-started" className="scroll-mt-14 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-center gap-2">
          <span className="size-1.5 rounded-full bg-foreground/70" />
          <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
            Get Started
          </span>
        </div>
        <h2 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[36px] lg:text-[44px]">
          Get your BillBox ID
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-[1.6] font-light text-muted-foreground">
          Start consolidating your bills today. Create your inbox, add bills
          manually or receive them from senders, and never miss a due date again.
        </p>
        <div className="mt-8 flex items-center justify-center gap-0">
          <a
            href="#"
            className="inline-flex h-9.5 items-center gap-1.5 rounded-l-sm border border-foreground bg-foreground px-4 font-mono text-[11px] font-semibold tracking-widest text-background transition-all hover:bg-foreground/90"
          >
            CREATE YOUR INBOX
            <ArrowRight className="size-3" />
          </a>
          <a
            href="#"
            className="inline-flex h-9.5 items-center gap-1.5 rounded-r-sm border border-l-0 border-border bg-muted px-4 font-mono text-[11px] font-semibold tracking-widest text-foreground transition-all hover:bg-muted/80"
          >
            LEARN MORE
            <ArrowRight className="size-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
