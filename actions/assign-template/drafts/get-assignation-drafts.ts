"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../../account/account";

export type AssignationDraftListItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  currentStep: number;
  status: "DRAFT" | "SUBMITTED";
  templateId: string | null;
  template: {
    id: string;
    name: string;
    description: string | null;
    totalFields: number;
    requiredFields: number;
  } | null;
  clients: {
    id: string;
    clientId: string;
    dueDate: Date | null;
    order: number;
    client: {
      id: string;
      name: string;
      email: string | null;
      company: string | null;
    };
  }[];
};

export const getAssignationDraftsAction = async (): Promise<
  ServerActionResponse<{ drafts: AssignationDraftListItem[] }>
> => {
  try {
    const user = await getUserFromSession();

    const drafts = await prisma.templateAssignationBatch.findMany({
      where: {
        userId: user?.id,
        status: "DRAFT",
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            description: true,
            totalFields: true,
            requiredFields: true,
          },
        },
        clients: {
          orderBy: { order: "asc" },
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
                company: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      status: "ok",
      data: { drafts },
    };
  } catch (error) {
    console.error("Failed to load assignation drafts:", error);
    return {
      status: "error",
      message: {
        title: "Failed to load drafts",
        description: "An error occurred while loading the assignation drafts.",
      },
      data: null,
    };
  }
};
