"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ServerActionResponse,
  ServerActionMessageDetail,
} from "@/hooks/use-server-action";
import { TemplateGetPayload } from "@/lib/generated/prisma/models";

type EditableTemplate = TemplateGetPayload<{
  include: {
    sections: {
      include: {
        fields: true;
      };
    };
  };
}>;

export async function saveTemplateWithSectionsAction(
  template: EditableTemplate,
): Promise<ServerActionResponse<EditableTemplate, ServerActionMessageDetail>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "You must be logged in to save templates",
        },
      };
    }

    // Verify ownership
    const existingTemplate = await prisma.template.findUnique({
      where: { id: template.id },
    });

    if (!existingTemplate || existingTemplate.userId !== session.user.id) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "You don't have permission to edit this template",
        },
      };
    }

    // Delete all existing sections and fields (recreate approach)
    await prisma.templateSection.deleteMany({
      where: { templateId: template.id },
    });

    // Update template basic info
    const updatedTemplate = await prisma.template.update({
      where: { id: template.id },
      data: {
        name: template.name,
        description: template.description,
        category: template.category,
        headerImage: template.headerImage,
        totalSections: template.sections.length,
        totalFields: template.sections.reduce(
          (acc, section) => acc + section.fields.length,
          0,
        ),
        requiredFields: template.sections.reduce(
          (acc, section) =>
            acc + section.fields.filter((field) => field.required).length,
          0,
        ),
      },
      include: {
        sections: {
          include: {
            fields: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Create new sections with fields
    for (const section of template.sections) {
      const createdSection = await prisma.templateSection.create({
        data: {
          templateId: template.id,
          name: section.name,
          order: section.order,
        },
      });

      // Create fields for this section
      for (const field of section.fields) {
        await prisma.templateField.create({
          data: {
            sectionId: createdSection.id,
            name: field.name,
            description: field.description,
            placeholder: field.placeholder,
            type: field.type,
            required: field.required,
            order: field.order,
            allowMultiple: field.allowMultiple,
            characterLimit: field.characterLimit,
          },
        });
      }
    }

    // Fetch the complete saved template
    const savedTemplate = await prisma.template.findUnique({
      where: { id: template.id },
      include: {
        sections: {
          include: {
            fields: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return {
      status: "ok",
      data: savedTemplate as EditableTemplate,
    };
  } catch (error) {
    console.error("Error saving template:", error);
    return {
      status: "error",
      message: {
        title: "Save failed",
        description: "Failed to save your template. Please try again.",
      },
    };
  }
}
