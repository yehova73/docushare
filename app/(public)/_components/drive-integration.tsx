import { ArrowRight, FileCheck2, FolderTree, UploadCloud } from "lucide-react";
import { Section, SectionHeading } from "./primitives";

export function DriveIntegration() {
  return (
    <Section id="drive">
      <SectionHeading
        eyebrow="Google Drive"
        title="Already using Drive? Keep using Drive."
        description="DocFetch is not storage and does not want to be. It is the layer that gets material out of your clients and into the folders you already have."
      />

      <div className="mt-12 grid items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-10 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Step
          icon={UploadCloud}
          title="Client uploads"
          body="From a phone or a laptop, into the checklist."
        />
        <Arrow />
        <Step
          icon={FileCheck2}
          title="DocFetch checks it"
          body="Named, tagged to the right client and item, marked complete."
        />
        <Arrow />
        <Step
          icon={FolderTree}
          title="Your Google Drive"
          body="Filed into your own folder structure, instantly."
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "No exporting",
            b: "Nothing to download and re-upload at the end.",
          },
          {
            t: "No manual filing",
            b: "Folder rules run per template, per client.",
          },
          {
            t: "Your Drive, your rules",
            b: "Permissions, sharing and retention stay yours.",
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <p className="text-sm font-semibold text-foreground">{c.t}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.b}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Step({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof UploadCloud;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 text-center">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-ink-foreground">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center py-1 md:py-0">
      <ArrowRight className="h-5 w-5 rotate-90 text-muted-foreground md:rotate-0" />
    </div>
  );
}
