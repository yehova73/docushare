import { Check } from "lucide-react";
import { Section, SectionHeading } from "./primitives";

const plans = [
  {
    name: "Starter",
    price: "$19",
    cadence: "per month",
    tag: "Best for solo businesses",
    summary: "For freelancers, bookkeepers and one-person consultancies.",
    features: [
      "Up to 15 active requests",
      "Unlimited templates",
      "Automatic reminders",
      "Google Drive organization",
      "No-login client links",
      "Progress tracking",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$49",
    cadence: "per month",
    tag: "For teams",
    summary: "For agencies and firms running client intake across a team.",
    features: [
      "Unlimited active requests",
      "5 team members included",
      "Assign requests to owners",
      "Custom branding on client pages",
      "Completion dashboard & exports",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Two plans. No setup fees, no per-client charges."
        description="Every plan includes a 14-day free trial. Cancel in one click — your files are already in your own Drive."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-2xl border p-7 ${
              p.highlight
                ? "border-ink bg-card shadow-float"
                : "border-border bg-card shadow-soft"
            }`}
          >
            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-medium ${
                p.highlight
                  ? "bg-ink text-ink-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {p.tag}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {p.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
            <p className="mt-5 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold text-foreground">
                {p.price}
              </span>
              <span className="text-sm text-muted-foreground">{p.cadence}</span>
            </p>
            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm text-foreground"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    strokeWidth={2.6}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#start"
              className={`mt-7 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-px ${
                p.highlight
                  ? "bg-ink text-ink-foreground shadow-soft"
                  : "border border-border bg-surface text-foreground"
              }`}
            >
              {p.cta}
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              14 days free · no credit card
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Clients are never charged and never counted as users.
      </p>
    </Section>
  );
}
