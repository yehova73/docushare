"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import {
  TemplateAssignationBatch,
  TemplateAssignationBatchClient,
} from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../../account/account";
import { markQuickStartActionComplete } from "@/actions/quick-start/mark-quick-start-action-complete";

export type AssignationDraftClientInput = {
  clientId: string;
  dueDate?: string | null;
};

export type UpdateAssignationDraftInput = {
  draftId: string;
  templateId?: string | null;
  currentStep?: number;
  clients?: AssignationDraftClientInput[];
};

export type AssignationDraftPayload = TemplateAssignationBatch & {
  clients: TemplateAssignationBatchClient[];
};

export const updateAssignationDraftAction = async (
  input: UpdateAssignationDraftInput,
): Promise<ServerActionResponse<{ draft: AssignationDraftPayload }>> => {
  try {
    const user = await getUserFromSession();

    const existing = await prisma.templateAssignationBatch.findFirst({
      where: { id: input.draftId, userId: user?.id },
    });

    if (!existing) {
      return {
        status: "error",
        message: {
          title: "Draft not found",
          description: "The assignation draft does not exist or was removed.",
        },
        data: null,
      };
    }

    const clientInputs = input.clients ?? [];
    const clientIds = clientInputs.map((client) => client.clientId);

    // Only allow clients that belong to the current user.
    const ownedClients = await prisma.client.findMany({
      where: { id: { in: clientIds }, userId: user?.id },
      select: { id: true },
    });
    const ownedClientIds = new Set(ownedClients.map((client) => client.id));

    // Rebuild the client rows to reflect current selection + due dates.
    await prisma.templateAssignationBatchClient.deleteMany({
      where: { batchId: input.draftId },
    });

    if (clientInputs.length > 0) {
      await prisma.templateAssignationBatchClient.createMany({
        data: clientInputs
          .filter((client) => ownedClientIds.has(client.clientId))
          .map((client, index) => ({
            batchId: input.draftId,
            clientId: client.clientId,
            dueDate: client.dueDate ? new Date(client.dueDate) : null,
            order: index,
          })),
      });
    }

    const draft = await prisma.templateAssignationBatch.update({
      where: { id: input.draftId },
      data: {
        templateId: input.templateId ?? null,
        currentStep: input.currentStep ?? existing.currentStep,
      },
      include: {
        clients: {
          orderBy: { order: "asc" },
        },
      },
    });
    markQuickStartActionComplete(user!.id, "createdDocumentRequest");
    return {
      status: "ok",
      data: { draft },
    };
  } catch (error) {
    console.error("Failed to update assignation draft:", error);
    return {
      status: "error",
      message: {
        title: "Failed to save progress",
        description: "An error occurred while saving the assignation draft.",
      },
      data: null,
    };
  }
};
