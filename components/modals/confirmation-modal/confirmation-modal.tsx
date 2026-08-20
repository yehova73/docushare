"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCofirmationModal } from "./use-confirmation";
import { Button } from "@/components/ui/button";

export const ConfirmationModal: React.FC = () => {
  const { currentConfirmation } = useCofirmationModal();
  return (
    <Dialog
      open={!!currentConfirmation}
      onOpenChange={(val) =>
        !val &&
        currentConfirmation?.closeCb &&
        currentConfirmation?.closeCb(null)
      }
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{currentConfirmation?.title}</DialogTitle>
          {currentConfirmation?.subtitle && (
            <DialogDescription>
              {currentConfirmation?.subtitle}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-2">
          <Button
            variant={"outline"}
            onClick={() =>
              currentConfirmation?.closeCb &&
              currentConfirmation?.closeCb(false)
            }
            size={"sm"}
          >
            {currentConfirmation?.buttons?.cancel || "Cancel"}
          </Button>
          <Button
            variant={
              currentConfirmation?.buttons?.confirm === "Update" ||
              currentConfirmation?.buttons?.isSuccess
                ? "default"
                : "destructive"
            }
            size={"sm"}
            onClick={() =>
              currentConfirmation?.closeCb && currentConfirmation?.closeCb(true)
            }
          >
            {currentConfirmation?.buttons?.confirm || "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
