"use client";

import {
  getRequestFieldCompletionAction,
  RequestFieldCompletionData,
} from "@/actions/assign-template/get-request-field-completion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, Circle, Loader2 } from "lucide-react";
import { useState } from "react";

interface RequestProgressCellProps {
  assignationId: string;
  completedFields: number;
  totalFields: number;
}

export const RequestProgressCell = ({
  assignationId,
  completedFields,
  totalFields,
}: RequestProgressCellProps) => {
  const [data, setData] = useState<RequestFieldCompletionData | null>(null);
  const [loading, setLoading] = useState(false);

  const pct =
    totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  const handleOpenChange = async (open: boolean) => {
    if (open && !data && !loading) {
      setLoading(true);
      try {
        const res = await getRequestFieldCompletionAction(assignationId);
        if (res.status === "ok" && res.data) {
          setData(res.data);
        }
      } catch {
        // Ignore — the trigger still shows the static counts.
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <HoverCard openDelay={100} closeDelay={150} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <div className="flex w-32 cursor-default flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {completedFields} of {totalFields} fields completed
          </span>
          <Progress value={pct} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        sideOffset={8}
        className="max-h-[420px] w-80 overflow-hidden p-0"
      >
        <div className="flex flex-col overflow-hidden">
          <div className="border-b p-3">
            <div className="truncate text-sm font-medium">
              {data?.requestName}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {data ? `${data.clientName} · ${data.templateName}` : "\u00A0"}
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading fields...
            </div>
          ) : data ? (
            <>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-medium">
                  {data.completedFields} of {data.totalFields} fields completed
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-3 p-3 pt-0">
                  {data.sections.map((section) => (
                    <div key={section.id}>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {section.name}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {section.completedFields}/{section.totalFields}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {section.fields.map((field) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            {field.completed ? (
                              <Check className="size-4 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="size-4 shrink-0 text-muted-foreground/40" />
                            )}
                            <span
                              className={cn(
                                "truncate",
                                field.completed
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {field.name || "Unnamed field"}
                            </span>
                            {field.required && (
                              <span className="ml-auto text-[10px] font-medium text-destructive">
                                required
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Could not load fields.
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
