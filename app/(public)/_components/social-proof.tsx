import { Quote } from "lucide-react";

const logos = [
  "NORTHPEAK",
  "Bramble & Co.",
  "LEDGERWORKS",
  "Studio Fold",
  "Hallman Tax",
  "Verano",
];

export function SocialProof() {
  return (
    <section className="border-y border-border bg-surface px-5 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Used by agencies, accountants and consultants who bill by the hour
        </p>
        <div className="mt-8 grid grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((name) => (
            <span
              key={name}
              className="font-display text-sm font-semibold tracking-wide text-muted-foreground/70"
            >
              {name}
            </span>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <Quote className="h-5 w-5 text-brand" />
          <p className="mt-3 text-lg leading-relaxed text-foreground sm:text-xl">
            "We used to spend the first two weeks of every project asking for a
            logo. Now the checklist link goes out with the proposal and the work
            actually starts on day one."
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Dana Reyes · Operations Lead, Northpeak Digital (14-person agency)
          </p>
        </div>
      </div>
    </section>
  );
}
