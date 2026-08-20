"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveStatus } from "./SaveStatus";
import { useEditTemplate } from "./context/edit-template-context";
import { useNewTemplateSheet } from "@/components/modals/new-template-sheet/use-new-template-sheet";

export function TemplateHeaderActions({ batchId }: { batchId?: string }) {
  const { saveTemplate, template, setTemplate } = useEditTemplate();
  const { openDialog } = useNewTemplateSheet();
  const router = useRouter();

  const handleBackToBatch = () => {
    router.push(`/app/new-assignation?draftId=${batchId}`);
  };

  return (
    <div className="flex gap-3 items-center">
      <SaveStatus />
      <div className="flex gap-2">
        {batchId && (
          <Button variant="secondary" onClick={handleBackToBatch}>
            <ArrowLeft />
            Back to batch
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() =>
            openDialog({
              editTemplate: {
                category: template.category || "",
                description: template.description || "",
                id: template.id,
                name: template.name,
              },
              cb: (updatedTemplate) =>
                setTemplate({
                  ...template,
                  category: updatedTemplate.category,
                  name: updatedTemplate.name,
                  description: updatedTemplate.description,
                }),
            })
          }
        >
          <Edit2 />
          Edit details
        </Button>
        <Button onClick={saveTemplate}>
          <Save /> Save Template
        </Button>
      </div>
    </div>
  );
}
