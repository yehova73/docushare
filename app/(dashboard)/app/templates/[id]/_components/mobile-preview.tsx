import React from "react";
import { useEditTemplate } from "./context/edit-template-context";
import { getFieldIcon } from "./utils";

function renderField(field: any) {
  const Icon = getFieldIcon(field.type);
  const base =
    "w-full text-sm rounded-lg border bg-background px-3 py-2 disabled:opacity-100";

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          placeholder={field.label}
          className={`${base} min-h-[72px] resize-none`}
          disabled
        />
      );
    case "number":
      return (
        <input
          type="number"
          placeholder={field.label}
          className={base}
          disabled
        />
      );
    case "email":
      return (
        <input
          type="email"
          placeholder={field.label}
          className={base}
          disabled
        />
      );
    case "phone":
      return (
        <input type="tel" placeholder={field.label} className={base} disabled />
      );
    case "file":
    case "image":
      return (
        <div className="w-full flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-background py-6 text-muted-foreground">
          <Icon className="h-5 w-5" />
          <span className="text-xs">Click to upload</span>
        </div>
      );
    default:
      return (
        <input
          type="text"
          placeholder={field.label}
          className={base}
          disabled
        />
      );
  }
}
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust path if needed

export default function MobilePreview() {
  const { template } = useEditTemplate();
  const isEmpty =
    template.sections.length === 0 ||
    template.sections.every((s) => s.fields.length === 0);

  return (
    <aside className="shrink-0 h-full overflow-y-auto w-1/3 max-w-[400px] ">
      <div className="px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight">Mobile Preview</h2>
        <p className="text-xs text-muted-foreground">Live form preview</p>
      </div>

      <div className="flex justify-center w-full px-4 pb-8 ">
        {/* Phone Frame Outer Shell */}
        <div className="relative w-full h-[640px] rounded-[48px] border-4 border-secondary bg-slate-900 shadow-2xl ring-1 ring-slate-900/10 flex flex-col overflow-hidden select-none">
          {/* Hardware Details: Power Button & Volume Keys (Visual Accents) */}
          <div className="absolute -left-[13px] top-24 w-[3px] h-8 bg-slate-700 rounded-l-md" />
          <div className="absolute -left-[13px] top-36 w-[3px] h-12 bg-slate-700 rounded-l-md" />
          <div className="absolute -left-[13px] top-52 w-[3px] h-12 bg-slate-700 rounded-l-md" />
          <div className="absolute -right-[13px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-md" />

          {/* Status Bar & Dynamic Island / Notch */}
          <div className="relative z-20 bg-background pt-3 pb-2 px-6 flex items-center justify-between text-[11px] font-semibold text-foreground/80 shrink-0">
            <span>9:41</span>

            {/* Camera / Speaker Pill */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-20 h-4 bg-black rounded-full flex items-center justify-end px-2">
              <div className="w-2 h-2 rounded-full bg-slate-900/80 ring-1 ring-slate-800" />
            </div>

            {/* Status Icons Placeholder */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-4 h-2 border border-current rounded-sm relative p-[1px]">
                <div className="h-full w-full bg-current rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Screen Display Area with shadcn ScrollArea */}
          <ScrollArea className="h-[600px] bg-background text-foreground">
            <div className="p-5 space-y-5">
              <div className=" pb-2 border-b">
                <h3 className="text-base font-semibold tracking-tight">
                  {template.name || "Untitled template"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {template.description}
                </p>
              </div>

              {isEmpty && (
                <p className="text-xs text-muted-foreground text-center pt-12 pb-6">
                  Drag fields into sections to see them here.
                </p>
              )}

              {template.sections.map((section) => (
                <div key={section.id} className="space-y-3">
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.name || "Untitled section"}
                  </h4>
                  {section.fields.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      No fields yet
                    </p>
                  ) : (
                    section.fields.map((field) => (
                      <div key={field.id} className="space-y-1.5">
                        <label className="text-xs font-medium block">
                          {field.name}
                        </label>
                        {renderField(field)}
                      </div>
                    ))
                  )}
                </div>
              ))}

              {!isEmpty && (
                <button
                  className="w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium py-2.5 transition-opacity opacity-90 hover:opacity-100"
                  disabled
                >
                  Submit
                </button>
              )}
            </div>
          </ScrollArea>

          {/* Home Indicator Bar */}
          <div className="bg-background pb-2 pt-1 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-foreground/20 rounded-full" />
          </div>
        </div>
      </div>
    </aside>
  );
}
