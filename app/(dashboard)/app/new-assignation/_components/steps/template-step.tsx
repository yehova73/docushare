"use client";

import { Loader2, Pencil } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";

import { cloneTemplateToBatchAction } from "@/actions/assign-template/drafts/clone-template-to-batch";
import { SelectedTemplatePreview } from "@/components/modals/assign-workflow-to-client-sheet/selected-template-preview";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useServerAction from "@/hooks/use-server-action";

import { useNewAssignationContext } from "../new-assignation-context";

export function TemplateStep() {
  const router = useRouter();
  const {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    loading,
    draftId,
    ensureDraft,
  } = useNewAssignationContext();
  const { call: cloneTemplate, loading: cloning } = useServerAction(
    cloneTemplateToBatchAction,
  );

  const [clonedTemplateId, setClonedTemplateId] = React.useState<string | null>(
    null,
  );

  const handleEditTemplate = async () => {
    if (!selectedTemplateId) return;

    // Make sure we have a draft to bind the cloned template to.
    const batchId = draftId ?? (await ensureDraft());
    if (!batchId) return;

    // If the selected template is already the batch's copy, don't clone it
    // again — just open it in the editor.
    if (clonedTemplateId && clonedTemplateId === selectedTemplateId) {
      router.push(`/app/templates/${clonedTemplateId}?batchId=${batchId}`);
      return;
    }

    const res = await cloneTemplate({
      templateId: selectedTemplateId,
      batchId,
    });
    if (res?.templateId) {
      setClonedTemplateId(res.templateId);
      router.push(`/app/templates/${res.templateId}?batchId=${batchId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading templates...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-2">
        <Label>Select template</Label>
        {templates.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed py-8 text-sm text-muted-foreground">
            No templates available.
          </div>
        ) : (
          <div className="border-l border-primary/50 pl-3">
            <div className="flex items-center gap-2">
              <Select
                value={selectedTemplateId ?? undefined}
                onValueChange={(value) => setSelectedTemplateId(value)}
              >
                <SelectTrigger className="w-full" size="sm">
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate">{template.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {template.totalFields} fields ·{" "}
                          {template.requiredFields} required
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplateId && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleEditTemplate}
                  disabled={cloning}
                >
                  {cloning ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Pencil className="h-3.5 w-3.5" />
                  )}
                  Edit template
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Show the template steps similar to the sheet when selected */}
      {selectedTemplateId && (
        <SelectedTemplatePreview
          selectedTemplateId={selectedTemplateId}
          defaultOpen
        />
      )}
    </div>
  );
}
