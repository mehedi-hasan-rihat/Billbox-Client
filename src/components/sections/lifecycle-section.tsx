import {
  Inbox,
  CheckCircle2,
  Clock,
  Bell,
  Paperclip,
  Wifi,
  CalendarDays,
  Tag,
  BellRing,
  CreditCard,
  FileCheck2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

interface LifecycleStep {
  icon: LucideIcon;
  step: string;
  title: string;
  desc: string;
  detail: string;
  /** What the mock panel shows for this step */
  mock: React.ReactNode;
}

const StatusBadge = ({ label, variant }: { label: string; variant: "pending" | "unpaid" | "upcoming" | "overdue" | "paid" }) => {
  const styles = {
    pending:  "border-border bg-muted/50 text-muted-foreground",
    unpaid:   "border-foreground/20 bg-foreground/5 text-foreground",
    upcoming: "border-foreground/30 bg-foreground/8 text-foreground",
    overdue:  "border-destructive/30 bg-destructive/10 text-destructive",
    paid:     "border-foreground/20 bg-foreground/5 text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest ${styles[variant]}`}>
      {label}
    </span>
  );
};

const MockRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
    <span className="text-xs text-muted-foreground shrink-0">{label}</span>
    <span className="text-xs font-medium text-foreground text-right">{value}</span>
  </div>
);

