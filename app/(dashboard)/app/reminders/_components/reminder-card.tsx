"use client";

import { Reminder } from "@/lib/generated/prisma/browser";
import { capitalize, cn } from "@/lib/utils";
import {
  getReminderBackgroundColor,
  getReminderBorderColors,
  getReminderBadgeColors,
  formatReminderSchedule,
} from "./utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash } from "lucide-react";
import { useAddReminderSheet } from "@/components/modals/add-reminder-sheet/use-add-reminder-sheet";
import { deleteReminderAction } from "@/actions/reminders/delete-reminder";
import { useServerAction } from "@/hooks/use-server-action";
import { requireConfirmation } from "@/components/modals/confirmation-modal/use-confirmation";

export const ReminderCard: React.FC<{
  reminder: Reminder;
  onDelete: (id: string) => void;
  onEdit?: (reminder: Reminder) => void;
}> = ({ reminder, onDelete, onEdit }) => {
  const { openDialog } = useAddReminderSheet();
  const { call: deleteReminder, loading } =
    useServerAction(deleteReminderAction);

  const handleDelete = async (id: string) => {
    const confirmation = requireConfirmation({
      title: "Delete Reminder",
      subtitle:
        "Are you sure you want to delete this reminder? This action cannot be undone.",
    });
    const res = await confirmation.promise;
    if (!res) return;

    await deleteReminder(id);
    onDelete(id);
  };

  return (
    <div key={reminder.id} className={cn("relative")}>
      <span
        className={cn(
          "absolute top-4 -left-[19px] size-3 rounded-full ring-4 ring-background",
          getReminderBackgroundColor(reminder.reminderType),
        )}
        aria-hidden
      />
      <Card
        className={cn(
          "border ",
          getReminderBorderColors(reminder.reminderType),
        )}
      >
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="gap-1.5">
            <CardTitle className="text-sm">{reminder.title}</CardTitle>
            <CardDescription>
              {formatReminderSchedule(reminder)}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={cn(getReminderBadgeColors(reminder.reminderType))}
            >
              {capitalize(reminder.reminderType.toLowerCase()).replaceAll(
                "_",
                " ",
              )}
            </Badge>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => openDialog({ editReminder: reminder, cb: onEdit })}
            >
              <Edit2 />
            </Button>
            <Button
              size="icon-sm"
              variant="destructive"
              disabled={loading}
              onClick={() => handleDelete(reminder.id)}
            >
              <Trash />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="-mt-2">
          <div className="space-y-2">
            <div className="text-sm ">
              <div className="font-semibold text-muted-foreground">
                Subject:
              </div>
              <div className="px-2 py-1 rounded-md border border-muted-foreground/10 bg-muted-foreground/5">
                {reminder.subject}
              </div>
            </div>
            <div className="text-sm space-y-1">
              <div className="font-semibold text-muted-foreground">
                Content:
              </div>
              <div className="px-2 py-1 rounded-md border border-muted-foreground/10 bg-muted-foreground/5">
                {reminder.content}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
