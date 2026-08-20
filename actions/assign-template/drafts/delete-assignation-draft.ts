"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../../account/account";

export const deleteAssignationDraftAction = async (
  draftId: string,
): Promise<ServerActionResponse<{ id: string }>> => {
  try {
    const user = await getUserFromSession();

    const existing = await prisma.templateAssignationBatch.findFirst({
      where: { id: draftId, userId: user?.id },
      select: { id: true },
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

    await prisma.templateAssignationBatch.delete({
      where: { id: draftId },
    });

    return {
      status: "ok",
      message: {
        title: "Draft deleted",
        description: "The assignation draft was deleted.",
      },
      data: { id: draftId },
    };
  } catch (error) {
    console.error("Failed to delete assignation draft:", error);
    return {
      status: "error",
      message: {
        title: "Failed to delete draft",
        description: "An error occurred while deleting the assignation draft.",
      },
      data: null,
    };
  }
};
