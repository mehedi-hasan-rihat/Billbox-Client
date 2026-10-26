import {
  AlertCircle,
  Mail,
  MessageCircle,
  FileImage,
  Globe,
  ScrollText,
  ArrowRight,
  Receipt,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";

const problems = [
  { q: "Which bills are unpaid?", note: "Can't tell without checking everything" },
  { q: "Which bill's deadline is approaching?", note: "No single place to look" },
  { q: "Which bill is overdue?", note: "Find out too late" },
  { q: "Where is last month's restaurant bill?", note: "Lost in camera roll or chat" },
  { q: "Where did I save that bill PDF?", note: "Downloaded folder, maybe?" },
  { q: "Did I already pay the Internet bill?", note: "Can't be sure" },
];

const sources = [
  { icon: Mail, label: "Email attachments", count: "12 unread" },
  { icon: MessageCircle, label: "WhatsApp messages", count: "3 photos" },
  { icon: FileImage, label: "Camera roll", count: "47 images" },
  { icon: Globe, label: "Provider websites", count: "5 portals" },
  { icon: ScrollText, label: "Paper receipts", count: "Desk drawer" },
];

export function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-14 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          label="The Problem"
          title="Bills are scattered"
          highlight="everywhere."
          description="Answering simple questions becomes impossible when bills live across five different places at once."
        />

        <div className="mt-14 grid gap-0 lg:grid-cols-2">

          {/* Left: Questions */}
          <div className="flex flex-col border border-border rounded-l-sm">
            <div className="flex items-center gap-2 border-b border-border px-6 py-3.5">
              <AlertCircle className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
              <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
                Questions you can't answer
              </span>
            </div>
            <div className="flex flex-col divide-y divide-border flex-1">
              {problems.map((item, idx) => (
                <div key={idx} className="group flex flex-col gap-1 px-6 py-4 flex-1 transition-colors hover:bg-muted/30">
                  <span className="text-[14px] font-medium text-foreground">{item.q}</span>
                  <span className="font-mono text-[11px] text-muted-foreground/70">↳ {item.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Scattered sources → BillBox */}
          <div className="flex flex-col border border-l-0 border-border rounded-r-sm">
            <div className="flex items-center gap-2 border-b border-border px-6 py-3.5">
              <span className="size-1.5 rounded-full bg-foreground/70" />
              <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
                Where your bills actually live
              </span>
            </div>

            {/* Source tiles */}
            <div className="flex flex-col divide-y divide-border flex-1">
              {sources.map((source) => {
                const Icon = source.icon;
                return (
                  <div
                    key={source.label}
                    className="group flex items-center gap-3 px-6 py-4 flex-1 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-foreground/20">
                      <Icon className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13.5px] font-medium text-foreground">{source.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                      {source.count}
                    </span>
                  </div>
                );
              })}

              {/* Resolution row */}
              <div className="flex items-center gap-3 px-6 py-4 bg-foreground">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-background/20 bg-background/10">
                  <Receipt className="size-3.5 text-background" strokeWidth={1.5} />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <ArrowRight className="size-3.5 text-background/60 shrink-0" strokeWidth={1.5} />
                  <span className="text-[13.5px] font-medium text-background">
                    One BillBox inbox
                  </span>
                </div>
                <span className="font-mono text-[11px] text-background/60 shrink-0">All of it</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
