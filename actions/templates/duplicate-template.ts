"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";
import { Template } from "@/lib/generated/prisma/client";

export const duplicateTemplateAction = async (
  templateId: string,
): Promise<ServerActionResponse<Template>> => {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "Please sign in to duplicate a template",
        },
        data: null,
      };
    }

    // Fetch the template with all its sections and fields
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        sections: {
          include: {
            fields: true,
          },
        },
      },
    });

    if (!template) {
      return {
        status: "error",
        message: {
          title: "Template not found",
          description: "The template you're trying to duplicate does not exist",
        },
        data: null,
      };
    }

    if (template.userId && template.userId !== user.id) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "You don't have permission to duplicate this template",
        },
        data: null,
      };
    }

    // Create the duplicated template
    const newTemplate = await prisma.template.create({
      data: {
        name: template.userId ? `Copy of ${template.name}` : template.name,
        description: template.description,
        category: template.category,
        headerImage: template.headerImage,
        totalFields: template.totalFields,
        requiredFields: template.requiredFields,
        totalSections: template.totalSections,

        userId: user.id,
        sections: {
          create: template.sections.map((section) => ({
            name: section.name,
            order: section.order,
            fields: {
              create: section.fields.map((field) => ({
                name: field.name,
                description: field.description,
                placeholder: field.placeholder,
                type: field.type,
                required: field.required,
                order: field.order,
                allowMultiple: field.allowMultiple,
                characterLimit: field.characterLimit,
              })),
            },
          })),
        },
      },
    });

    return {
      status: "ok",
      message: {
        title: `Template ${template.userId ? "duplicated" : "imported"}`,
        description: `"${newTemplate.name}" has been created successfully`,
      },
      data: newTemplate,
      requireRefresh: true,
    };
  } catch (error) {
    console.error("Failed to duplicate template:", error);
    return {
      status: "error",
      message: {
        title: "Failed to duplicate template",
        description: "An error occurred while duplicating the template",
      },
      data: null,
    };
  }
};
