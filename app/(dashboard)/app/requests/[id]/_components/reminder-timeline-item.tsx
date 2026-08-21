"use client";

import { formatReminderSchedule } from "@/app/(dashboard)/app/reminders/_components/utils";
import { useAddReminderSheet } from "@/components/modals/add-reminder-sheet/use-add-reminder-sheet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reminder } from "@/lib/generated/prisma/browser";
import { capitalize, cn } from "@/lib/utils";
import { CalendarClock, Edit2, Eye, Send } from "lucide-react";
import { useState } from "react";

const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/**
 * Interactive reminder item for the request detail timeline. Shows only the
 * title, type badge and send schedule. A "View" button opens a dialog with the
 * subject, content and (scheduled) date; an "Edit" button is shown only for
 * reminders that have not been sent yet.
 */
export const ReminderTimelineItem = ({
  reminder,
  triggerDate,
  isSent,
}: {
  reminder: Reminder;
  triggerDate: Date | null;
  isSent: boolean;
}) => {
  const [currentReminder, setCurrentReminder] = useState(reminder);
  const [viewOpen, setViewOpen] = useState(false);
  const { openDialog } = useAddReminderSheet();

  const typeLabel = capitalize(
    currentReminder.reminderType.toLowerCase(),
  ).replaceAll("_", " ");

  const handleEdit = () => {
    openDialog({
      editReminder: currentReminder,
      cb: (updated) => setCurrentReminder(updated),
    });
  };

  return (
    <div className="relative">
      <Card
        className={cn(
          "border p-2 pt-1",
          //   getReminderBorderColors(currentReminder.reminderType),
        )}
      >
        <CardHeader className="gap-0 space-y-0 px-0">
          <CardTitle className="text-sm flex items-center gap-2">
            {currentReminder.title}
            {/* <Badge
              className={cn(
                getReminderBadgeColors(currentReminder.reminderType),
                "shrink-0 ml-auto",
              )}
            >
              {typeLabel}
            </Badge> */}
            <div className="flex items-center ml-auto">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setViewOpen(true)}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              {!isSent && (
                <Button variant="ghost" size="icon-xs" onClick={handleEdit}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground line-clamp-1">
            {isSent
              ? `Sent on ${formatDate(triggerDate!)}`
              : formatReminderSchedule(currentReminder)}
          </CardDescription>
        </CardHeader>
      </Card>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="!max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentReminder.title}</DialogTitle>
            <DialogDescription>
              {typeLabel} · {formatReminderSchedule(currentReminder)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-muted-foreground">
                Subject
              </div>
              <div className="rounded-md border border-muted-foreground/10 bg-muted-foreground/5 px-3 py-2">
                {currentReminder.subject}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-muted-foreground">
                Content
              </div>
              <div className="whitespace-pre-wrap rounded-md border border-muted-foreground/10 bg-muted-foreground/5 px-3 py-2">
                {currentReminder.content}
              </div>
            </div>
            {triggerDate && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {isSent ? (
                  <Send className="h-4 w-4" />
                ) : (
                  <CalendarClock className="h-4 w-4" />
                )}
                {isSent ? "Sent on" : "Scheduled for"} {formatDate(triggerDate)}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
