"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { Reminder } from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../account/account";

/**
 * Deletes a reminder scoped to a batch assignation. Only reminders that belong
 * to the given batch can be deleted here — global reminders are never touched.
 */
export async function deleteBatchReminderAction(
  batchId: string,
  reminderId: string,
): Promise<ServerActionResponse<Reminder>> {
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

    if (!reminderId?.trim()) {
      return {
        status: "error",
        message: {
          title: "Validation Error",
          description: "Reminder ID is required.",
        },
      };
    }

    const reminder = await prisma.reminder.findFirst({
      where: { id: reminderId, batchId },
    });

    if (!reminder) {
      return {
        status: "error",
        message: {
          title: "Not Found",
          description:
            "Reminder not found for this batch or you do not have permission to delete it.",
        },
      };
    }

    const deleted = await prisma.reminder.delete({
      where: { id: reminderId },
    });

    return {
      status: "ok",
      data: deleted,
      message: {
        title: "Success",
        description: "Reminder deleted from this batch.",
      },
    };
  } catch (error) {
    console.error("Error deleting batch reminder:", error);
    return {
      status: "error",
      message: {
        title: "Error",
        description: "Failed to delete reminder. Please try again.",
      },
    };
  }
}
