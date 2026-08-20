"use server";

import { Template } from "@/lib/generated/prisma/browser";
import { getUserFromSession } from "../account/account";
import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { duplicateTemplateAction } from "../templates/duplicate-template";
import { TemplateClientAssignation } from "@/lib/generated/prisma/client";
import { after } from "next/server";
import { ensureDriveAssignationFoldersAndSpreadsheet } from "../drive/ensure-drive-assignation-folders-and-speadsheet";

export const assignTemplateToClientAction = async (params: {
  name?: string;
  clientId: string;
  templateId: string;
  dueDate?: Date;
  startNow?: boolean;
}): Promise<
  ServerActionResponse<{
    template: TemplateClientAssignation;
    url: string;
  }>
> => {
  const user = await getUserFromSession();

  const { clientId, templateId, dueDate } = params;

  const client = await prisma.client.findUnique({
    where: { id: clientId, userId: user?.id },
  });

  if (!client) {
    return {
      status: "error",
      message: {
        title: "Client not found",
        description:
          "The client you're trying to assign the template to does not exist",
      },
      data: null,
    };
  }

  const template = await prisma.template.findUnique({
    where: { id: templateId, userId: user?.id },
  });

  if (!template) {
    return {
      status: "error",
      message: {
        title: "Template not found",
        description: "The template you're trying to assign does not exist",
      },
      data: null,
    };
  }

  const duplicatedTemplate = await duplicateTemplateAction(templateId);

  if (duplicatedTemplate.status === "error" || !duplicatedTemplate.data) {
    return {
      status: "error",
      message: {
        title: "Failed to duplicate template",
        description:
          duplicatedTemplate.message?.description ||
          "An error occurred while duplicating the template",
      },
      data: null,
    };
  }

  await prisma.template.update({
    where: { id: duplicatedTemplate.data.id },
    data: {
      assignationParentTemplateId: templateId,
    },
  });

  const updatedTemplate = await prisma.templateClientAssignation.create({
    data: {
      clientId: client.id,
      templateId: duplicatedTemplate.data.id,
      name: params.name,
      dueDate: dueDate || null,
      status: params.startNow ? "IN_PROGRESS" : "DRAFT",
      submittedAt: params.startNow ? new Date() : null,
      totalFieldsCount: duplicatedTemplate.data.totalFields,
      totalRequiredFieldsCount: duplicatedTemplate.data.requiredFields,
      totalSectionsCount: duplicatedTemplate.data.totalSections,
    },
  });

  const url = `/client-portal/${updatedTemplate.clientId}`;

  const driveSettings = await prisma.googleDriveAccount.findFirst({
    where: { userId: user.id, folderId: { not: null } },
  });

  if (driveSettings && duplicatedTemplate.data.name) {
    after(async () => {
      if (duplicatedTemplate.data?.name) {
        await ensureDriveAssignationFoldersAndSpreadsheet({
          userId: user.id,
          templateName: duplicatedTemplate.data.name,
          clientName: client.name,
          assignationId: updatedTemplate.id,
        });
      }
    });
  }
  return {
    status: "ok",
    message: {
      title: params.startNow
        ? "Template assigned successfully"
        : "Template assignation saved as draft",
      description: `The template "${updatedTemplate.name}" has been assigned to the client "${client.name}".`,
    },
    data: {
      template: updatedTemplate,
      url: url,
    },
  };
};
