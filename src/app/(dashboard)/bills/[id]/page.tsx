import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Receipt, Clock, ArrowLeft, CreditCard } from "lucide-react";
import { billsApi, ApiError } from "@/lib/api";
import { StatusBadge } from "@/components/bills/status-badge";
import { BillTimeline } from "@/components/bills/bill-timeline";
import { AddPaymentForm } from "@/components/bills/add-payment-form";
import { NotesEditor } from "@/components/bills/notes-editor";
import { Button } from "@/components/ui/button";
import { PageError } from "@/components/page-error";

export const metadata: Metadata = {
  title: "Bill — BillBox",
  description: "Bill details.",
};

export const instant = false;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch bill and timeline in parallel — don't wait for one before starting the other
  const [billResult, timelineResult] = await Promise.allSettled([
    billsApi.get(id),
    billsApi.timeline(id),
  ]);

  // Bill is critical — handle all error cases
  if (billResult.status === "rejected") {
    const err = billResult.reason;
    if (err instanceof ApiError) {
      if (err.status === 401) redirect("/login");
      return (
        <PageError
          title={err.status === 404 ? "Bill not found" : "Could not load bill"}
          message={
            err.status === 404
              ? "This bill doesn't exist or you don't have access to it."
              : `Server error (${err.status}): ${err.message}`
          }
          backHref="/bills"
          backLabel="BACK TO BILLS"
          action={{ label: "VIEW ALL BILLS", href: "/bills" }}
          retry={err.status !== 404}
        />
      );
    }
    return (
      <PageError
        title="Could not load bill"
        message="Could not reach the server. Check your connection and try again."
        backHref="/bills"
        backLabel="BACK TO BILLS"
        action={{ label: "VIEW ALL BILLS", href: "/bills" }}
      />
    );
  }

  const bill = billResult.value;

  // Timeline is non-critical — page renders fine without it
  const timeline = timelineResult.status === "fulfilled" ? timelineResult.value : [];
  const timelineError = timelineResult.status === "rejected";
  if (timelineError) {
    const err = timelineResult.reason;
    if (err instanceof ApiError && err.status === 401) redirect("/login");
    console.error("[BillDetailPage] timeline fetch failed —", err);
  }

  const canPay =
    bill.status === "UNPAID" ||
    bill.status === "UPCOMING" ||
    bill.status === "DUE_TODAY" ||
    bill.status === "OVERDUE" ||
    bill.status === "PARTIALLY_PAID";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back link */}
      <Button
        render={<Link href="/bills" />}
        variant="ghost"
        className="mb-6 h-auto p-0 font-mono text-[10px] tracking-widest text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> BACK TO BILLS
      </Button>

      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-foreground/70" />
            <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
              Bill Detail
            </span>
          </div>
          <h1 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground">
            {bill.name}
          </h1>
        </div>
        <StatusBadge status={bill.status} />
      </div>

      {/* Main content grid */}
      <div className="flex items-start gap-0 lg:flex-row flex-col">
        {/* Left — bill info (2/3 width) */}
        <div className="flex flex-col rounded-l-sm border border-border lg:flex-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Receipt className="size-3.5 text-foreground" strokeWidth={1.5} />
              <span className="font-mono text-xs font-medium tracking-[0.02em]">
                Bill Info
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              {bill.direction === "OUTGOING" ? "Expense" : "Income"}
            </span>
          </div>

          {/* Fields */}
          <div className="flex flex-col divide-y divide-border px-5 py-1">
            <InfoRow label="AMOUNT" value={`৳${bill.amount}`} />
            <InfoRow label="TOTAL PAID" value={`৳${bill.totalPaid}`} />
            <InfoRow label="REMAINING" value={`৳${bill.remaining}`} />
            <InfoRow label="CATEGORY" value={bill.category} />
            <InfoRow label="ISSUE DATE" value={formatDate(bill.issueDate)} />
            <InfoRow label="DUE DATE" value={formatDate(bill.dueDate)} />
            <InfoRow label="SOURCE" value={bill.source} />
            <InfoRow label="TYPE" value={bill.type} />
            {bill.contact && (
              <InfoRow
                label={bill.direction === "OUTGOING" ? "BILLED BY" : "BILLED TO"}
                value={bill.contact.name}
              />
            )}
          </div>

          {/* Payments list */}
          {bill.payments.length > 0 && (
            <div className="flex flex-col border-t border-border px-5 py-4 gap-3">
              <div className="flex items-center gap-2">
                <CreditCard className="size-3.5 text-foreground" strokeWidth={1.5} />
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  PAYMENTS ({bill.payments.length})
                </span>
              </div>
              <div className="flex flex-col divide-y divide-border rounded-sm border border-border">
                {bill.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs font-medium text-foreground">
                        ৳{p.amount}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {formatDate(p.paidOn)}
                        {p.paymentMethod ? ` · ${p.paymentMethod}` : ""}
                        {p.paymentReference ? ` · ${p.paymentReference}` : ""}
                      </span>
                    </div>
                    {p.note && (
                      <span className="font-mono text-[10px] text-muted-foreground text-right">
                        {p.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes section */}
          <div className="flex flex-col border-t border-border px-5 py-4">
            <span className="mb-3 font-mono text-[10px] tracking-widest text-muted-foreground">
              NOTES {bill.notes.length > 0 && `(${bill.notes.length})`}
            </span>
            <NotesEditor billId={bill.id} notes={bill.notes} />
          </div>
        </div>

        {/* Right — add payment + timeline (1/3 width) */}
        <div className="sticky top-0 flex max-h-screen flex-col overflow-hidden rounded-r-sm border border-l-0 border-border lg:flex-1">
          {/* Add payment */}
          {canPay && (
            <div className="border-b border-border p-5">
              <span className="mb-3 block font-mono text-[10px] tracking-widest text-muted-foreground">
                ADD PAYMENT
              </span>
              <AddPaymentForm billId={bill.id} />
            </div>
          )}

          {/* Timeline */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-foreground" strokeWidth={1.5} />
                <span className="font-mono text-xs font-medium tracking-[0.02em]">
                  Timeline
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {timelineError ? "unavailable" : `${timeline.length} events`}
              </span>
            </div>
            <BillTimeline events={timeline} error={timelineError} />
          </div>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Info row
// ---------------------------------------------------------------------------

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-xs font-medium text-foreground text-right">
        {value}
      </span>
    </div>
  );
}
