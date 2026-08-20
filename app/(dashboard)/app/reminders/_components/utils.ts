import { Reminder, ReminderType } from "@/lib/generated/prisma/browser";
import { match } from "ts-pattern";

const pluralizeDays = (count: number | null | undefined): string => {
  const num = count ?? 0;
  return `${num} day${num === 1 ? "" : "s"}`;
};

export const formatReminderSchedule = (
  reminder: Pick<
    Reminder,
    "reminderType" | "scheduleType" | "afterDays" | "everyDays"
  >,
): string => {
  const { reminderType, scheduleType, afterDays, everyDays } = reminder;

  // 1. Instant / Non-configurable Event Triggers
  if (reminderType === "ASSIGNMENT_STARTED") {
    return "Triggers instantly when the assignment is started";
  }
  if (reminderType === "ASSIGNMENT_OVERDUE") {
    return "Triggers instantly when the assignment becomes overdue";
  }
  if (reminderType === "ASSIGNMENT_COMPLETED") {
    return "Triggers instantly when the assignment is completed";
  }

  // Helper context generator for dynamic schedules
  const getContext = () => {
    switch (reminderType) {
      case "ASSIGNMENT_REMINDER":
        return {
          after: "after the assignment is created",
          offset: "from when the assignment is created",
        };
      case "ASSIGNMENT_DUE_SOON":
        return {
          after: "before the assignment is due",
          offset: "before the assignment is due",
        };
      case "ASSIGNMENT_OVERDUE_REMINDER":
        return {
          after: "after the assignment is overdue",
          offset: "after the assignment is overdue",
        };
      default:
        return { after: "", offset: "" };
    }
  };

  const context = getContext();

  // 2. Dynamic Schedule Formatting
  return match(scheduleType)
    .with("AFTER", () => {
      const days = pluralizeDays(afterDays);
      return context.after ? `${days} ${context.after}` : `${days} after delay`;
    })
    .with("EVERY", () => {
      const repeatInterval = pluralizeDays(everyDays);

      // ASSIGNMENT_DUE_SOON does not support an offset delay in the form
      if (reminderType === "ASSIGNMENT_DUE_SOON") {
        return `Every ${repeatInterval} before the assignment is due`;
      }

      // Handle offset delay for ASSIGNMENT_REMINDER and ASSIGNMENT_OVERDUE_REMINDER
      const offset = afterDays ?? 0;
      if (offset > 0) {
        const offsetDelay = pluralizeDays(offset);
        return `Every ${repeatInterval}, delayed by ${offsetDelay}${context.offset ? ` ${context.offset}` : ""}`;
      }

      return `Every ${repeatInterval}`;
    })
    .otherwise(() => "Unconfigured schedule");
};

export const getReminderBackgroundColor = (
  reminderType: ReminderType,
): string =>
  match(reminderType)
    .with("ASSIGNMENT_REMINDER", () => "bg-blue-500")
    .with("ASSIGNMENT_DUE_SOON", () => "bg-yellow-500")
    .with("ASSIGNMENT_OVERDUE_REMINDER", () => "bg-red-500")
    .with("ASSIGNMENT_STARTED", () => "bg-green-500")
    .with("ASSIGNMENT_OVERDUE", () => "bg-red-700")
    .with("ASSIGNMENT_COMPLETED", () => "bg-lime-500")
    .otherwise(() => "bg-gray-500");

export const getReminderBadgeColors = (reminderType: ReminderType): string =>
  match(reminderType)
    .with("ASSIGNMENT_REMINDER", () => "bg-blue-100/80 text-blue-800")
    .with("ASSIGNMENT_DUE_SOON", () => "bg-yellow-100/80 text-yellow-800")
    .with("ASSIGNMENT_OVERDUE_REMINDER", () => "bg-red-100/80 text-red-800")
    .with("ASSIGNMENT_STARTED", () => "bg-green-100/80 text-green-800")
    .with("ASSIGNMENT_OVERDUE", () => "bg-red-100/80 text-red-800")
    .with("ASSIGNMENT_COMPLETED", () => "bg-lime-100/80 text-lime-800")
    .otherwise(() => "bg-gray-100/80 text-gray-800");

export const getReminderBorderColors = (reminderType: ReminderType): string =>
  match(reminderType)
    .with("ASSIGNMENT_REMINDER", () => "border-blue-500/50")
    .with("ASSIGNMENT_DUE_SOON", () => "border-yellow-500/50")
    .with("ASSIGNMENT_OVERDUE_REMINDER", () => "border-red-500/50")
    .with("ASSIGNMENT_STARTED", () => "border-green-500/50")
    .with("ASSIGNMENT_OVERDUE", () => "border-red-700")
    .with("ASSIGNMENT_COMPLETED", () => "border-lime-500/50")
    .otherwise(() => "border-gray-500/50");

// Define strict rank priorities for top-level ReminderTypes
const TYPE_PRIORITY: Record<ReminderType, number> = {
  ASSIGNMENT_STARTED: 1,
  ASSIGNMENT_REMINDER: 2,
  ASSIGNMENT_DUE_SOON: 3,
  ASSIGNMENT_OVERDUE: 4,
  ASSIGNMENT_OVERDUE_REMINDER: 5,
  ASSIGNMENT_COMPLETED: 6,
};

/**
  Calculates the earliest occurrence in days relative to the trigger event.
  Used to resolve order among ASSIGNMENT_REMINDER, ASSIGNMENT_DUE_SOON, and ASSIGNMENT_OVERDUE_REMINDER.
 */
const getEffectiveFirstOccurrence = (
  reminder: Pick<Reminder, "scheduleType" | "afterDays" | "everyDays">,
): number => {
  const { scheduleType, afterDays, everyDays } = reminder;

  if (scheduleType === "AFTER") {
    return afterDays ?? 0;
  }

  if (scheduleType === "EVERY") {
    const interval = everyDays ?? 0;
    const offset = afterDays ?? 0;

    // "Whichever comes first": return interval if offset is 0, or offset if positive
    if (offset > 0) {
      return Math.min(interval, offset);
    }
    return interval;
  }

  return 0;
};

export const sortReminders = <
  T extends Pick<
    Reminder,
    "reminderType" | "scheduleType" | "afterDays" | "everyDays"
  >,
>(
  reminders: T[],
): T[] => {
  return [...reminders].sort((a, b) => {
    // 1. Primary Sort: ReminderType lifecycle order
    const priorityA = TYPE_PRIORITY[a.reminderType] ?? 99;
    const priorityB = TYPE_PRIORITY[b.reminderType] ?? 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // 2. Secondary Sort: Whichever comes first (earliest execution time)
    const timingA = getEffectiveFirstOccurrence(a);
    const timingB = getEffectiveFirstOccurrence(b);

    return timingA - timingB;
  });
};
