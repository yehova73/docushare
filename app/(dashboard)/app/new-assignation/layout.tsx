import { getAssignTemplateSheetDataAction } from "@/actions/assign-template/get-assign-template-sheet-data";
import { Suspense } from "react";

import {
  NewAssignationProvider,
  NewAssignationSearchParamsSync,
} from "./_components/new-assignation-context";

export default async function NewAssignationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await getAssignTemplateSheetDataAction();

  return (
    <NewAssignationProvider
      clients={res?.data?.clients ?? []}
      templates={res?.data?.templates ?? []}
    >
      <Suspense fallback={null}>
        <NewAssignationSearchParamsSync />
      </Suspense>
      {children}
    </NewAssignationProvider>
  );
}
