import type { BillStatus } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

const statusConfig: Record<BillStatus, { label: string; className: string }> = {
  INBOX:         { label: "INBOX",     className: "border-border bg-muted/50 text-muted-foreground" },
  UNPAID:        { label: "UNPAID",    className: "border-foreground/20 bg-foreground/5 text-foreground" },
  PARTIALLY_PAID:{ label: "PARTIAL",   className: "border-foreground/30 bg-foreground/8 text-foreground" },
  UPCOMING:      { label: "UPCOMING",  className: "border-foreground/30 bg-foreground/8 text-foreground" },
  DUE_TODAY:     { label: "DUE TODAY", className: "border-foreground/30 bg-foreground/10 text-foreground" },
  OVERDUE:       { label: "OVERDUE",   className: "border-destructive/30 bg-destructive/10 text-destructive" },
  PAID:          { label: "PAID",      className: "border-foreground/20 bg-foreground/5 text-muted-foreground" },
};

interface StatusBadgeProps {
  status: BillStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      className={cn(
        "rounded-sm px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest",
        config.className,
      )}
    >
      {config.label}
    </Badge>
  );
}
