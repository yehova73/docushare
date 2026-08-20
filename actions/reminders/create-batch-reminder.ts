"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import {
  Reminder,
  ReminderScheduleType,
  ReminderType,
} from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../account/account";
import { markQuickStartActionComplete } from "../quick-start/mark-quick-start-action-complete";
import { cloneGlobalRemindersToBatchAction } from "./clone-global-reminders-to-batch";

export interface CreateBatchReminderInput {
  title: string;
  subject: string;
  content: string;
  reminderType: ReminderType;
  scheduleType: ReminderScheduleType;
  afterDays?: number | null;
  everyDays?: number | null;
}

/**
 * Creates a reminder scoped to a batch assignation. Before creating, it makes
 * sure the batch has its own reminder set (cloning global reminders on first
 * edit) so the new reminder is added alongside the batch copies and never
 * touches the global reminders.
 */
export async function createBatchReminderAction(
  batchId: string,
  input: CreateBatchReminderInput,
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

    // Ensure batch-specific reminders exist before creating a new one.
    const cloneResult = await cloneGlobalRemindersToBatchAction(batchId);
    if (cloneResult.status === "error") {
      return {
        status: "error",
        message: cloneResult.message ?? {
          title: "Error",
          description: "Failed to prepare the batch reminders.",
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
        batchId,
        title: input.title.trim(),
        subject: input.subject.trim(),
        content: input.content.trim(),
        reminderType: input.reminderType,
        scheduleType: input.scheduleType,
        afterDays: input.afterDays || null,
        everyDays: input.everyDays || null,
      },
    });

    if (user?.id) {
      markQuickStartActionComplete(user.id, "createdDocumentRequest");
    }

    return {
      status: "ok",
      data: reminder,
      message: {
        title: "Success",
        description: "Reminder created for this batch.",
      },
    };
  } catch (error) {
    console.error("Error creating batch reminder:", error);
    return {
      status: "error",
      message: {
        title: "Error",
        description: "Failed to create reminder. Please try again.",
      },
    };
  }
}
