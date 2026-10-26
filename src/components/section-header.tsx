import { cn } from "cn";

interface SectionHeaderProps {
  label?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Reusable section header — Mosa-style with monospace label, dot prefix,
 * and two-tone title (bold + muted highlight on a new line).
 */
export function SectionHeader({
  label,
  title,
  highlight,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {label && (
        <div className="mb-5 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-foreground/70" />
          <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
            {label}
          </span>
        </div>
      )}
      <h2 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[36px] lg:text-[44px]">
        {title}{" "}
        {highlight && (
          <>
            <br className="hidden sm:block" />
            <span className="text-muted-foreground">{highlight}</span>
          </>
        )}
      </h2>
      {description && (
        <p className="mt-5 max-w-md text-[15px] leading-[1.6] font-light text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
