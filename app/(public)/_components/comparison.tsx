import { Check, Minus, X } from "lucide-react";
import { Section, SectionHeading } from "./primitives";

type Cell = "yes" | "no" | "partial";

const columns = [
  "DocFetch",
  "Email",
  "Google Drive",
  "Google Forms",
  "Content Snare",
];

const rows: { label: string; cells: Cell[] }[] = [
  { label: "Automatic reminders", cells: ["yes", "no", "no", "no", "yes"] },
  {
    label: "Reusable templates",
    cells: ["yes", "partial", "no", "partial", "yes"],
  },
  { label: "Progress tracking", cells: ["yes", "no", "no", "no", "yes"] },
  { label: "No client login", cells: ["yes", "yes", "no", "yes", "yes"] },
  {
    label: "Files, text, images and links together",
    cells: ["yes", "partial", "no", "partial", "yes"],
  },
  {
    label: "Files organized in your own Google Drive",
    cells: ["yes", "no", "partial", "no", "partial"],
  },
  {
    label: "Completion dashboard across clients",
    cells: ["yes", "no", "no", "no", "yes"],
  },
  {
    label: "Set up in under 10 minutes",
    cells: ["yes", "yes", "yes", "yes", "partial"],
  },
];

export function Comparison() {
  return (
    <Section id="comparison" className="border-y border-border bg-surface">
      <SectionHeading
        eyebrow="Comparison"
        title="Why not just keep doing it the way you do now?"
        description="A fair look at the alternatives. Email and Drive are fine at what they do — neither of them asks your client twice."
      />

      <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <caption className="sr-only">
            DocFetch compared to email, Google Drive, Google Forms and Content
            Snare
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="w-64 px-5 py-4 text-left font-medium text-muted-foreground"
              >
                Capability
              </th>
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={`px-4 py-4 text-center font-semibold ${
                    i === 0
                      ? "bg-ink text-ink-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.label} className={ri % 2 ? "bg-surface" : ""}>
                <th
                  scope="row"
                  className="px-5 py-3.5 text-left font-normal text-foreground"
                >
                  {r.label}
                </th>
                {r.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-3.5 text-center ${ci === 0 ? "bg-ink/[0.04]" : ""}`}
                  >
                    <CellIcon value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function CellIcon({ value }: { value: Cell }) {
  if (value === "yes")
    return (
      <span className="sr-only-wrapper inline-flex">
        <Check
          className="mx-auto h-4 w-4 text-success"
          strokeWidth={2.8}
          aria-hidden
        />
        <span className="sr-only">Yes</span>
      </span>
    );
  if (value === "partial")
    return (
      <span className="inline-flex">
        <Minus
          className="mx-auto h-4 w-4 text-warn"
          strokeWidth={2.8}
          aria-hidden
        />
        <span className="sr-only">Partial</span>
      </span>
    );
  return (
    <span className="inline-flex">
      <X
        className="mx-auto h-4 w-4 text-muted-foreground/50"
        strokeWidth={2.4}
        aria-hidden
      />
      <span className="sr-only">No</span>
    </span>
  );
}
