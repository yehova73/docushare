"use server";

import { prisma } from "@/lib/prisma";

import { ServerActionResponse } from "@/hooks/use-server-action";
import {
  ReminderScheduleType,
  ReminderType,
} from "@/lib/generated/prisma/enums";
import { Reminder } from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../account/account";

export async function deleteReminderAction(
  id: string,
): Promise<ServerActionResponse<Reminder>> {
  try {
    const user = await getUserFromSession();

    // Validate required fields
    if (!id?.trim()) {
      return {
        status: "error",
        message: {
          title: "Validation Error",
          description: "Reminder ID is required.",
        },
      };
    }

    const reminder = await prisma.reminder.delete({
      where: {
        id,
        userId: user?.id,
      },
    });

    if (!reminder) {
      return {
        status: "error",
        message: {
          title: "Error",
          description:
            "Reminder not found or you do not have permission to delete it.",
        },
      };
    }

    return {
      status: "ok",
      data: reminder,
      message: {
        title: "Success",
        description: "Reminder deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return {
      status: "error",
      message: {
        title: "Error",
        description: "Failed to delete reminder. Please try again.",
      },
    };
  }
}
