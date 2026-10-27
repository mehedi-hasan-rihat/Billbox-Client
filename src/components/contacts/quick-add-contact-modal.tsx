"use client";

import { useState, useEffect, useActionState } from "react";
import { UserPlus } from "lucide-react";
import { createContactAction } from "@/app/actions/contacts";
import type { Contact } from "@/lib/definitions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface QuickAddContactModalProps {
  /** Called with the new contact when creation succeeds. */
  onCreated: (contact: Contact) => void;
}

/**
 * "+ New contact" trigger that opens a dialog to create a contact inline,
 * without leaving the bill creation form. On success the new contact is
 * automatically selected in the parent form.
 */
export function QuickAddContactModal({ onCreated }: QuickAddContactModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createContactAction, undefined);

  // state.message holds the created Contact as JSON on success
  useEffect(() => {
    if (!state?.message) return;
    try {
      const contact: Contact = JSON.parse(state.message);
      onCreated(contact);
      setOpen(false);
    } catch {
      // parse error shouldn't happen — ignore
    }
  }, [state?.message, onCreated]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-foreground">
        <UserPlus className="size-3" strokeWidth={1.5} />
        NEW CONTACT
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-foreground/70" />
            <span className="font-mono text-[10px] tracking-[0.02em] text-muted-foreground">
              New Contact
            </span>
          </div>
          <DialogTitle>Add a contact</DialogTitle>
          <DialogDescription>
            Save a person or company so you can link them to bills.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          {state?.errors?.form && (
            <div className="flex items-start gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3">
              <span className="text-xs text-destructive">{state.errors.form[0]}</span>
            </div>
          )}

          <ModalField label="Name *" error={state?.errors?.name}>
            <Input
              name="name"
              type="text"
              placeholder="Grameenphone"
              autoFocus
              className="rounded-sm"
            />
          </ModalField>

          <ModalField label="Phone" error={state?.errors?.phone}>
            <Input
              name="phone"
              type="tel"
              placeholder="01700000000"
              className="rounded-sm"
            />
          </ModalField>

          <ModalField label="Email" error={state?.errors?.email}>
            <Input
              name="email"
              type="email"
              placeholder="billing@example.com"
              className="rounded-sm"
            />
          </ModalField>

          <ModalField label="BillBox ID" error={state?.errors?.billBoxId}>
            <Input
              name="billBoxId"
              type="text"
              placeholder="BB-XXXX-XXXX-XXXX"
              className="rounded-sm font-mono"
            />
          </ModalField>

          <div className="mt-1 flex items-center justify-end gap-2">
            <DialogClose
              type="button"
              className="inline-flex h-8 items-center justify-center rounded-sm border border-input bg-background px-3 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:bg-muted"
            >
              CANCEL
            </DialogClose>
            <Button
              type="submit"
              className="rounded-sm border-foreground bg-foreground font-mono text-[10px] tracking-widest text-background hover:bg-foreground/90"
            >
              ADD CONTACT
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ModalField({
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
