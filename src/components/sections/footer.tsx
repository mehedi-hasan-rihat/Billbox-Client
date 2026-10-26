import { Receipt } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#lifecycle" },
    { label: "Bill types", href: "#" },
    { label: "Pricing", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

/**
 * Footer — Mosa-style minimal with monospace headings.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Receipt className="size-4 text-foreground" strokeWidth={1.5} />
              <span className="font-mono text-sm font-medium">BILLBOX</span>
            </div>
            <p className="max-w-xs text-xs leading-5 font-light text-muted-foreground">
              Personal bill inbox and management system. All your bills in one place.
            </p>
          </div>
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-3">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {heading}
              </span>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center font-mono text-xs text-muted-foreground">
            © 2026 BillBox. Personal bill inbox and management system.
          </p>
        </div>
      </div>
    </footer>
  );
}
