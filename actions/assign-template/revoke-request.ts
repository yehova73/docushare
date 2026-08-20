"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { getUserFromSession } from "../account/account";

import { prisma } from "@/lib/prisma";

export const revokeRequestAction = async (
  requestId: string,
): Promise<ServerActionResponse<{ id: string }>> => {
  const user = await getUserFromSession();

  if (!user) {
    return {
      status: "error",
      message: {
        title: "Unauthorized",
        description: "Please sign in to revoke a request",
      },
      data: null,
    };
  }

  const assignment = await prisma.templateClientAssignation.findUnique({
    where: { id: requestId },
    select: { id: true, template: { select: { userId: true } } },
  });

  if (!assignment || assignment.template.userId !== user.id) {
    return {
      status: "error",
      message: {
        title: "Unauthorized",
        description: "You don't have permission to revoke this request",
      },
      data: null,
    };
  }

  await prisma.templateClientAssignation.delete({
    where: { id: requestId },
  });

  return {
    status: "ok",
    message: {
      title: "Request revoked",
      description: "The request has been successfully revoked",
    },
    data: { id: requestId },
  };
};
