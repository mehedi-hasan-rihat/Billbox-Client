"use client";

import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import { cn } from "cn";

interface LogoutButtonProps {
  label?: string;
  className?: string;
}

/**
 * Logout button — wraps logoutAction in a form so it works
 * without JavaScript (progressive enhancement).
 */
export function LogoutButton({ label, className }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={cn(
          "inline-flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-widest text-muted-foreground transition-colors hover:text-foreground",
          className,
        )}
      >
        <LogOut className="size-3.5" strokeWidth={1.5} />
        {label ?? "SIGN OUT"}
      </button>
    </form>
  );
}
