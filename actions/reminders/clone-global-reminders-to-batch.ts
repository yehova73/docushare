"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { Reminder } from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../account/account";

/**
 * Clones the user's global reminders into a batch-specific set so that edits
 * only affect this batch assignation and never the global reminders.
 *
 * If the batch already has its own reminders this is a no-op that returns the
 * existing batch reminders.
 */
export async function cloneGlobalRemindersToBatchAction(
  batchId: string,
): Promise<ServerActionResponse<{ reminders: Reminder[] }>> {
  try {
    const user = await getUserFromSession();

    const batch = await prisma.templateAssignationBatch.findFirst({
      where: { id: batchId, userId: user?.id },
      select: { id: true },
    });

    if (!batch) {
      return {
        status: "error",
        message: {
          title: "Draft not found",
          description: "The assignation draft does not exist or was removed.",
        },
        data: null,
      };
    }

    const existing = await prisma.reminder.findMany({
      where: { batchId },
      orderBy: { createdAt: "asc" },
    });
    if (existing.length > 0) {
      return {
        status: "ok",
        data: { reminders: existing },
      };
    }

    const globalReminders = await prisma.reminder.findMany({
      where: { userId: user?.id, batchId: null, assignmentId: null },
      orderBy: { createdAt: "asc" },
    });

    const cloned: Reminder[] = [];
    for (const reminder of globalReminders) {
      const created = await prisma.reminder.create({
        data: {
          userId: user!.id,
          batchId,
          title: reminder.title,
          scheduleType: reminder.scheduleType,
          everyDays: reminder.everyDays,
          afterDays: reminder.afterDays,
          reminderType: reminder.reminderType,
          subject: reminder.subject,
          content: reminder.content,
        },
      });
      cloned.push(created);
    }

    return {
      status: "ok",
      data: { reminders: cloned },
    };
  } catch (error) {
    console.error("Failed to clone reminders to batch:", error);
    return {
      status: "error",
      message: {
        title: "Failed to clone reminders",
        description:
          "An error occurred while cloning the reminders for this batch.",
      },
      data: null,
    };
  }
}
