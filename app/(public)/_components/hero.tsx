import {
  ArrowRight,
  Check,
  CircleDashed,
  FolderCheck,
  Link2,
  Play,
  Sparkle,
} from "lucide-react";
import { BrowserFrame } from "./primitives";

const checklist = [
  { label: "Brand assets (logo, fonts)", state: "done", meta: "4 files" },
  { label: "Website copy — Home page", state: "done", meta: "Text" },
  { label: "Domain & hosting access", state: "done", meta: "2 links" },
  { label: "Team photos", state: "pending", meta: "Reminder sent 2d ago" },
  { label: "Signed proposal", state: "waiting", meta: "Due in 3 days" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-veil px-5 pt-32 pb-16 sm:px-8 sm:pt-40 md:pb-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] grid-paper opacity-[0.5] [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-3xl text-center animate-rise">
          <a
            href="#drive"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft transition-colors hover:text-foreground"
          >
            <Sparkle className="h-3.5 w-3.5 text-brand" strokeWidth={2.4} />
            New: files land in your own Google Drive folders
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.05] text-foreground sm:text-6xl md:text-[4.25rem]">
            Stop chasing clients for files
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Send one checklist link. Clients upload files, answer questions and
            add links — no account, no email chains. DocFetch reminds them until
            everything is in, and files land organized in your Google Drive.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#start"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-ink-foreground shadow-float transition-transform hover:-translate-y-px sm:w-auto"
            >
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#walkthrough"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-soft transition-colors hover:bg-secondary sm:w-auto"
            >
              <Play className="h-3.5 w-3.5" />
              See a 2-minute walkthrough
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            14 days free · No credit card · Your first request live in 5 minutes
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-5xl animate-rise [animation-delay:120ms]">
          <BrowserFrame url="app.docfetch.com/requests/northside-dental">
            <HeroMock />
          </BrowserFrame>

          <div className="pointer-events-none absolute -left-10 top-44 hidden rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-card lg:block">
            <p className="font-semibold text-foreground">Reminder sent</p>
            <p className="text-muted-foreground">Automatically, every 3 days</p>
          </div>
          <div className="pointer-events-none absolute -right-6 bottom-16 hidden rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-card lg:block">
            <p className="flex items-center gap-1.5 font-semibold text-foreground">
              <FolderCheck className="h-3.5 w-3.5 text-success" />
              Saved to Google Drive
            </p>
            <p className="text-muted-foreground">
              /Clients/Northside Dental/Brand
            </p>
          </div>
        </div>

        <TrustBar />
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div className="grid gap-0 sm:grid-cols-[210px_1fr]">
      <aside className="hidden border-r border-border bg-surface p-4 sm:block">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          {["Dashboard", "Requests", "Templates", "Clients", "Settings"].map(
            (item, i) => (
              <li
                key={item}
                className={`rounded-lg px-2.5 py-1.5 ${
                  i === 1
                    ? "bg-card font-medium text-foreground shadow-soft"
                    : "text-muted-foreground"
                }`}
              >
                {item}
              </li>
            ),
          )}
        </ul>
        <div className="mt-6 rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-medium text-foreground">This week</p>
          <p className="mt-1 text-2xl font-bold text-foreground">18</p>
          <p className="text-[11px] text-muted-foreground">
            requests completed
          </p>
        </div>
      </aside>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Website Design Intake
            </p>
            <h3 className="text-lg font-semibold text-foreground">
              Northside Dental
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <Link2 className="h-3 w-3" />
            docfetch.link/nd-2024
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>3 of 5 complete</span>
            <span className="font-medium text-foreground">60%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[60%] rounded-full bg-ink" />
          </div>
        </div>

        <ul className="mt-5 space-y-2">
          {checklist.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-3 shadow-soft"
            >
              <span className="flex min-w-0 items-center gap-3">
                {item.state === "done" ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                ) : (
                  <CircleDashed
                    className={`h-5 w-5 shrink-0 ${
                      item.state === "pending"
                        ? "text-warn"
                        : "text-muted-foreground"
                    }`}
                  />
                )}
                <span className="truncate text-sm text-foreground">
                  {item.label}
                </span>
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {item.meta}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TrustBar() {
  const stats = [
    { value: "412,000+", label: "items collected" },
    { value: "6.4 hrs", label: "saved per person each week" },
    { value: "1.8 days", label: "average completion time" },
    { value: "94%", label: "requests completed without a chase email" },
  ];
  return (
    <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card p-5 text-center">
          <p className="font-display text-2xl font-bold text-foreground">
            {s.value}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
