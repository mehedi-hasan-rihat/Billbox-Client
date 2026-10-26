import {
  Wifi,
  Zap,
  Flame,
  Droplet,
  Smartphone,
  UtensilsCrossed,
  ShoppingBag,
  Repeat,
  BookOpen,
  Home,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

interface BillType {
  icon: LucideIcon;
  label: string;
}

const billTypes: BillType[] = [
  { icon: Wifi, label: "Internet" },
  { icon: Zap, label: "Electricity" },
  { icon: Flame, label: "Gas" },
  { icon: Droplet, label: "Water" },
  { icon: Smartphone, label: "Mobile" },
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: ShoppingBag, label: "Shopping" },
  { icon: Repeat, label: "Subscription" },
  { icon: Home, label: "Rent" },
  { icon: BookOpen, label: "Education" },
  { icon: Package, label: "Other" },
];

export function BillTypesSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          label="Categories"
          title="Supports every"
          highlight="bill type."
          description="From utilities to tuition, BillBox handles them all."
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {billTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.label}
                className="group flex flex-col items-center gap-2.5 rounded-sm border border-border bg-muted/30 p-5 transition-all duration-300 hover:border-foreground/20 hover:bg-muted/50"
              >
                <div className="flex size-10 items-center justify-center rounded-full border border-border transition-colors group-hover:border-foreground/30">
                  <Icon className="size-[18px] text-muted-foreground" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-sm font-medium text-foreground">
                  {type.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
