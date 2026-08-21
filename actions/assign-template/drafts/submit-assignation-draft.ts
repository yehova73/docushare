"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import {
  TemplateAssignationBatch,
  TemplateAssignationBatchClient,
  TemplateClientAssignation,
} from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../../account/account";
import { markQuickStartActionComplete } from "../../quick-start/mark-quick-start-action-complete";
import { assignTemplateToClientAction } from "../assign-template-to-client";

export type SubmitAssignationDraftInput = {
  draftId: string;
  startNow?: boolean;
};

export type AssignationDraftPayload = TemplateAssignationBatch & {
  clients: TemplateAssignationBatchClient[];
};

export type SubmittedAssignation = {
  clientId: string;
  clientName: string;
  template: TemplateClientAssignation;
  url: string;
};

export const submitAssignationDraftAction = async (
  input: SubmitAssignationDraftInput,
): Promise<
  ServerActionResponse<{
    draft: AssignationDraftPayload;
    assignations: SubmittedAssignation[];
  }>
> => {
  try {
    const user = await getUserFromSession();

    const draft = await prisma.templateAssignationBatch.findFirst({
      where: { id: input.draftId, userId: user?.id },
      include: {
        clients: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!draft) {
      return {
        status: "error",
        message: {
          title: "Draft not found",
          description: "The assignation draft does not exist or was removed.",
        },
        data: null,
      };
    }

    if (!draft.templateId) {
      return {
        status: "error",
        message: {
          title: "No template selected",
          description: "Select a template before submitting the assignation.",
        },
        data: null,
      };
    }

    if (draft.clients.length === 0) {
      return {
        status: "error",
        message: {
          title: "No clients selected",
          description: "Select at least one client before submitting.",
        },
        data: null,
      };
    }

    const clientNames = await prisma.client.findMany({
      where: { id: { in: draft.clients.map((client) => client.clientId) } },
      select: { id: true, name: true },
    });
    const nameById = new Map(
      clientNames.map((client) => [client.id, client.name]),
    );

    const assignations: SubmittedAssignation[] = [];

    // Resolve the reminders to attach to each created assignation: the batch's
    // own reminders when present, otherwise fall back to the user's global
    // reminders (matches the preview shown in the draft's reminders step).
    const batchReminders = await prisma.reminder.findMany({
      where: { batchId: draft.id },
      orderBy: { createdAt: "asc" },
    });

    const effectiveReminders =
      batchReminders.length > 0
        ? batchReminders
        : await prisma.reminder.findMany({
            where: { userId: user.id, batchId: null },
            orderBy: { createdAt: "asc" },
          });

    // Create one 1:1 TemplateClientAssignation per client by reusing the
    // existing single-client assignation flow (duplicates the template per client).
    for (const draftClient of draft.clients) {
      const result = await assignTemplateToClientAction({
        clientId: draftClient.clientId,
        templateId: draft.templateId,
        dueDate: draftClient.dueDate ?? undefined,
        startNow: input.startNow ?? false,
      });

      if (result.status === "error" || !result.data) {
        return {
          status: "error",
          message: {
            title: "Failed to assign template",
            description:
              result.message?.description ||
              `Could not create the assignation for "${nameById.get(draftClient.clientId) ?? "client"}".`,
          },
          data: null,
        };
      }

      const createdTemplate = result.data.template;

      assignations.push({
        clientId: draftClient.clientId,
        clientName: nameById.get(draftClient.clientId) ?? draftClient.clientId,
        template: createdTemplate,
        url: result.data.url,
      });

      // Clone the draft reminders onto the created assignation so the request
      // detail page can render its sent/future reminder history.
      if (effectiveReminders.length > 0) {
        await prisma.reminder.createMany({
          data: effectiveReminders.map((reminder) => ({
            userId: user.id,
            assignmentId: createdTemplate.id,
            title: reminder.title,
            scheduleType: reminder.scheduleType,
            everyDays: reminder.everyDays,
            afterDays: reminder.afterDays,
            reminderType: reminder.reminderType,
            subject: reminder.subject,
            content: reminder.content,
          })),
        });
      }
    }

    const updatedDraft = await prisma.templateAssignationBatch.update({
      where: { id: draft.id },
      data: { status: "SUBMITTED" },
      include: {
        clients: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (user?.id) {
      markQuickStartActionComplete(user.id, "sentFirstRequest");
    }

    return {
      status: "ok",
      message: {
        title: "Assignation submitted",
        description: `The template was assigned to ${assignations.length} client${assignations.length === 1 ? "" : "s"}.`,
      },
      data: {
        draft: updatedDraft,
        assignations,
      },
      requireRefresh: true,
    };
  } catch (error) {
    console.error("Failed to submit assignation draft:", error);
    return {
      status: "error",
      message: {
        title: "Failed to submit assignation",
        description:
          "An error occurred while submitting the assignation draft.",
      },
      data: null,
    };
  }
};
