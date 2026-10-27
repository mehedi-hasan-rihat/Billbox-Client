import type { BillTimelineEvent } from "@/lib/definitions";

const eventConfig: Record<string, { label: string }> = {
  CREATED:             { label: "Created" },
  SENT:                { label: "Sent" },
  RECEIVED:            { label: "Received" },
  CONFIRMED:           { label: "Confirmed" },
  PAYMENT_ADDED:       { label: "Payment Added" },
  FULLY_PAID:          { label: "Fully Paid" },
  PAYMENT_UPDATED:     { label: "Payment Updated" },
  PAYMENT_DELETED:     { label: "Payment Deleted" },
  EDITED:              { label: "Edited" },
  NOTE_ADDED:          { label: "Note Added" },
  NOTE_UPDATED:         { label: "Note Updated" },
  NOTE_DELETED:         { label: "Note Deleted" },
  RECURRING_GENERATED: { label: "Recurring Generated" },
};

interface BillTimelineProps {
  events: BillTimelineEvent[];
  error?: boolean;
}

/**
 * Vertical timeline of bill lifecycle events.
 */
export function BillTimeline({ events, error }: BillTimelineProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
        <span className="font-mono text-xs text-muted-foreground">
          Could not load timeline
        </span>
        <span className="font-mono text-[10px] text-muted-foreground/60">
          The bill is fine — only the history failed to load.
        </span>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
        <span className="font-mono text-xs text-muted-foreground">No events yet</span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto border-l-1">
      {/* Connector line */}
      {/* <div className="absolute left-4.75 top-2 bottom-2 w-px bg-border" /> */}

      {events.map((event, idx) => {
        const config = eventConfig[event.type] ?? { label: event.type };
        const isLast = idx === events.length - 1;
        const stepNum = String(idx + 1).padStart(2, "0");

        return (
          <div key={event.id} className={`relative flex gap-4 px-5 pt-4 ${isLast ? "pb-4" : "pb-2"}`}>
            {/* Step node */}
            <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background">
              <span className="font-mono text-xs font-semibold text-muted-foreground">
                {stepNum}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-0.5 pt-1">
              <span className="font-mono text-xs font-medium text-foreground">
                {config.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {new Date(event.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              {event.actor && (
                <span className="font-mono text-[10px] text-muted-foreground/60">
                  by {event.actor.name || event.actor.email}
                </span>
              )}
              {/* Show relevant metadata */}
              {event.type === "PAYMENT_ADDED" && !!event.metadata.amount && (
                <span className="font-mono text-[10px] text-foreground/80">
                  ৳{String(event.metadata.amount)}
                  {event.metadata.method ? ` · ${String(event.metadata.method)}` : ""}
                </span>
              )}
              {event.type === "FULLY_PAID" && !!event.metadata.totalPaid && (
                <span className="font-mono text-[10px] text-foreground/80">
                  Total paid: ৳{String(event.metadata.totalPaid)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
