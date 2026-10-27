"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import type { BillsPageParams } from "@/app/(dashboard)/bills/page";
import type { BillCategory } from "@/lib/definitions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select";

interface BillsFilterBarProps {
  currentParams: BillsPageParams;
}

const statuses = ["ALL", "INBOX", "UNPAID", "PARTIALLY_PAID", "UPCOMING", "DUE_TODAY", "OVERDUE", "PAID"] as const;

const categories: BillCategory[] = [
  "INTERNET", "ELECTRICITY", "GAS", "WATER", "MOBILE",
  "RESTAURANT", "SHOPPING", "SUBSCRIPTION", "RENT", "EDUCATION", "OTHER",
];

const sortOptions = [
  { value: "createdAt", label: "Date Added" },
  { value: "dueDate",   label: "Due Date"   },
  { value: "issueDate", label: "Bill Date"  },
  { value: "amount",    label: "Amount"     },
] as const;

/**
 * Client-side filter bar for the bills list page.
 * All changes push to the URL via router — no form submit needed.
 */
export function BillsFilterBar({ currentParams }: BillsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Partial<BillsPageParams>) => {
      const next = new URLSearchParams();
      const merged = { ...currentParams, ...updates, page: undefined };
      for (const [k, v] of Object.entries(merged)) {
        if (v !== undefined && v !== "") next.set(k, String(v));
      }
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`);
      });
    },
    [currentParams, pathname, router],
  );

  const currentStatus = currentParams.status || "ALL";
  const currentSort   = currentParams.sort  || "createdAt";
  const currentOrder  = currentParams.order || "desc";

  const currentSortLabel = sortOptions.find((s) => s.value === currentSort)?.label ?? "Date Added";

  return (
    <div className="mb-6 flex flex-col gap-3">

      {/* Row 1 — search + category + direction + sort */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative min-w-45 flex-1">
          <Search
            className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.5}
          />
          <Input
            type="text"
            defaultValue={currentParams.search}
            placeholder="Search bills..."
            onChange={(e) => updateParams({ search: e.target.value || undefined })}
            className="rounded-sm pl-8"
          />
        </div>

        {/* Category */}
        <Select
          value={currentParams.category ?? ""}
          onValueChange={(v) => updateParams({ category: v || undefined })}
        >
          <SelectTrigger className="w-auto min-w-32">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectPopup>
        </Select>

        {/* Direction */}
        <Select
          value={currentParams.direction ?? ""}
          onValueChange={(v) => updateParams({ direction: v || undefined })}
        >
          <SelectTrigger className="w-auto min-w-28">
            <SelectValue placeholder="All Directions" />
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="">All Directions</SelectItem>
            <SelectItem value="OUTGOING">Expense</SelectItem>
            <SelectItem value="INCOMING">Income</SelectItem>
          </SelectPopup>
        </Select>

        {/* Sort field + direction toggle */}
        <div className="flex items-center">
          <Select
            value={currentSort}
            onValueChange={(v) => updateParams({ sort: v || undefined })}
          >
            <SelectTrigger className="w-auto min-w-28 rounded-r-none border-r-0">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {sortOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectPopup>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => updateParams({ order: currentOrder === "desc" ? "asc" : "desc" })}
            title={currentOrder === "desc" ? `${currentSortLabel}: newest first` : `${currentSortLabel}: oldest first`}
            className="h-8 w-8 rounded-l-none rounded-r-sm"
          >
            {currentOrder === "desc"
              ? <ArrowDown className="size-3.5" strokeWidth={1.5} />
              : <ArrowUp   className="size-3.5" strokeWidth={1.5} />
            }
          </Button>
        </div>

      </div>

      {/* Row 2 — status filter pills */}
      <div className="flex flex-wrap items-center gap-1">
        {statuses.map((status) => (
          <Button
            key={status}
            type="button"
            size="sm"
            onClick={() => updateParams({ status: status === "ALL" ? undefined : status })}
            className={cn(
              "h-7 rounded-sm px-3 font-mono text-[10px] tracking-widest",
              currentStatus === status
                ? "border-foreground bg-foreground text-background hover:bg-foreground/90"
                : "border-border bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {status}
          </Button>
        ))}
      </div>

    </div>
  );
}
