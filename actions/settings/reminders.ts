"use server";

import { getUserFromSession } from "@/actions/account/account";
import { ServerActionResponse } from "@/hooks/use-server-action";
import { UserReminderSettings } from "@/lib/generated/prisma/browser";
import { prisma } from "@/lib/prisma";

export type ReminderSettingsInput = {
  senderName: string;
  sendingHour: number;
};

export async function updateReminderSettingsAction(
  input: ReminderSettingsInput,
): Promise<ServerActionResponse<UserReminderSettings>> {
  try {
    const user = await getUserFromSession();
    const senderName = input.senderName.trim();

    if (
      !Number.isInteger(input.sendingHour) ||
      input.sendingHour < 0 ||
      input.sendingHour > 23
    ) {
      return {
        status: "error",
        data: null,
        message: {
          title: "Invalid sending hour",
          description: "Choose an hour between 0 and 23.",
        },
      };
    }

    if (!senderName) {
      return {
        status: "error",
        data: null,
        message: {
          title: "Sender name is required",
          description: "Enter the name clients should see on reminder emails.",
        },
      };
    }

    const settings = await prisma.userReminderSettings.upsert({
      where: { userId: user.id },
      create: { userId: user.id, senderName, sendingHour: input.sendingHour },
      update: { senderName, sendingHour: input.sendingHour },
    });

    return {
      status: "ok",
      data: settings,
      message: {
        title: "Reminder settings updated",
        description: "Your reminder email preferences have been saved.",
      },
    };
  } catch (error) {
    console.error("Failed to update reminder settings:", error);
    return {
      status: "error",
      data: null,
      message: {
        title: "Failed to update reminder settings",
        description: "An error occurred while saving your reminder settings.",
      },
    };
  }
}
