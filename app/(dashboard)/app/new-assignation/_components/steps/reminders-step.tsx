"use client";

import { RemindersAccordion } from "@/components/modals/assign-workflow-to-client-sheet/reminders-accordion";

import { useNewAssignationContext } from "../new-assignation-context";

export function RemindersStep() {
  const { draftId } = useNewAssignationContext();

  return <RemindersAccordion open batchId={draftId ?? undefined} />;
}
