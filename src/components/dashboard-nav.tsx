"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Receipt } from "lucide-react";
import type { SessionUser } from "@/lib/session";
import { LogoutButton } from "@/components/auth/logout-button";

interface DashboardNavProps {
  user: SessionUser;
}

const navLinks = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/bills", label: "BILLS" },
  { href: "/contacts", label: "CONTACTS" },
  { href: "/recurring", label: "RECURRING" },
] as const;

/**
 * Shared navbar for all dashboard pages.
 * Client component — reads pathname for active link highlighting.
 */
export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand + nav links */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
            <Receipt className="size-5 text-foreground" strokeWidth={1.5} />
            <span className="font-mono text-sm font-medium tracking-[0.02em]">BILLBOX</span>
          </Link>
          <div className="hidden items-center sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex h-12 items-center px-3 font-mono text-[10px] font-medium tracking-widest transition-colors ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Avatar + logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className={`flex size-7 items-center justify-center rounded-full border font-mono text-[10px] font-semibold tracking-widest transition-colors ${
              pathname === "/profile"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-muted text-foreground hover:border-foreground/30 hover:bg-muted/80"
            }`}
            title={user.name || user.email}
          >
            {user.name
              ? user.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
              : user.email.slice(0, 2).toUpperCase()}
          </Link>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
