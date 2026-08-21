"use server";

import { AssignedTemplateStatus } from "@/lib/generated/prisma/enums";
import { TemplateClientAssignationGetPayload } from "@/lib/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";

export interface GetRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AssignedTemplateStatus | "ALL";
  clientIds?: string[];
  templateId?: string;
}

export interface GetRequestsResponse {
  data: TemplateClientAssignationGetPayload<{
    include: { client: true; template: true };
  }>[];
  total?: number;
  page: number;
  limit: number;
}

export async function getRequests(
  params: GetRequestsParams = {},
): Promise<GetRequestsResponse> {
  const user = await getUserFromSession();

  const {
    page = 1,
    limit = 10,
    search = "",
    status = "ALL",
    clientIds,
    templateId,
  } = params;

  const skip = (page - 1) * limit;

  // Build the where clause
  const where: any = {
    template: {
      userId: user.id,
    },
  };

  // Apply status filter
  if (status !== "ALL") {
    where.status = status;
  }

  // Apply client IDs filter
  if (clientIds && clientIds.length > 0) {
    where.clientId = {
      in: clientIds,
    };
  }

  // Apply template ID filter
  if (templateId) {
    where.templateId = templateId;
  }

  // Apply search filter (search by client name or company)
  if (search) {
    where.client = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          company: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };
  }

  // Fetch total count
  const total =
    page !== 1
      ? undefined
      : await prisma.templateClientAssignation.count({
          where,
        });

  // Fetch paginated data
  const data = await prisma.templateClientAssignation.findMany({
    where,
    include: {
      client: true,
      template: true,
    },
    orderBy: {
      assignedAt: "desc",
    },
    skip,
    take: limit,
  });

  return {
    data,
    total,
    page,
    limit,
  };
}
