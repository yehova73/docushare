import { LayoutTemplate, Send, ListChecks } from "lucide-react";
import { Section, SectionHeading } from "./primitives";

const steps = [
  {
    icon: LayoutTemplate,
    step: "01",
    title: "Build the checklist once",
    body: "List everything you need — files, images, text answers, links, questions. Mark what is required. Save it as a template you reuse for every client.",
    note: "Setup time: about 5 minutes",
  },
  {
    icon: Send,
    step: "02",
    title: "Send one link",
    body: "Paste it into your proposal, welcome email or chat. No invite, no seat, no password for your client to lose.",
    note: "Works in any email you already send",
  },
  {
    icon: ListChecks,
    step: "03",
    title: "Watch it fill in",
    body: "Clients tick items off at their own pace. Reminders continue until every required item is in. You get one notification when it is done.",
    note: "You do nothing in between",
  },
];

export function HowItWorks() {
  return (
    <Section id="how" className="bg-surface border-y border-border">
      <SectionHeading
        eyebrow="How it works"
        title="Three steps, and only the first one takes any of your time"
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map(({ icon: Icon, ...s }) => (
          <div
            key={s.step}
            className="relative rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {s.step}
            </span>
            <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-ink-foreground">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
            <p className="mt-4 border-t border-border pt-3 text-xs font-medium text-brand">
              {s.note}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
