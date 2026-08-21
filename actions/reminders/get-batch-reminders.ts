"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { Reminder } from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../account/account";

/**
 * Returns the reminders for a batch assignation.
 *
 * If the batch already has its own (cloned) reminders, those are returned with
 * `isCloned: true`. Otherwise the user's global reminders are returned with
 * `isCloned: false` so the UI can preview what will be used before the first
 * edit clones them for this batch only.
 */
export async function getBatchRemindersAction(batchId: string): Promise<
  ServerActionResponse<{
    reminders: Reminder[];
    isCloned: boolean;
  }>
> {
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

    const batchReminders = await prisma.reminder.findMany({
      where: { batchId },
      orderBy: { createdAt: "asc" },
    });

    if (batchReminders.length > 0) {
      return {
        status: "ok",
        data: { reminders: batchReminders, isCloned: true },
      };
    }

    // Fall back to global reminders (those not tied to any batch).
    const globalReminders = await prisma.reminder.findMany({
      where: { userId: user?.id, batchId: null, assignmentId: null },
      orderBy: { createdAt: "asc" },
    });

    return {
      status: "ok",
      data: { reminders: globalReminders, isCloned: false },
    };
  } catch (error) {
    console.error("Failed to load batch reminders:", error);
    return {
      status: "error",
      message: {
        title: "Failed to load reminders",
        description: "An error occurred while loading the reminders.",
      },
      data: null,
    };
  }
}
