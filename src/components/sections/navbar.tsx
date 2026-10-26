import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "How it works", href: "#lifecycle" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

/**
 * Sticky top navigation bar — Mosa-style monospace links with bordered segments.
 */
export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <Receipt className="size-5 text-foreground" />
            <span className="font-mono text-sm font-medium tracking-[0.02em]">BILLBOX</span>
          </div>
          <div className="hidden items-center gap-0 lg:flex">
            {navLinks.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                className={`inline-flex h-[34px] items-center px-3.5 font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
                  idx === 0 ? "rounded-l-sm" : ""
                } ${idx === navLinks.length - 1 ? "rounded-r-sm" : ""}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-0">
          <Button
            size="sm"
            className="rounded-r-none font-mono text-[11px] font-semibold tracking-[0.08em]"
          >
            Get started
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-l-none border-l-0 font-mono text-[11px] font-medium tracking-[0.08em]"
          >
            LOGIN
          </Button>
        </div>
      </div>
    </nav>
  );
}