const lifecycle: LifecycleStep[] = [
  {
    icon: Inbox,
    step: "Receive",
    title: "Bills arrive in your inbox",
    desc: "Senders push bills directly to your unique BillBox ID. You can also add a bill manually with title, amount, category, and due date.",
    detail: "Bills from any source land here first — status: PENDING until you review them.",
    mock: (
      <div className="rounded-sm border border-border bg-card">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <Wifi className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-sm font-medium text-card-foreground">Internet — ISP Pro</span>
          <div className="ml-auto"><StatusBadge label="PENDING" variant="pending" /></div>
        </div>
        <div className="px-4 py-1">
          <MockRow label="Amount" value="$49.99" />
          <MockRow label="Due date" value="Nov 15, 2026" />
          <MockRow label="Category" value={<span className="inline-flex items-center gap-1"><Tag className="size-3" strokeWidth={1.5} />Internet</span>} />
          <MockRow label="Received" value="Oct 26, 2026" />
        </div>
      </div>
    ),
  },
  {
    icon: CheckCircle2,
    step: "Confirm",
    title: "Review and confirm",
    desc: "Check the amount, due date, and category. Hit confirm — the bill moves to UNPAID and tracking begins.",
    detail: "Confirmation is your signal to BillBox that this bill is real and you own it.",
    mock: (
      <div className="rounded-sm border border-border bg-card">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <Wifi className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-sm font-medium text-card-foreground">Internet — ISP Pro</span>
          <div className="ml-auto"><StatusBadge label="UNPAID" variant="unpaid" /></div>
        </div>
        <div className="px-4 py-1">
          <MockRow label="Amount" value="$49.99" />
          <MockRow label="Due date" value="Nov 15, 2026" />
          <MockRow label="Confirmed" value="Oct 26, 2026 · 9:41 AM" />
          <MockRow label="Reminder" value="Not set yet" />
        </div>
      </div>
    ),
  },
  {
    icon: Clock,
    step: "Track",
    title: "Auto-tracked by due date",
    desc: "BillBox watches the due date. Bills approaching their deadline are flagged UPCOMING. Bills past due become OVERDUE automatically — no manual work needed.",
    detail: "Status is computed in real-time — you never have to update it yourself.",
    mock: (
      <div className="space-y-2">
        <div className="rounded-sm border border-border bg-card">
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            <Wifi className="size-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-sm font-medium text-card-foreground">Internet — ISP Pro</span>
            <div className="ml-auto"><StatusBadge label="UPCOMING" variant="upcoming" /></div>
          </div>
          <div className="px-4 py-1">
            <MockRow label="Due" value={<span className="inline-flex items-center gap-1"><CalendarDays className="size-3" strokeWidth={1.5} />3 days left</span>} />
            <MockRow label="Amount" value="$49.99" />
          </div>
        </div>
        <div className="rounded-sm border border-destructive/20 bg-card">
          <div className="flex items-center gap-2.5 border-b border-destructive/20 px-4 py-3">
            <span className="text-sm font-medium text-card-foreground">Electricity — City Power</span>
            <div className="ml-auto"><StatusBadge label="OVERDUE" variant="overdue" /></div>
          </div>
          <div className="px-4 py-1">
            <MockRow label="Was due" value="Oct 20, 2026" />
            <MockRow label="Amount" value="$132.50" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Bell,
    step: "Remind",
    title: "Reminders before it's due",
    desc: "Configure how many days before the due date you want a reminder — 3 days, 2 days, 1 day, or on the day itself. Reminders stop once the bill is paid.",
    detail: "You set reminders once per bill. BillBox handles the rest.",
    mock: (
      <div className="rounded-sm border border-border bg-card">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <BellRing className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-sm font-medium text-card-foreground">Reminder — Internet</span>
        </div>
        <div className="px-4 py-1">
          <MockRow label="Bill" value="ISP Pro · $49.99" />
          <MockRow label="Due date" value="Nov 15, 2026" />
          <MockRow label="Remind me" value="3 days before" />
          <MockRow label="Also on" value="1 day before · due date" />
          <MockRow label="Stops when" value="Marked as paid" />
        </div>
      </div>
    ),
  },
  {
    icon: CheckCircle2,
    step: "Pay",
    title: "Mark it paid",
    desc: "Once you've paid, mark the bill as paid. Record the payment method, amount paid, and a reference number. The bill moves to PAID status permanently.",
    detail: "Payment records are kept on the bill — amount, method, reference, date.",
    mock: (
      <div className="rounded-sm border border-border bg-card">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <CreditCard className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-sm font-medium text-card-foreground">Payment recorded</span>
          <div className="ml-auto"><StatusBadge label="PAID" variant="paid" /></div>
        </div>
        <div className="px-4 py-1">
          <MockRow label="Bill" value="Internet — ISP Pro" />
          <MockRow label="Paid amount" value="$49.99" />
          <MockRow label="Method" value="Bank transfer" />
          <MockRow label="Reference" value="TXN-20261101-4821" />
          <MockRow label="Paid on" value="Nov 12, 2026" />
        </div>
      </div>
    ),
  },
  {
    icon: Paperclip,
    step: "Keep",
    title: "Store the receipt",
    desc: "Attach the bill image or PDF to the record. Every bill keeps its own copy — no more hunting through email or camera roll.",
    detail: "Attachments stay linked to the bill permanently. Download anytime.",
    mock: (
      <div className="rounded-sm border border-border bg-card">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <FileCheck2 className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-sm font-medium text-card-foreground">Attachments — Internet</span>
        </div>
        <div className="divide-y divide-border">
          {[
            { name: "isp-pro-nov-2026.pdf", size: "84 KB", type: "PDF" },
            { name: "payment-receipt.jpg", size: "210 KB", type: "Image" },
          ].map((file) => (
            <div key={file.name} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-xs font-medium text-foreground">{file.name}</div>
                <div className="text-[11px] text-muted-foreground">{file.size}</div>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{file.type}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

/**
 * Lifecycle section — two-column layout: timeline left, contextual mock panel right.
 */
export function LifecycleSection() {
  return (
    <section id="lifecycle" className="scroll-mt-14 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          label="How It Works"
          title="One bill received,"
          highlight="six steps to done."
          description="From the moment a bill arrives to the moment it's paid and filed — every step tracked."
        />

        <div className="mt-14 grid gap-0 lg:grid-cols-2">
          {/* Left: Timeline */}
          <div className="relative border border-border rounded-l-sm p-8">
            <div className="absolute left-[2.75rem] top-8 bottom-8 w-px bg-border" />
            <div className="space-y-0">
              {lifecycle.map((item, idx) => {
                const Icon = item.icon;
                const isLast = idx === lifecycle.length - 1;
                return (
                  <div key={item.step} className="group grid grid-cols-[40px_1fr] gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-foreground/30">
                        <Icon className="size-4 text-foreground/85" strokeWidth={1.5} />
                      </div>
                      {!isLast && (
                        <div className="w-px flex-1 bg-border" style={{ minHeight: "2rem" }} />
                      )}
                    </div>
                    <div className="pb-8">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {item.step}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-medium leading-snug text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 max-w-xs text-[13.5px] leading-normal font-light text-muted-foreground">
                        {item.desc}
                      </p>
                      <p className="mt-2 font-mono text-[12px] text-muted-foreground/60">
                        ↳ {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Mock panels */}
          <div className="flex flex-col border border-l-0 border-border rounded-r-sm">
            <div className="flex items-center gap-2 border-b border-border px-6 py-3.5">
              <span className="size-1.5 rounded-full bg-foreground/70" />
              <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
                Bill states at each step
              </span>
            </div>
            <div className="flex flex-col divide-y divide-border flex-1">
              {lifecycle.map((item) => (
                <div key={item.step} className="flex flex-col gap-2 px-6 py-4 flex-1">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    {item.step}
                  </span>
                  {item.mock}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
