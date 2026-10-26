import { Receipt, Copy } from "lucide-react";
import type { SessionUser } from "@/lib/session";

interface ProfileCardProps {
  user: SessionUser;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-0">
    <span className="font-mono text-xs text-muted-foreground shrink-0">{label}</span>
    <span className="font-mono text-xs font-medium text-foreground text-right break-all">
      {value}
    </span>
  </div>
);

/**
 * Displays the logged-in user's profile details.
 * Server component — receives user from page via session.
 */
export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="rounded-sm border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
        <Receipt className="size-4 text-foreground" strokeWidth={1.5} />
        <span className="font-mono text-sm font-medium text-card-foreground">
          Your Profile
        </span>
      </div>

      {/* Fields */}
      <div className="px-5 py-1">
        <InfoRow label="Name" value={user.name || "—"} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="ID" value={user.id} />
      </div>

      {/* BillBox ID — highlighted */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-foreground px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-medium tracking-widest text-background/60 uppercase">
            BillBox ID
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold text-background tabular-nums">
            {user.billBoxId}
          </span>
          <Copy className="size-3.5 text-background/50" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
