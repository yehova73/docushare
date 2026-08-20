import {
  BellRing,
  Copy,
  FolderTree,
  Gauge,
  LayoutGrid,
  LockKeyhole,
  TextCursorInput,
} from "lucide-react";
import { Section, SectionHeading } from "./primitives";

const features = [
  {
    icon: Copy,
    title: "Reusable templates",
    problem: "You rewrite the same intake email for every client.",
    solution: "Save each intake as a template and duplicate it in one click.",
    benefit: "New client onboarded in under a minute.",
  },
  {
    icon: BellRing,
    title: "Automatic reminders",
    problem: "Following up feels like nagging, so it gets skipped.",
    solution: "Reminders send on your schedule until required items arrive.",
    benefit: "Nobody on your team has to chase anyone.",
  },
  {
    icon: Gauge,
    title: "Progress tracking",
    problem: "You cannot tell what is missing without reading the thread.",
    solution: "A live progress bar per client, per item.",
    benefit: 'Answer "where are we?" in two seconds.',
  },
  {
    icon: LockKeyhole,
    title: "No-login client portal",
    problem: "Clients abandon portals that ask them to register.",
    solution: "A secure link opens straight into their checklist.",
    benefit: "No password resets, no support requests.",
  },
  {
    icon: FolderTree,
    title: "Google Drive organization",
    problem: "Files arrive everywhere and get filed by hand.",
    solution:
      "Uploads route into your own Drive folder structure automatically.",
    benefit: "Your Drive stays exactly how you set it up.",
  },
  {
    icon: TextCursorInput,
    title: "Mixed field types",
    problem: "Forms handle text, storage handles files, never both.",
    solution: "Files, images, long text, links and questions in one checklist.",
    benefit: "One place to look instead of four.",
  },
  {
    icon: LayoutGrid,
    title: "Completion dashboard",
    problem: "Nobody knows which projects are blocked on the client.",
    solution: "Every open request ranked by what is outstanding and how long.",
    benefit: "Spot the stalled account before the deadline does.",
  },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Product"
        title="Everything you need to collect everything you need"
        description="DocFetch is not a CRM, a project tool or another place to store files. It does one job: getting the material in before work begins."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, ...f }) => (
          <article
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-card"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors group-hover:bg-ink group-hover:text-ink-foreground">
              <Icon className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {f.title}
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                  Problem
                </dt>
                <dd className="text-muted-foreground">{f.problem}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                  Solution
                </dt>
                <dd className="text-muted-foreground">{f.solution}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                  Benefit
                </dt>
                <dd className="font-medium text-foreground">{f.benefit}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </Section>
  );
}
