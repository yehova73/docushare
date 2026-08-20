import {
  Check,
  CircleDashed,
  Save,
  Smartphone,
  UploadCloud,
  UserX,
} from "lucide-react";
import { PhoneFrame, Section } from "./primitives";

const points = [
  {
    icon: UserX,
    title: "No account, ever",
    body: "The link opens the checklist. No signup, no password, no app.",
  },
  {
    icon: Smartphone,
    title: "Built for a phone",
    body: "Most clients answer from their phone between meetings. It works there first.",
  },
  {
    icon: UploadCloud,
    title: "Drag, drop, done",
    body: "Any file type, any size, straight from desktop or camera roll.",
  },
  {
    icon: Save,
    title: "Saves as they go",
    body: "They can stop halfway and pick it up two days later. Nothing is lost.",
  },
];

export function ClientExperience() {
  return (
    <Section id="clients" className="border-y border-border bg-surface">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="section-eyebrow">Client experience</p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.1] text-foreground sm:text-4xl">
            Your client never learns a new tool
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The most common reason intake tools fail is that clients refuse to
            sign up for one. DocFetch asks nothing of them: one link, one page,
            a progress bar and a list.
          </p>
          <dl className="mt-8 grid gap-5 sm:grid-cols-2">
            {points.map(({ icon: Icon, ...p }) => (
              <div key={p.title}>
                <dt className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Icon className="h-4 w-4 text-brand" strokeWidth={2.2} />
                  {p.title}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <PhoneFrame>
            <div className="bg-background p-4">
              <p className="text-[11px] text-muted-foreground">
                Northpeak Digital
              </p>
              <h3 className="mt-0.5 text-sm font-semibold text-foreground">
                Your website checklist
              </h3>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>2 of 4 complete</span>
                <span className="font-medium text-foreground">50%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-1/2 rounded-full bg-ink" />
              </div>
              <ul className="mt-4 space-y-2">
                {[
                  { l: "Logo files", d: true },
                  { l: "Brand colors", d: true },
                  { l: "Team photos", d: false },
                  { l: "Current site link", d: false },
                ].map((i) => (
                  <li
                    key={i.l}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5"
                  >
                    {i.d ? (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <CircleDashed className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-[13px] text-foreground">{i.l}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-xl border border-dashed border-border bg-surface px-3 py-6 text-center text-[11px] text-muted-foreground">
                Tap to upload from your phone
              </div>
              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Progress saved automatically
              </p>
            </div>
          </PhoneFrame>
        </div>
      </div>
    </Section>
  );
}
