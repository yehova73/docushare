import { ArrowDown, Check, X } from "lucide-react";
import { Section, SectionHeading } from "./primitives";

const today = [
  "Kickoff email with 9 attachments requested",
  "Client replies with 3 of them",
  "Follow-up email, no response",
  'WhatsApp message: "just sending the logo"',
  "Logo arrives as a screenshot",
  "Second Drive folder created by mistake",
  "Project start pushed back a week",
  "Invoice slips to next month",
];

const withDocFetch = [
  "Pick a saved template",
  "Send one secure link",
  "Client works through the checklist",
  "Reminders go out on their own",
  "Files land in the right Drive folder",
  "You get one notification: complete",
];

export function ProblemSection() {
  return (
    <Section id="problem">
      <SectionHeading
        eyebrow="The real cost"
        title="Collecting client material is the slowest part of the job"
        description="It is not one big problem. It is forty small ones spread across email, chat and three different folders."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <p className="text-sm font-semibold text-foreground">Today</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Eleven days from kickoff to "we have everything".
          </p>
          <ol className="mt-6 space-y-0">
            {today.map((step, i) => (
              <li key={step}>
                <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-sm text-foreground">{step}</span>
                </div>
                {i < today.length - 1 ? (
                  <div className="flex justify-center py-1.5">
                    <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-ink/15 bg-card p-6 shadow-card sm:p-8">
          <p className="text-sm font-semibold text-foreground">With DocFetch</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Under two days on average, and none of it in your inbox.
          </p>
          <ol className="mt-6 space-y-0">
            {withDocFetch.map((step, i) => (
              <li key={step}>
                <div className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    strokeWidth={2.6}
                  />
                  <span className="text-sm text-foreground">{step}</span>
                </div>
                {i < withDocFetch.length - 1 ? (
                  <div className="flex justify-center py-1.5">
                    <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/60" />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm text-foreground">
            Nothing changes for your client. They still click a link and send
            you things. You just stop being the reminder system.
          </p>
        </div>
      </div>
    </Section>
  );
}
