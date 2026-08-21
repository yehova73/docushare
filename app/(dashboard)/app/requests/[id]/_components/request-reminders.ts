import { Reminder } from "@/lib/generated/prisma/browser";

/**
 * The lifecycle dates of a request (TemplateClientAssignation) used to compute
 * when each reminder fires relative to the request's timeline.
 */
export interface RequestTimeline {
  assignedAt: Date | null;
  submittedAt: Date | null;
  dueDate: Date | null;
  completedAt: Date | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Mirrors `getEffectiveFirstOccurrence` from the reminders utils: the earliest
 * occurrence in days relative to the trigger event for AFTER / EVERY schedules.
 */
const firstOccurrenceDays = (
  reminder: Pick<Reminder, "scheduleType" | "afterDays" | "everyDays">,
): number => {
  if (reminder.scheduleType === "AFTER") {
    return reminder.afterDays ?? 0;
  }
  if (reminder.scheduleType === "EVERY") {
    const interval = reminder.everyDays ?? 0;
    const offset = reminder.afterDays ?? 0;
    return offset > 0 ? Math.min(interval, offset) : interval;
  }
  return 0;
};

/**
 * Computes the trigger date for a reminder relative to the request timeline.
 * Returns `null` when the triggering event has not happened yet (e.g. no due
 * date, or the assignment has not been started/completed), in which case the
 * reminder is treated as "future".
 */
export const getReminderTriggerDate = (
  reminder: Reminder,
  timeline: RequestTimeline,
): Date | null => {
  switch (reminder.reminderType) {
    // Fire the day the assignment is submitted / completed
    case "ASSIGNMENT_STARTED":
      return timeline.submittedAt;
    case "ASSIGNMENT_COMPLETED":
      return timeline.completedAt;

    // Fire the moment the assignment becomes overdue
    case "ASSIGNMENT_OVERDUE":
      return timeline.dueDate;

    // Relative to when the assignment was created
    case "ASSIGNMENT_REMINDER": {
      if (!timeline.assignedAt) return null;
      return new Date(
        timeline.assignedAt.getTime() + firstOccurrenceDays(reminder) * DAY_MS,
      );
    }

    // Relative to the due date (before for DUE_SOON, after for OVERDUE_REMINDER)
    case "ASSIGNMENT_DUE_SOON":
    case "ASSIGNMENT_OVERDUE_REMINDER": {
      if (!timeline.dueDate) return null;
      const offset =
        reminder.reminderType === "ASSIGNMENT_DUE_SOON"
          ? -firstOccurrenceDays(reminder)
          : firstOccurrenceDays(reminder);
      return new Date(timeline.dueDate.getTime() + offset * DAY_MS);
    }

    default:
      return null;
  }
};

/**
 * A reminder is considered "sent" once its computed trigger time has passed.
 */
export const isReminderSent = (
  reminder: Reminder,
  timeline: RequestTimeline,
  now = new Date(),
): boolean => {
  const trigger = getReminderTriggerDate(reminder, timeline);
  return trigger !== null && trigger.getTime() <= now.getTime();
};

export interface PartitionedReminders {
  sent: Reminder[];
  future: Reminder[];
}

/**
 * Splits reminders into sent (trigger time passed) and future (still upcoming)
 * groups.
 */
export const partitionReminders = (
  reminders: Reminder[],
  timeline: RequestTimeline,
  now = new Date(),
): PartitionedReminders => {
  const sent: Reminder[] = [];
  const future: Reminder[] = [];

  for (const reminder of reminders) {
    if (isReminderSent(reminder, timeline, now)) {
      sent.push(reminder);
    } else {
      future.push(reminder);
    }
  }

  return { sent, future };
};
