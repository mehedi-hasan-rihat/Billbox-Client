import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { contactsApi, ApiError } from "@/lib/api";
import { BillForm } from "@/components/bills/bill-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "New Bill — BillBox",
  description: "Create a new bill.",
};

export const instant = false;

export default async function NewBillPage() {
  let contacts: Awaited<ReturnType<typeof contactsApi.list>> = [];
  let contactsLoadError = false;

  try {
    contacts = await contactsApi.list();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect("/login");
    contactsLoadError = true;
    console.error("[NewBillPage] failed to load contacts —", err);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back link */}
      <Button
        render={<Link href="/bills" />}
        variant="ghost"
        className="mb-6 h-auto p-0 font-mono text-[10px] tracking-widest text-muted-foreground hover:bg-transparent hover:text-foreground"
      >
        <ArrowLeft className="size-3" /> BACK TO BILLS
      </Button>

      {/* Page header */}
      <div className="mb-8">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-foreground/70" />
          <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
            New Bill
          </span>
        </div>
        <h1 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground">
          Create a{" "}
          <span className="text-muted-foreground">new bill.</span>
        </h1>
      </div>

      {/* Form card */}
      <div className="rounded-sm border border-border p-6">
        <BillForm contacts={contacts} contactsLoadError={contactsLoadError} />
      </div>
    </main>
  );
}
