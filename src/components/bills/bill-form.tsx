"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createBillAction } from "@/app/actions/bills";
import type { Contact, BillCategory, BillDirection } from "@/lib/definitions";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select";
import { QuickAddContactModal } from "@/components/contacts/quick-add-contact-modal";

interface BillFormProps {
  contacts: Contact[];
  contactsLoadError?: boolean;
}

const categories: BillCategory[] = [
  "INTERNET", "ELECTRICITY", "GAS", "WATER", "MOBILE",
  "RESTAURANT", "SHOPPING", "SUBSCRIPTION", "RENT", "EDUCATION", "OTHER",
];

/**
 * Bill create form — name, category, amount, dates, contact, note.
 * Payments are added separately on the bill detail page.
 */
export function BillForm({ contacts: initialContacts, contactsLoadError }: BillFormProps) {
  const [state, action] = useActionState(createBillAction, undefined);
  const [direction, setDirection] = useState<BillDirection>("OUTGOING");
  const [category, setCategory] = useState<BillCategory>("INTERNET");
  const [contactId, setContactId] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  // Controlled text fields — preserved on validation error
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  const contactLabel = direction === "OUTGOING" ? "Billed by" : "Billed to";
  const contactPlaceholder = direction === "OUTGOING" ? "Who billed you?" : "Who are you billing?";

  function handleContactCreated(contact: Contact) {
    setContacts((prev) => [...prev, contact]);
    setContactId(contact.id);
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Hidden fields for controlled Select values */}
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="contactId" value={contactId} />

      {/* Form error */}
      {state?.errors?.form && (
        <div className="flex items-start gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3">
          <span className="text-xs text-destructive">{state.errors.form[0]}</span>
        </div>
      )}

      {/* Bill type — direction toggle */}
      <Field label="Bill type" error={state?.errors?.direction}>
        <div className="flex overflow-hidden rounded-sm border border-input">
          {(["OUTGOING", "INCOMING"] as BillDirection[]).map((d) => (
            <label
              key={d}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-center gap-2 px-3 py-2 font-mono text-[10px] font-semibold tracking-widest transition-colors select-none",
                direction === d
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted/60",
              )}
            >
              <input
                type="radio"
                name="direction"
                value={d}
                checked={direction === d}
                onChange={() => setDirection(d)}
                className="sr-only"
              />
              {d === "OUTGOING" ? "Expense — I owe" : "Income — I'm owed"}
            </label>
          ))}
        </div>
      </Field>

      {/* Bill Name */}
      <Field label="Bill Name" error={state?.errors?.name}>
        <Input
          name="name"
          type="text"
          placeholder="October Internet Bill"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-sm"
        />
      </Field>

      {/* Category */}
      <Field label="Category" error={state?.errors?.category}>
        <Select name="category" value={category} onValueChange={(v) => setCategory(v as BillCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </Field>

      {/* Amount */}
      <Field label="Amount" error={state?.errors?.amount}>
        <Input
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="1200.00"
          className="rounded-sm tabular-nums"
        />
      </Field>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Issue Date">
          <Input name="issueDate" type="date" className="rounded-sm" />
        </Field>
        <Field label="Due Date">
          <Input name="dueDate" type="date" className="rounded-sm" />
        </Field>
      </div>

      {/* Contact — label + inline "new contact" trigger */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className="font-mono text-[10px] font-medium tracking-[0.04em] text-muted-foreground uppercase">
            {contactLabel}
          </Label>
          <QuickAddContactModal onCreated={handleContactCreated} />
        </div>
        <Select name="contactId" value={contactId} onValueChange={setContactId}>
          <SelectTrigger>
            <SelectValue placeholder={contacts.length > 0 ? contactPlaceholder : "No contacts yet"} />
          </SelectTrigger>
          <SelectPopup>
            <SelectItem value="">None</SelectItem>
            {contacts.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectPopup>
        </Select>
        {contactsLoadError && (
          <p className="font-mono text-[10px] text-destructive">
            Contacts could not be loaded. You can still create the bill and link a contact later.
          </p>
        )}
      </div>

      {/* Note */}
      <Field label="Note">
        <Textarea name="note" rows={3} placeholder="Optional note..." />
      </Field>

      {/* Submit */}
      <Button
        type="submit"
        className="h-9.5 rounded-sm border-foreground bg-foreground font-mono text-[11px] tracking-widest text-background hover:bg-foreground/90"
      >
        CREATE BILL
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
