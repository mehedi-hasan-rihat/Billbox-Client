"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";

interface AuthSubmitButtonProps {
  label: string;
  loadingLabel?: string;
}

/**
 * Submit button that reads pending state from useFormStatus.
 * Must be inside a <form> to work correctly.
 */
export function AuthSubmitButton({
  label,
  loadingLabel,
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9.5 w-full items-center justify-center gap-1.5 rounded-sm border border-foreground bg-foreground font-mono text-[11px] font-semibold tracking-widest text-background transition-all hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (loadingLabel ?? "Please wait...") : label}
      {!pending && <ArrowRight className="size-3" />}
    </button>
  );
}
