import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CalendarClock, Inbox, List, Send } from "lucide-react";
import { sortReminders } from "@/app/(dashboard)/app/reminders/_components/utils";
import {
  getReminderTriggerDate,
  partitionReminders,
  RequestTimeline,
} from "./request-reminders";
import { ReminderTimelineItem } from "./reminder-timeline-item";

const SectionEmpty = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
      <Inbox className="h-4 w-4 shrink-0" />
      {title}
    </div>
  );
};

/**
 * Renders the reminders history for a single request (assignation), split into
 * "Sent reminders" and "Future reminders" sections. Sent/future is derived from
 * each reminder's computed trigger date against the request timeline.
 */
export const RequestRemindersCard = async ({
  assignationId,
  userId,
}: {
  assignationId: string;
  userId: string;
}) => {
  const assignation = await prisma.templateClientAssignation.findFirst({
    where: { id: assignationId, template: { userId } },
    select: {
      assignedAt: true,
      submittedAt: true,
      dueDate: true,
      completedAt: true,
      reminders: true,
    },
  });

  const timeline: RequestTimeline = {
    assignedAt: assignation?.assignedAt ?? null,
    submittedAt: assignation?.submittedAt ?? null,
    dueDate: assignation?.dueDate ?? null,
    completedAt: assignation?.completedAt ?? null,
  };

  const reminders = assignation?.reminders ?? [];

  if (reminders.length === 0) {
    return (
      <Card className="h-min">
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
          <CardDescription>Reminders history for this request</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <List />
              </EmptyMedia>
              <EmptyTitle>No updates yet</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  const { sent, future } = partitionReminders(reminders, timeline);

  const sentReminders = sortReminders(sent);
  const futureReminders = sortReminders(future);

  return (
    <Card className="h-min">
      <CardHeader>
        <CardTitle>Reminders</CardTitle>
        <CardDescription>Reminders history for this request</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sent reminders */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Send className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Sent reminders</h3>
            <Badge variant="secondary" className="ml-auto">
              {sentReminders.length}
            </Badge>
          </div>
          {sentReminders.length > 0 ? (
            <div className="relative flex flex-col gap-3">
              {sentReminders.map((reminder) => (
                <ReminderTimelineItem
                  key={reminder.id}
                  reminder={reminder}
                  triggerDate={getReminderTriggerDate(reminder, timeline)}
                  isSent
                />
              ))}
            </div>
          ) : (
            <SectionEmpty title="No sent reminders yet" />
          )}
        </section>

        {/* Future reminders */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Future reminders</h3>
            <Badge variant="secondary" className="ml-auto">
              {futureReminders.length}
            </Badge>
          </div>
          {futureReminders.length > 0 ? (
            <div className="relative flex flex-col gap-3">
              {futureReminders.map((reminder) => (
                <ReminderTimelineItem
                  key={reminder.id}
                  reminder={reminder}
                  triggerDate={getReminderTriggerDate(reminder, timeline)}
                  isSent={false}
                />
              ))}
            </div>
          ) : (
            <SectionEmpty title="No upcoming reminders" />
          )}
        </section>
      </CardContent>
    </Card>
  );
};
