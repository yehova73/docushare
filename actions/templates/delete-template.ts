"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";

export const deleteTemplateAction = async (
  templateId: string,
): Promise<ServerActionResponse<{ id: string }>> => {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "Please sign in to delete a template",
        },
        data: null,
      };
    }

    // Verify the template belongs to the user
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { userId: true, name: true },
    });

    if (!template) {
      return {
        status: "error",
        message: {
          title: "Template not found",
          description: "The template you're trying to delete does not exist",
        },
        data: null,
      };
    }

    if (template.userId !== user.id) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "You don't have permission to delete this template",
        },
        data: null,
      };
    }

    await prisma.template.delete({
      where: { id: templateId },
    });

    return {
      status: "ok",
      message: {
        title: "Template deleted",
        description: `"${template.name}" template has been deleted successfully`,
      },
      data: { id: templateId },
      requireRefresh: true,
    };
  } catch (error) {
    console.error("Failed to delete template:", error);
    return {
      status: "error",
      message: {
        title: "Failed to delete template",
        description: "An error occurred while deleting the template",
      },
      data: null,
    };
  }
};
