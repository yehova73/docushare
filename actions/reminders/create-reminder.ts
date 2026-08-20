"use server";

import { prisma } from "@/lib/prisma";

import { ServerActionResponse } from "@/hooks/use-server-action";
import {
  ReminderScheduleType,
  ReminderType,
} from "@/lib/generated/prisma/enums";
import { Reminder } from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../account/account";

export interface CreateReminderInput {
  title: string;
  subject: string;
  content: string;
  reminderType: ReminderType;
  scheduleType: ReminderScheduleType;
  afterDays?: number | null;
  everyDays?: number | null;
}

export async function createReminderAction(
  input: CreateReminderInput,
): Promise<ServerActionResponse<Reminder>> {
  try {
    const user = await getUserFromSession();

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

    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
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
        description: "Reminder created successfully.",
      },
    };
  } catch (error) {
    console.error("Error creating reminder:", error);
    return {
      status: "error",
      message: {
        title: "Error",
        description: "Failed to create reminder. Please try again.",
      },
    };
  }
}
