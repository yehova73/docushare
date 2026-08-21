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

export const getAssignationDraftsAction = async (
  params: {
    search?: string;
    clientIds?: string[];
  } = {},
): Promise<ServerActionResponse<{ drafts: AssignationDraftListItem[] }>> => {
  try {
    const user = await getUserFromSession();

    const { search = "", clientIds } = params;

    const where: any = {
      userId: user?.id,
      status: "DRAFT",
    };

    // Search by template name or any of the draft's client names.
    const searchConditions: any[] = [];
    if (search) {
      searchConditions.push({
        template: {
          name: { contains: search, mode: "insensitive" },
        },
      });
      searchConditions.push({
        clients: {
          some: {
            client: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      });
    }

    // Filter by one or more selected clients.
    const clientConditions: any[] = [];
    if (clientIds && clientIds.length > 0) {
      clientConditions.push({ clientId: { in: clientIds } });
    }

    if (searchConditions.length > 0 && clientConditions.length > 0) {
      where.AND = [
        { OR: searchConditions },
        { clients: { some: { AND: clientConditions } } },
      ];
    } else if (searchConditions.length > 0) {
      where.OR = searchConditions;
    } else if (clientConditions.length > 0) {
      where.clients = { some: { AND: clientConditions } };
    }

    const drafts = await prisma.templateAssignationBatch.findMany({
      where,
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
