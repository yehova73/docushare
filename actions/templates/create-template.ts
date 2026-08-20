"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";
import { markQuickStartActionComplete } from "../quick-start/mark-quick-start-action-complete";
import { Template } from "@/lib/generated/prisma/client";

export const createTemplateAction = async (data: {
  name: string;
  description: string;
  category: string;
}): Promise<ServerActionResponse<Template>> => {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "Please sign in to create a template",
        },
        data: null,
      };
    }

    const template = await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        userId: user.id,
      },
    });

    markQuickStartActionComplete(user.id, "createdFirstTemplate");

    return {
      status: "ok",
      message: {
        title: "Template created",
        description: `"${template.name}" template has been created successfully`,
      },
      data: template,
    };
  } catch (error) {
    console.error("Failed to create template:", error);
    return {
      status: "error",
      message: {
        title: "Failed to create template",
        description: "An error occurred while creating the template",
      },
      data: null,
    };
  }
};
