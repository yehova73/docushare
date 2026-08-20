"use client";

import { useState } from "react";
import { Check, CircleDashed, FolderTree, Plus } from "lucide-react";
import { BrowserFrame, Section, SectionHeading } from "./primitives";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    callout: "See every open request and exactly what is blocking it.",
  },
  {
    id: "builder",
    label: "Template builder",
    callout: "Drag items into order. Mark what is required. Save and reuse.",
  },
  {
    id: "portal",
    label: "Client portal",
    callout:
      "What your client sees: a checklist, no account, no instructions needed.",
  },
  {
    id: "drive",
    label: "Google Drive",
    callout: "Uploads filed into your folder structure the moment they arrive.",
  },
] as const;

export function Walkthrough() {
  const [active, setActive] =
    useState<(typeof tabs)[number]["id"]>("dashboard");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <Section id="walkthrough" className="border-y border-border bg-surface">
      <SectionHeading
        eyebrow="Walkthrough"
        title="A quick look at the whole product"
        description="Four screens. That is the entire tool — nothing else to learn."
      />

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            aria-pressed={active === t.id}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
              active === t.id
                ? "border-ink bg-ink text-ink-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {current.callout}
      </p>

      <div className="mt-6">
        <BrowserFrame url={`app.docfetch.com/${active}`}>
          {active === "dashboard" ? <DashboardMock /> : null}
          {active === "builder" ? <BuilderMock /> : null}
          {active === "portal" ? <PortalMock /> : null}
          {active === "drive" ? <DriveMock /> : null}
        </BrowserFrame>
      </div>
    </Section>
  );
}

const rows = [
  {
    client: "Northside Dental",
    template: "Website Design",
    progress: 60,
    status: "Reminder sent",
  },
  {
    client: "Hallman & Co.",
    template: "Tax Preparation",
    progress: 100,
    status: "Complete",
  },
  {
    client: "Verano Studio",
    template: "SEO Onboarding",
    progress: 25,
    status: "Waiting 6 days",
  },
  {
    client: "Bramble Retail",
    template: "Bookkeeping",
    progress: 83,
    status: "1 item left",
  },
];

function DashboardMock() {
  return (
    <div className="p-5 sm:p-7">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Open requests", value: "12" },
          { label: "Waiting on clients", value: "5" },
          { label: "Completed this month", value: "37" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              {s.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-border">
        {rows.map((r, i) => (
          <div
            key={r.client}
            className={`grid grid-cols-[1.4fr_1fr] items-center gap-3 px-4 py-3.5 sm:grid-cols-[1.4fr_1fr_1fr_0.9fr] ${
              i % 2 ? "bg-surface" : "bg-card"
            }`}
          >
            <span className="text-sm font-medium text-foreground">
              {r.client}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {r.template}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-full max-w-24 overflow-hidden rounded-full bg-secondary">
                <span
                  className="block h-full rounded-full bg-ink"
                  style={{ width: `${r.progress}%` }}
                />
              </span>
              <span className="text-[11px] text-muted-foreground">
                {r.progress}%
              </span>
            </span>
            <span className="hidden text-right text-[11px] text-muted-foreground sm:block">
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuilderMock() {
  const items = [
    { label: "Logo files", type: "File upload", required: true },
    { label: "Brand colors", type: "Short text", required: true },
    { label: "Team photos", type: "Image upload", required: false },
    { label: "Social profiles", type: "Links", required: false },
    { label: "Who is your ideal customer?", type: "Long text", required: true },
  ];
  return (
    <div className="grid gap-0 md:grid-cols-[1fr_240px]">
      <div className="p-5 sm:p-7">
        <p className="text-xs text-muted-foreground">Template</p>
        <h3 className="text-lg font-semibold text-foreground">
          Website Design Intake
        </h3>
        <div className="mt-4 space-y-2">
          {items.map((it) => (
            <div
              key={it.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <span className="flex items-center gap-3">
                <span className="flex flex-col gap-[3px]" aria-hidden>
                  <span className="h-[3px] w-4 rounded bg-border" />
                  <span className="h-[3px] w-4 rounded bg-border" />
                  <span className="h-[3px] w-4 rounded bg-border" />
                </span>
                <span className="text-sm text-foreground">{it.label}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">
                  {it.type}
                </span>
                {it.required ? (
                  <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-foreground">
                    Required
                  </span>
                ) : null}
              </span>
            </div>
          ))}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Add item
          </button>
        </div>
      </div>
      <aside className="border-t border-border bg-surface p-5 md:border-l md:border-t-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Reminders
        </p>
        <p className="mt-3 text-sm text-foreground">Every 3 days</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Stops automatically when complete.
        </p>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Save uploads to
        </p>
        <p className="mt-3 flex items-center gap-2 text-sm text-foreground">
          <FolderTree className="h-4 w-4 text-brand" /> /Clients/{"{client}"}
          /Intake
        </p>
      </aside>
    </div>
  );
}

function PortalMock() {
  return (
    <div className="mx-auto max-w-2xl p-5 sm:p-8">
      <p className="text-xs text-muted-foreground">
        Requested by Northpeak Digital
      </p>
      <h3 className="mt-1 text-xl font-semibold text-foreground">
        A few things before we start your site
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Takes about 10 minutes. Your progress saves automatically — you can
        close this and come back.
      </p>
      <div className="mt-5 space-y-2">
        {[
          { label: "Upload your logo", done: true },
          { label: "Brand colors", done: true },
          { label: "Drop your team photos here", done: false },
          { label: "Link to your current site", done: false },
        ].map((i) => (
          <div
            key={i.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5"
          >
            {i.done ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            ) : (
              <CircleDashed className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-sm text-foreground">{i.label}</span>
          </div>
        ))}
        <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted-foreground">
          Drag files here, or tap to choose
        </div>
      </div>
    </div>
  );
}

function DriveMock() {
  const tree = [
    { name: "Clients", depth: 0 },
    { name: "Northside Dental", depth: 1 },
    { name: "Intake", depth: 2 },
    { name: "logo-primary.svg", depth: 3, file: true },
    { name: "logo-mark.png", depth: 3, file: true },
    { name: "team-photos", depth: 3 },
    { name: "brand-answers.pdf", depth: 3, file: true },
    { name: "Hallman & Co.", depth: 1 },
  ];
  return (
    <div className="p-5 sm:p-7">
      <p className="text-xs text-muted-foreground">
        Your Google Drive · connected
      </p>
      <div className="mt-3 rounded-xl border border-border bg-surface p-4">
        {tree.map((n) => (
          <div
            key={n.name + n.depth}
            className="flex items-center gap-2 py-1.5 text-sm text-foreground"
            style={{ paddingLeft: `${n.depth * 18}px` }}
          >
            {n.file ? (
              <span className="h-3.5 w-3 rounded-[3px] border border-border bg-card" />
            ) : (
              <FolderTree className="h-3.5 w-3.5 text-brand" />
            )}
            <span className={n.file ? "text-muted-foreground" : ""}>
              {n.name}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Nothing to export, nothing to download. Files appear where you already
        work.
      </p>
    </div>
  );
}
