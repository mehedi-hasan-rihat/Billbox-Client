import {
  Inbox,
  Plus,
  Clock,
  Bell,
  Repeat,
  Search,
  Paperclip,
  History,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { FeatureCard } from "@/components/feature-card";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const features: Feature[] = [
  { icon: Inbox, title: "Personal BillBox ID", desc: "Get a unique ID. Senders push bills directly to your inbox — no more chasing emails or WhatsApp messages." },
  { icon: Plus, title: "Manual Bill Creation", desc: "Add bills yourself with title, amount, due date, category, and recurring flag. Perfect for paper receipts and cash purchases." },
  { icon: Clock, title: "5 Smart Statuses", desc: "Pending, Unpaid, Paid are tracked. Upcoming and Overdue are computed automatically from due dates." },
  { icon: Bell, title: "Configurable Reminders", desc: "Set reminders 3 days, 2 days, 1 day before, or on the due date. They stop automatically once a bill is paid." },
  { icon: Repeat, title: "Recurring Bills", desc: "Set up monthly Internet or rent bills. BillBox auto-generates the next bill each cycle with its own lifecycle." },
  { icon: Search, title: "Search & Filter", desc: "Search by text. Filter by status, category, date range, or amount range. Find any bill in seconds." },
  { icon: Paperclip, title: "Attachments", desc: "Attach images or PDFs to any bill. Keep bill copies and payment receipts together with the record." },
  { icon: History, title: "Bill History", desc: "Every lifecycle change is timestamped so you can review what happened and when." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-14 border-b border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          label="Features"
          title="Everything you need"
          highlight="to manage bills."
          description="Built for the way people actually deal with bills — across sources, formats, and reminders."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
