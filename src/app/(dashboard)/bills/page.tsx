import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText, ArrowLeft, AlertCircle } from "lucide-react";
import { billsApi, ApiError } from "@/lib/api";
import type { BillCategory, BillDirection, BillStatusFilter, BillSource, BillType, BillSortField } from "@/lib/definitions";
import { BillRow } from "@/components/bills/bill-row";
import { BillsFilterBar } from "@/components/bills/bills-filter-bar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Bills — BillBox",
  description: "All your bills.",
};

/** URL search params for the /bills page — all values are strings. */
export interface BillsPageParams {
  search?: string;
  status?: string;
  category?: string;
  source?: string;
  type?: string;
  direction?: string;
  sort?: string;
  order?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  limit?: string;
  page?: string;
}

export const instant = false;

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<BillsPageParams>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  let bills: Awaited<ReturnType<typeof billsApi.list>> | null = null;
  let fetchError: "auth" | "server" | null = null;

  try {
    bills = await billsApi.list({
      search: params.search || undefined,
      status: (params.status as BillStatusFilter) || undefined,
      category: (params.category as BillCategory) || undefined,
      source: (params.source as BillSource) || undefined,
      type: (params.type as BillType) || undefined,
      direction: (params.direction as BillDirection) || undefined,
      sort: (params.sort as BillSortField) || undefined,
      order: (params.order as "asc" | "desc") || undefined,
      issueDateFrom: params.issueDateFrom || undefined,
      issueDateTo: params.issueDateTo || undefined,
      dueDateFrom: params.dueDateFrom || undefined,
      dueDateTo: params.dueDateTo || undefined,
      limit: params.limit ? Number(params.limit) : undefined,
      page,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect("/login");
      fetchError = "server";
    } else {
      fetchError = "server";
    }
  }

  const data = bills?.data ?? [];
  const meta = bills?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 0 };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-foreground/70" />
            <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
              Bills
            </span>
          </div>
          <h1 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground">
            All bills{" "}
            <span className="text-muted-foreground">
              {!fetchError && meta.total > 0 ? `(${meta.total})` : ""}
            </span>
          </h1>
        </div>
        <Button
          render={<Link href="/bills/new" />}
          className="h-9.5 rounded-sm border-foreground bg-foreground px-4 font-mono text-[11px] tracking-widest text-background hover:bg-foreground/90"
        >
          ADD BILL <Plus className="size-3" />
        </Button>
      </div>

      {/* Filter bar — always shown so user can adjust filters even on error */}
      <BillsFilterBar currentParams={params} />

      {/* Fetch error banner */}
      {fetchError && (
        <div className="mb-6 flex items-start gap-3 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3.5">
          <AlertCircle className="mt-px size-3.5 shrink-0 text-destructive" strokeWidth={1.5} />
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-xs font-medium text-destructive">
              Could not load bills
            </span>
            <span className="font-mono text-[10px] text-destructive/80">
              The server is temporarily unavailable. Refresh to try again.
            </span>
          </div>
          <Button
            render={<Link href="/bills" />}
            variant="ghost"
            className="ml-auto h-auto shrink-0 p-0 font-mono text-[10px] tracking-widest text-destructive hover:bg-transparent hover:text-destructive/80"
          >
            RETRY
          </Button>
        </div>
      )}

      {/* Bills list */}
      {!fetchError && data.length > 0 ? (
        <div className="rounded-sm border border-border">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <span className="font-mono text-xs font-medium tracking-[0.02em] text-foreground">
              {meta.total} {meta.total === 1 ? "bill" : "bills"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Page {meta.page} of {meta.totalPages || 1}
            </span>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {data.map((bill) => (
              <BillRow key={bill.id} bill={bill} />
            ))}
          </div>
        </div>
      ) : !fetchError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-border px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-border">
            <FileText className="size-4.5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-medium text-foreground">No bills found</span>
            <span className="text-[13.5px] font-light leading-[1.6] text-muted-foreground">
              {params.search || params.status || params.category
                ? "Try adjusting your filters."
                : "Create your first bill to get started."}
            </span>
          </div>
          {!params.search && !params.status && !params.category && (
            <Button
              render={<Link href="/bills/new" />}
              className="mt-2 h-8 rounded-sm border-foreground bg-foreground px-4 font-mono text-[10px] tracking-widest text-background hover:bg-foreground/90"
            >
              ADD BILL <Plus className="size-3" />
            </Button>
          )}
        </div>
      ) : null}

      {/* Pagination */}
      {!fetchError && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {page > 1 && (
            <Button
              render={<Link href={`/bills?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`} />}
              variant="outline"
              className="h-8 rounded-sm px-4 font-mono text-[10px] tracking-widest"
            >
              <ArrowLeft className="size-3" /> PREV
            </Button>
          )}
          <span className="font-mono text-[10px] text-muted-foreground">
            {page} / {meta.totalPages}
          </span>
          {page < meta.totalPages && (
            <Button
              render={<Link href={`/bills?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`} />}
              variant="outline"
              className="h-8 rounded-sm px-4 font-mono text-[10px] tracking-widest"
            >
              NEXT <ArrowLeft className="size-3 rotate-180" />
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
