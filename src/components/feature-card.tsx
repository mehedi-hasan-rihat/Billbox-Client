import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

/**
 * Reusable card — Mosa-style with circular bordered icon container.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-5 rounded-sm border border-border bg-muted/30 p-6 transition-all duration-300 hover:border-foreground/20 hover:bg-muted/50",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full border border-border bg-transparent transition-colors duration-300 group-hover:border-foreground/30">
        <Icon className="size-[18px] text-foreground/85" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-mono text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="max-w-[260px] text-[13.5px] font-light leading-[1.6] text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
