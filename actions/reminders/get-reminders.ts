"use server";

import { prisma } from "@/lib/prisma";

import { ServerActionResponse } from "@/hooks/use-server-action";

import { Reminder } from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../account/account";

export async function getRemindersAction(): Promise<
  ServerActionResponse<Reminder[]>
> {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return {
        status: "error",
        message: {
          title: "Authentication Error",
          description: "User not authenticated.",
        },
      };
    }
    const reminders = await prisma.reminder.findMany({
      where: { userId: user.id, batchId: null },
    });
    return { status: "ok", data: reminders };
  } catch (error) {
    return {
      status: "error",
      message: {
        title: "Error",
        description: "Failed to fetch reminders. Please try again.",
      },
    };
  }
}
