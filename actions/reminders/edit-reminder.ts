"use server";

import { prisma } from "@/lib/prisma";

import { ServerActionResponse } from "@/hooks/use-server-action";
import {
  ReminderScheduleType,
  ReminderType,
} from "@/lib/generated/prisma/browser";
import { Reminder } from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../account/account";

export interface EditReminderInput {
  id: string;
  title: string;
  subject: string;
  content: string;
  reminderType: ReminderType;
  scheduleType: ReminderScheduleType;
  afterDays?: number | null;
  everyDays?: number | null;
}

export async function editReminderAction(
  input: EditReminderInput,
): Promise<ServerActionResponse<Reminder>> {
  try {
    const user = await getUserFromSession(); // Replace with your actual session retrieval logic

    // Verify the reminder belongs to the user
    const existingReminder = await prisma.reminder.findUnique({
      where: { id: input.id },
    });

    if (!existingReminder) {
      return {
        status: "error",
        message: {
          title: "Not Found",
          description: "Reminder not found.",
        },
      };
    }

    if (existingReminder.userId !== user.id) {
      return {
        status: "error",
        message: {
          title: "Forbidden",
          description: "You do not have permission to edit this reminder.",
        },
      };
    }

    // Validate required fields
    if (!input.title?.trim()) {
      return {
        status: "error",
        message: {
          title: "Validation Error",
          description: "Reminder name is required.",
        },
      };
    }

    if (!input.subject?.trim()) {
      return {
        status: "error",
        message: {
          title: "Validation Error",
          description: "Email subject is required.",
        },
      };
    }

    if (!input.content?.trim()) {
      return {
        status: "error",
        message: {
          title: "Validation Error",
          description: "Email content is required.",
        },
      };
    }

    // Validate schedule configuration
    if (input.scheduleType === "AFTER" && !input.afterDays) {
      return {
        status: "error",
        message: {
          title: "Validation Error",
          description: "Please specify the number of days for the delay.",
        },
      };
    }

    if (input.scheduleType === "EVERY" && !input.everyDays) {
      return {
        status: "error",
        message: {
          title: "Validation Error",
          description: "Please specify the repeat interval in days.",
        },
      };
    }

    console.log("Editing reminder with input:", input);

    const reminder = await prisma.reminder.update({
      where: { id: input.id },
      data: {
        title: input.title.trim(),
        subject: input.subject.trim(),
        content: input.content.trim(),
        reminderType: input.reminderType,
        scheduleType: input.scheduleType,
        afterDays: input.afterDays || null,
        everyDays: input.everyDays || null,
      },
    });

    return {
      status: "ok",
      data: reminder,
      message: {
        title: "Success",
        description: "Reminder updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error editing reminder:", error);
    return {
      status: "error",
      message: {
        title: "Error",
        description: "Failed to update reminder. Please try again.",
      },
    };
  }
}
