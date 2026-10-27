import Link from "next/link";
import type { Bill } from "@/lib/definitions";
import { StatusBadge } from "@/components/bills/status-badge";

interface BillRowProps {
  bill: Bill;
}

/**
 * Bill row for lists — shows name, category, amount, due date, and status badge.
 * Links to /bills/:id on click.
 */
export function BillRow({ bill }: BillRowProps) {
  const dueDate = bill.dueDate
    ? new Date(bill.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/bills/${bill.id}`}
      className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40"
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-mono text-xs font-medium text-foreground">
          {bill.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
            {bill.category}
          </span>
          {bill.contact && (
            <span className="font-mono text-[10px] text-muted-foreground/60">
              · {bill.contact.name}
            </span>
          )}
          {dueDate && (
            <span className="font-mono text-[10px] text-muted-foreground/60">
              · {dueDate}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
          ৳{bill.amount}
        </span>
        <StatusBadge status={bill.status} />
      </div>
    </Link>
  );
}
