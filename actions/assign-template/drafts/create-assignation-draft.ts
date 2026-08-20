"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import {
  TemplateAssignationBatch,
  TemplateAssignationBatchClient,
} from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../../account/account";

export type CreateAssignationDraftInput = {
  templateId?: string | null;
  clientIds?: string[];
  currentStep?: number;
};

export type AssignationDraftPayload = TemplateAssignationBatch & {
  clients: TemplateAssignationBatchClient[];
};

export const createAssignationDraftAction = async (
  input: CreateAssignationDraftInput = {},
): Promise<ServerActionResponse<{ draft: AssignationDraftPayload }>> => {
  try {
    const user = await getUserFromSession();

    const clientIds = (input.clientIds ?? []).filter(Boolean);

    // Only allow clients that belong to the current user.
    const ownedClients = await prisma.client.findMany({
      where: { id: { in: clientIds }, userId: user?.id },
      select: { id: true },
    });
    const ownedClientIds = ownedClients.map((client) => client.id);

    const draft = await prisma.templateAssignationBatch.create({
      data: {
        userId: user!.id,
        templateId: input.templateId ?? null,
        currentStep: input.currentStep ?? 0,
        clients: {
          create: ownedClientIds.map((clientId, index) => ({
            clientId,
            order: index,
          })),
        },
      },
      include: {
        clients: {
          orderBy: { order: "asc" },
        },
      },
    });

    return {
      status: "ok",
      data: { draft },
    };
  } catch (error) {
    console.error("Failed to create assignation draft:", error);
    return {
      status: "error",
      message: {
        title: "Failed to create draft",
        description: "An error occurred while creating the assignation draft.",
      },
      data: null,
    };
  }
};
