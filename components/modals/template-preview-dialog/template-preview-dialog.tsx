"use client";

import { SelectedTemplatePreview } from "@/components/modals/assign-workflow-to-client-sheet/selected-template-preview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTemplatePreviewDialog } from "./use-template-preview-dialog";

export const TemplatePreviewDialog: React.FC = () => {
  const { open, closeDialog, templateId } = useTemplatePreviewDialog();

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeDialog()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Template preview</DialogTitle>
          <DialogDescription>
            Preview the template structure and its fields.
          </DialogDescription>
        </DialogHeader>
        <SelectedTemplatePreview selectedTemplateId={templateId} defaultOpen />
      </DialogContent>
    </Dialog>
  );
};
