"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import {
  TemplateAssignationBatch,
  TemplateAssignationBatchClient,
} from "@/lib/generated/prisma/client";
import { getUserFromSession } from "../../account/account";

export type AssignationDraftPayload = TemplateAssignationBatch & {
  clients: (TemplateAssignationBatchClient & {
    client: {
      id: string;
      name: string;
      company: string | null;
      email: string | null;
    };
  })[];
};

export const getAssignationDraftAction = async (
  draftId: string,
): Promise<ServerActionResponse<{ draft: AssignationDraftPayload }>> => {
  try {
    const user = await getUserFromSession();

    const draft = await prisma.templateAssignationBatch.findFirst({
      where: { id: draftId, userId: user?.id },
      include: {
        clients: {
          orderBy: { order: "asc" },
          include: {
            client: {
              select: {
                id: true,
                name: true,
                company: true,
                email: true,
              },
            },
          },
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

    return {
      status: "ok",
      data: { draft },
    };
  } catch (error) {
    console.error("Failed to load assignation draft:", error);
    return {
      status: "error",
      message: {
        title: "Failed to load draft",
        description: "An error occurred while loading the assignation draft.",
      },
      data: null,
    };
  }
};
