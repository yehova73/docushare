"use client";

import { Edit2, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import * as React from "react";

import { getRemindersAction } from "@/actions/reminders/get-reminders";
import { getBatchRemindersAction } from "@/actions/reminders/get-batch-reminders";
import { cloneGlobalRemindersToBatchAction } from "@/actions/reminders/clone-global-reminders-to-batch";
import { deleteBatchReminderAction } from "@/actions/reminders/delete-batch-reminder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { Reminder } from "@/lib/generated/prisma/browser";
import {
  formatReminderSchedule,
  getReminderBadgeColors,
  sortReminders,
} from "@/app/(dashboard)/app/reminders/_components/utils";
import { useAddReminderSheet } from "../add-reminder-sheet/use-add-reminder-sheet";
import { requireConfirmation } from "../confirmation-modal/use-confirmation";
import { capitalize, cn } from "@/lib/utils";

export function RemindersAccordion({
  open,
  batchId,
  readOnly = false,
}: {
  open: boolean;
  batchId?: string;
  readOnly?: boolean;
}) {
  const { openDialog: openAddReminder } = useAddReminderSheet();
  const { loading: loadingGlobal } = useServerAction(getRemindersAction);
  const { loading: loadingBatch } = useServerAction(getBatchRemindersAction);
  const { call: cloneReminders, loading: cloning } = useServerAction(
    cloneGlobalRemindersToBatchAction,
  );
  const { call: deleteBatchReminder, loading: deleting } = useServerAction(
    deleteBatchReminderAction,
  );

  const [reminders, setReminders] = React.useState<Reminder[]>([]);
  const [isCloned, setIsCloned] = React.useState(false);
  const [viewingReminder, setViewingReminder] = React.useState<Reminder | null>(
    null,
  );

  const loading = batchId ? loadingBatch : loadingGlobal;

  const loadReminders = React.useCallback(async () => {
    if (batchId) {
      const res = await getBatchRemindersAction(batchId);
      if (res?.status === "ok" && res.data) {
        setReminders(res.data.reminders);
        setIsCloned(res.data.isCloned);
      }
    } else {
      const res = await getRemindersAction();
      if (res?.status === "ok" && res.data) setReminders(res.data);
    }
  }, [batchId]);

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    if (batchId) {
      getBatchRemindersAction(batchId).then((res) => {
        if (cancelled) return;
        if (res?.status === "ok" && res.data) {
          setReminders(res.data.reminders);
          setIsCloned(res.data.isCloned);
        }
      });
    } else {
      getRemindersAction().then((res) => {
        if (cancelled) return;
        if (res?.status === "ok" && res.data) setReminders(res.data);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [open, batchId]);

  const refresh = React.useCallback(async () => {
    await loadReminders();
  }, [loadReminders]);

  const ensureCloned = React.useCallback(async (): Promise<boolean> => {
    if (!batchId) return false;
    if (isCloned) return true;

    const confirmation = requireConfirmation({
      title: "Customize reminders for this batch?",
      subtitle:
        "Your global reminders will be cloned for this assignation only. Any changes you make here will NOT affect your global reminders.",
      buttons: {
        isSuccess: true,
        confirm: "Clone & edit",
        cancel: "Cancel",
      },
    });
    const confirmed = await confirmation.promise;
    if (!confirmed) return false;

    const res = await cloneReminders(batchId);
    if (res?.reminders) {
      setReminders(res.reminders);
      setIsCloned(true);
      return true;
    }
    return false;
  }, [batchId, isCloned, cloneReminders]);

  const handleAddReminder = async () => {
    const ready = await ensureCloned();
    if (!ready) return;
    openAddReminder({
      batchId,
      cb: () => refresh(),
    });
  };

  const handleEditReminder = async (reminder: Reminder) => {
    if (!batchId) return;

    // If not yet cloned, clone first
    if (!isCloned) {
      const confirmation = requireConfirmation({
        title: "Customize reminders for this batch?",
        subtitle:
          "Your global reminders will be cloned for this assignation only. Any changes you make here will NOT affect your global reminders.",
        buttons: {
          isSuccess: true,
          confirm: "Clone & edit",
          cancel: "Cancel",
        },
      });
      const confirmed = await confirmation.promise;
      if (!confirmed) return;

      const res = await cloneReminders(batchId);
      if (!res?.reminders) return;

      // Find the matching cloned reminder by title and type using the fresh response
      const reminderToEdit =
        res.reminders.find(
          (r) =>
            r.title === reminder.title &&
            r.reminderType === reminder.reminderType,
        ) || reminder;

      setReminders(res.reminders);
      setIsCloned(true);

      openAddReminder({
        batchId,
        editReminder: reminderToEdit,
        cb: () => refresh(),
      });
    } else {
      // Already cloned, find in current reminders
      const reminderToEdit =
        reminders.find(
          (r) =>
            r.title === reminder.title &&
            r.reminderType === reminder.reminderType,
        ) || reminder;

      openAddReminder({
        batchId,
        editReminder: reminderToEdit,
        cb: () => refresh(),
      });
    }
  };

  const handleDeleteReminder = async (reminder: Reminder) => {
    if (!batchId) return;

    // Ensure we're working with cloned reminders
    const ready = await ensureCloned();
    if (!ready) return;

    // Find the actual reminder to delete (might be the cloned version)
    const reminderToDelete =
      reminders.find(
        (r) =>
          r.title === reminder.title &&
          r.reminderType === reminder.reminderType,
      ) || reminder;

    const confirmation = requireConfirmation({
      title: "Delete reminder?",
      subtitle:
        "This will remove the reminder from this batch. Your global reminders are not affected.",
      buttons: {
        isSuccess: false,
        confirm: "Delete",
        cancel: "Cancel",
      },
    });
    const confirmed = await confirmation.promise;
    if (!confirmed) return;
    const res = await deleteBatchReminder(batchId, reminderToDelete.id);
    if (res?.id) {
      setReminders((prev) => prev.filter((r) => r.id !== reminderToDelete.id));
    }
  };

  const showBatchEditControls = Boolean(batchId) && !readOnly;

  return (
    <div>
      <div className="flex items-center gap-2 w-full justify-between">
        <Label className="cursor-pointer">Set Reminders </Label>
        {!readOnly && (
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              handleAddReminder();
            }}
            disabled={cloning}
          >
            {cloning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Add Reminder
          </Button>
        )}
      </div>

      {showBatchEditControls && !isCloned && reminders.length > 0 && (
        <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Showing your global reminders. Editing them will create a copy just
          for this assignation — your global reminders will not be changed.
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground">
          Loading reminders...
        </div>
      ) : reminders.length > 0 ? (
        <div className="flex flex-col gap-2">
          {sortReminders(reminders).map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-sm">{reminder.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {formatReminderSchedule(reminder)}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge
                  className={cn(getReminderBadgeColors(reminder.reminderType))}
                >
                  {capitalize(reminder.reminderType.toLowerCase()).replaceAll(
                    "_",
                    " ",
                  )}
                </Badge>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  aria-label="View reminder"
                  onClick={() => setViewingReminder(reminder)}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
                {showBatchEditControls && (
                  <>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Edit reminder"
                      onClick={() => handleEditReminder(reminder)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      aria-label="Delete reminder"
                      disabled={deleting}
                      onClick={() => handleDeleteReminder(reminder)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No reminders available.
        </div>
      )}

      {/* View reminder details modal */}
      <Dialog
        open={Boolean(viewingReminder)}
        onOpenChange={(val) => !val && setViewingReminder(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{viewingReminder?.title}</DialogTitle>
            <DialogDescription>
              {viewingReminder && formatReminderSchedule(viewingReminder)}
            </DialogDescription>
          </DialogHeader>
          {viewingReminder && (
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <div className="mb-1 font-medium text-muted-foreground">
                  Type
                </div>
                <Badge
                  className={cn(
                    getReminderBadgeColors(viewingReminder.reminderType),
                  )}
                >
                  {capitalize(
                    viewingReminder.reminderType.toLowerCase(),
                  ).replaceAll("_", " ")}
                </Badge>
              </div>
              <div>
                <div className="mb-1 font-medium text-muted-foreground">
                  Subject
                </div>
                <div className="rounded-md border border-border bg-muted/50 px-2 py-1.5">
                  {viewingReminder.subject}
                </div>
              </div>
              <div>
                <div className="mb-1 font-medium text-muted-foreground">
                  Content
                </div>
                <div className="rounded-md border border-border bg-muted/50 px-2 py-1.5 whitespace-pre-wrap">
                  {viewingReminder.content}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
