import { Logo } from "@/components/logo";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section id="start" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center shadow-float sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(60%_60%_at_50%_0%,oklch(0.55_0.16_255/0.55),transparent_70%)]"
        />
        <div className="relative">
          <h2 className="text-3xl font-bold leading-[1.08] text-ink-foreground sm:text-5xl">
            Send your first checklist today
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-foreground/70">
            Pick a template, send the link, and let the reminders do the rest.
          </p>
          <a
            href="#top"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-px"
          >
            Start free trial
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs text-ink-foreground/60">
            14 days free · No credit card · Live in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
}

const groups = [
  {
    title: "Product",
    links: ["Features", "Templates", "Pricing", "Google Drive", "Changelog"],
  },
  {
    title: "Use cases",
    links: [
      "Agencies",
      "Accountants",
      "Bookkeepers",
      "Consultants",
      "Mortgage brokers",
    ],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Status"],
  },
  {
    title: "Legal",
    links: [
      "Privacy policy",
      "Terms of service",
      "Data processing",
      "Security",
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 pb-24 pt-16 sm:px-8 md:pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The client intake workspace. Collect everything you need before
              work begins.
            </p>
          </div>
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {g.title}
              </p>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DocFetch. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#top" className="transition-colors hover:text-foreground">
              LinkedIn
            </a>
            <a href="#top" className="transition-colors hover:text-foreground">
              X
            </a>
            <a href="#top" className="transition-colors hover:text-foreground">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
