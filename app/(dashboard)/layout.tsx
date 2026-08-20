import { getPotentialUserFromSession } from "@/actions/account/account";
import { AddClientSheet } from "@/components/modals/add-client-sheet/add-client-sheet";
import { AddReminderSheet } from "@/components/modals/add-reminder-sheet/add-reminder-sheet";
import { AssignWorkflowToClientSheet } from "@/components/modals/assign-workflow-to-client-sheet/assign-workflow-to-client-sheet";
import { ConfirmationModal } from "@/components/modals/confirmation-modal/confirmation-modal";
import { NewTemplateSheet } from "@/components/modals/new-template-sheet/new-template-sheet";
import { redirect } from "next/navigation";
import type React from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getPotentialUserFromSession();
  if (!user) {
    return redirect("/?action=login");
  }

  return (
    <>
      {children}
      <AssignWorkflowToClientSheet />
      <AddReminderSheet />
      <AddClientSheet />
      <NewTemplateSheet />
      <ConfirmationModal />
    </>
  );
}
