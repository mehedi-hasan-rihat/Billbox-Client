import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Repeat,
  Wifi,
  Zap,
  Smartphone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from "lucide-react";

const mockBills = [
  { icon: Wifi, name: "Internet", provider: "ISP Pro", amount: "$49.99", status: "UNPAID", dueIn: "Due in 5 days" },
  { icon: Zap, name: "Electricity", provider: "City Power", amount: "$132.50", status: "UPCOMING", dueIn: "Due in 3 days" },
  { icon: Smartphone, name: "Mobile", provider: "TelCo", amount: "$25.00", status: "PAID", dueIn: "Paid Oct 12" },
] as const;

const statusMeta = {
  UNPAID: { icon: Clock, dot: "bg-foreground" },
  UPCOMING: { icon: AlertCircle, dot: "bg-foreground/40" },
  PAID: { icon: CheckCircle2, dot: "bg-foreground" },
} as const;

/**
 * Hero section — Mosa-style split layout with inbox mockup.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div className="flex flex-col items-start">
            <div className="mb-5 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-foreground/70" />
              <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
                Your personal bill inbox
              </span>
            </div>
            <h1 className="text-[42px] font-normal leading-[1.05] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[64px]">
              All your bills,
              <br />
              <span className="text-muted-foreground">in one place.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-[1.6] font-light text-muted-foreground">
              Stop chasing bills across email, WhatsApp, and paper drawers.
              BillBox brings them into a single inbox with due-date tracking,
              reminders, and payment records.
            </p>
            <div className="mt-8 flex items-center gap-0">
              <a
                href="#get-started"
                className="inline-flex h-9.5 items-center gap-1.5 rounded-l-sm border border-foreground bg-foreground px-4 font-mono text-[11px] font-semibold tracking-widest text-background transition-all hover:bg-foreground/90"
              >
                GET STARTED
                <ArrowRight className="size-3" />
              </a>
              <a
                href="#lifecycle"
                className="inline-flex h-9.5 items-center gap-1.5 rounded-r-sm border border-l-0 border-border bg-muted px-4 font-mono text-[11px] font-semibold tracking-widest text-foreground transition-all hover:bg-muted/80"
              >
                LEARN MORE
                <ArrowRight className="size-3" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" strokeWidth={1.5} />
                No payment gateway needed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="size-3.5" strokeWidth={1.5} />
                PDF & image attachments
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Repeat className="size-3.5" strokeWidth={1.5} />
                Recurring bill support
              </span>
            </div>
          </div>

          {/* Right: Inbox mockup */}
          <div className="lg:justify-self-end">
            <div className="w-full max-w-md rounded-sm border border-border bg-card shadow-lg shadow-foreground/5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Receipt className="size-4 text-foreground" strokeWidth={1.5} />
                  <span className="font-mono text-sm font-medium text-card-foreground">
                    Your Inbox
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">3 bills</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border">
                {mockBills.map((bill) => {
                  const Icon = bill.icon;
                  const StatusIcon = statusMeta[bill.status].icon;
                  return (
                    <div
                      key={bill.name}
                      className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border bg-background transition-colors group-hover:border-foreground/20">
                        <Icon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-card-foreground">{bill.name}</span>
                          <span className="text-xs text-muted-foreground">{bill.provider}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <StatusIcon className="size-3 text-muted-foreground" strokeWidth={1.5} />
                          <span className="text-xs text-muted-foreground">{bill.dueIn}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${statusMeta[bill.status].dot}`} />
                        <span className="font-mono text-xs font-medium text-foreground">
                          {bill.status}
                        </span>
                      </div>
                      <div className="w-14 text-right">
                        <span className="text-sm font-medium tabular-nums text-card-foreground">
                          {bill.amount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Clock className="size-3" strokeWidth={1.5} />
                  Next due in 3 days
                </span>
                <span className="font-mono text-xs font-medium tabular-nums text-card-foreground">
                  $207.49 total
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
