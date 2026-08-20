"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";
import { Template } from "@/lib/generated/prisma/client";

export const editTemplateAction = async (
  templateId: string,
  data: {
    name: string;
    description: string;
    category: string;
  },
): Promise<ServerActionResponse<Template>> => {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "Please sign in to edit a template",
        },
        data: null,
      };
    }

    // Verify the template belongs to the user
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { userId: true },
    });

    if (!template) {
      return {
        status: "error",
        message: {
          title: "Template not found",
          description: "The template you're trying to edit does not exist",
        },
        data: null,
      };
    }

    if (template.userId !== user.id) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "You don't have permission to edit this template",
        },
        data: null,
      };
    }

    const updatedTemplate = await prisma.template.update({
      where: { id: templateId },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
      },
    });

    return {
      status: "ok",
      message: {
        title: "Template updated",
        description: `"${updatedTemplate.name}" template has been updated successfully`,
      },
      data: updatedTemplate,
      requireRefresh: true,
    };
  } catch (error) {
    console.error("Failed to edit template:", error);
    return {
      status: "error",
      message: {
        title: "Failed to edit template",
        description: "An error occurred while editing the template",
      },
      data: null,
    };
  }
};
