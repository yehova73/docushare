"use client";

import { RemindersAccordion } from "@/components/modals/assign-workflow-to-client-sheet/reminders-accordion";
import { Label } from "@/components/ui/label";

import { useNewAssignationContext } from "../new-assignation-context";

export function RemindersStep() {
  const { draftId } = useNewAssignationContext();

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label>Reminders</Label>
        <div className="border-l border-primary/50 pl-3">
          <RemindersAccordion open batchId={draftId ?? undefined} />
        </div>
      </div>
    </div>
  );
}
