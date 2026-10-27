"use client";

import { useState } from "react";
import { useActionState } from "react";
import { addPaymentAction } from "@/app/actions/bills";
import type { PaymentMethod } from "@/lib/definitions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select";

const paymentMethods: PaymentMethod[] = ["CASH", "BKASH", "NAGAD", "BANK", "CARD", "OTHER"];

export function AddPaymentForm({ billId }: { billId: string }) {
  const [state, action] = useActionState(addPaymentAction, undefined);
  const [amount, setAmount] = useState("");
  const [paidOn, setPaidOn] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [note, setNote] = useState("");

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="billId" value={billId} />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />

      {state?.errors?.form && (
        <div className="flex items-start gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3">
          <span className="text-xs text-destructive">{state.errors.form[0]}</span>
        </div>
      )}

      <Field label="Amount" error={state?.errors?.amount}>
        <Input
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="600.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-sm tabular-nums"
        />
      </Field>

      <Field label="Paid On" error={state?.errors?.paidOn}>
        <Input
          name="paidOn"
          type="date"
          value={paidOn}
          onChange={(e) => setPaidOn(e.target.value)}
          className="rounded-sm"
        />
      </Field>

      <Field label="Payment Method">
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="">None</SelectItem>
            {paymentMethods.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </Field>

      <Field label="Reference">
        <Input
          name="paymentReference"
          type="text"
          placeholder="TXN8FK2910"
          value={paymentReference}
          onChange={(e) => setPaymentReference(e.target.value)}
          className="rounded-sm"
        />
      </Field>

      <Field label="Note">
        <Input
          name="note"
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-sm"
        />
      </Field>

      <Button
        type="submit"
        className="h-9.5 rounded-sm border-foreground bg-foreground font-mono text-[11px] tracking-widest text-background hover:bg-foreground/90"
      >
        ADD PAYMENT
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-mono text-[10px] font-medium tracking-[0.04em] text-muted-foreground uppercase">
        {label}
      </Label>
      {children}
      {error && <p className="font-mono text-xs text-destructive">{error[0]}</p>}
    </div>
  );
}
