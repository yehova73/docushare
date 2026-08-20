import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "./primitives";

const templates = [
  { name: "Website Design", items: 14, for: "Web & design agencies" },
  { name: "SEO Onboarding", items: 11, for: "Marketing agencies" },
  { name: "Tax Preparation", items: 18, for: "Accountants & tax preparers" },
  { name: "Bookkeeping Setup", items: 9, for: "Bookkeepers" },
  { name: "Mortgage Application", items: 16, for: "Mortgage brokers" },
  { name: "Employee Onboarding", items: 12, for: "HR consultants" },
  { name: "Consulting Kickoff", items: 8, for: "Independent consultants" },
  { name: "Blank checklist", items: 0, for: "Start from scratch" },
];

export function Templates() {
  return (
    <Section id="templates">
      <SectionHeading
        eyebrow="Template library"
        title="Start from a checklist someone in your field already built"
        description="Duplicate any template, rename the items, delete what you do not need. It becomes yours — DocFetch never forces a workflow on you."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((t) => (
          <article
            key={t.name}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {t.name}
                </h3>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.for}</p>
            </div>
            <div className="mt-6 space-y-1.5" aria-hidden>
              {[0, 1, 2].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border border-border" />
                  <span
                    className="h-1.5 rounded-full bg-secondary"
                    style={{ width: `${70 - n * 14}%` }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
              {t.items > 0
                ? `${t.items} items · fully editable`
                : "Build it your way"}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Empty workspace? Your dashboard starts with these templates loaded, so
        your first request goes out before you finish your coffee.
      </p>
    </Section>
  );
}
