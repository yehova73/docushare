"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "./account/account";
import { FieldCompletionValue } from "@/lib/generated/prisma/client";
import { after } from "next/server";
import { updateSpreadsheetFieldValue } from "./drive/spreeadsheet/update-spreadsheet-field-value";
import { getValidDriveAccessToken } from "./drive/get-valid-drive-access-token";

export const saveFieldValueAction = async (
  fieldId: string,
  assignationId: string,
  value: string | null,
): Promise<ServerActionResponse<FieldCompletionValue>> => {
  try {
    // Verify user has access to this assignation (through template ownership)
    const assignation = await prisma.templateClientAssignation.findUnique({
      where: { id: assignationId },
      include: {
        client: true,
        template: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    const user = assignation?.template.user;

    if (!assignation || !user) {
      return {
        status: "error",
        message: {
          title: "Assignation not found",
          description: "The assignation you're trying to update doesn't exist",
        },
        data: null,
      };
    }

    // Verify the template belongs to the user
    if (!user || assignation.template.userId !== user.id) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "You don't have permission to update this field",
        },
        data: null,
      };
    }

    // Verify the field belongs to the template
    const field = await prisma.templateField.findUnique({
      where: { id: fieldId },
      include: {
        section: true,
      },
    });

    if (!field) {
      return {
        status: "error",
        message: {
          title: "Field not found",
          description: "The field you're trying to update doesn't exist",
        },
        data: null,
      };
    }

    if (field.section.templateId !== assignation.templateId) {
      return {
        status: "error",
        message: {
          title: "Invalid field",
          description: "The field doesn't belong to this template",
        },
        data: null,
      };
    }

    const existingCompletionValue = await prisma.fieldCompletionValue.findFirst(
      {
        where: {
          fieldId,
          assignationId,
          value: {
            not: null,
          },
        },
        select: { id: true },
      },
    );

    if (user.id) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          assignationId: assignationId,
          fieldCompletionValueId: existingCompletionValue?.id,
          title: value
            ? existingCompletionValue
              ? `${field.name} field updated by ${assignation.client.name || "Client"}`
              : `${field.name} field added by ${assignation.client.name || "Client"}`
            : `${field.name} field cleared by ${assignation.client.name || "Client"}`,
          description: value
            ? existingCompletionValue
              ? `Response for field "${field.name}" has been updated successfully`
              : `Response for field "${field.name}" has been added successfully`
            : `Response for field "${field.name}" has been cleared successfully`,
          type: "CLIENT_FIELD_UPDATE",
        },
      });
    }
    // Upsert the field completion value
    const completionValue = await prisma.fieldCompletionValue.upsert({
      where: {
        fieldId_assignationId: {
          fieldId,
          assignationId,
        },
      },
      update: {
        value,
      },
      create: {
        fieldId,
        assignationId,
        value,
      },
    });

    after(async () => {
      await updateAssignedTemplateCompletion(assignationId);

      const googleDriveAccount = await prisma.googleDriveAccount.findUnique({
        where: { userId: user.id },
      });
      if (!googleDriveAccount) {
        console.warn("No Google Drive account found for user:", user.id);
        return;
      }
      const spreadsheetId = assignation.spreadsheetId;
      if (!spreadsheetId) {
        console.warn("No spreadsheet ID found for assignation:", assignationId);
        return;
      }
      const accessToken = await getValidDriveAccessToken();
      if (!accessToken) {
        console.warn(
          "No valid Google Drive access token found for user:",
          user.id,
        );
        return;
      }

      await updateSpreadsheetFieldValue({
        spreadsheetId: assignation.spreadsheetId || undefined,
        accessToken: accessToken,
        requestId: assignationId,
        columnName: field.name,
        newValue: value,
        parentFolderId: assignation?.templateFolderId || undefined,
      });
    });
    return {
      status: "ok",
      message: {
        title: "Field saved",
        description: "Your information has been saved successfully",
      },
      data: completionValue,
    };
  } catch (error) {
    console.error("Error saving field value:", error);
    return {
      status: "error",
      message: {
        title: "Error saving field",
        description: "An error occurred while saving your information",
      },
      data: null,
    };
  }
};

export const updateAssignedTemplateCompletion = async (
  assignationId: string,
): Promise<ServerActionResponse<{ id: string }>> => {
  const completedFields = await prisma.fieldCompletionValue.count({
    where: {
      assignationId,
      OR: [{ value: { not: null } }, { files: { some: {} } }],
    },
  });

  const completedSections = await prisma.templateSection.count({
    where: {
      template: {
        templateClientAssignation: {
          id: assignationId,
        },
      },
      fields: {
        every: {
          completionValue: {
            OR: [{ value: { not: null } }, { files: { some: {} } }],
          },
        },
      },
    },
  });

  const lastActivity = await prisma.fieldCompletionValue.aggregate({
    where: {
      assignationId,
    },
    _max: {
      updatedAt: true,
    },
  });

  const hasUnfinishedRequiredFields = await prisma.templateField.count({
    where: {
      section: {
        template: {
          templateClientAssignation: {
            id: assignationId,
          },
        },
      },
      required: true,
      OR: [
        {
          type: { in: ["TEXT", "NUMBER", "EMAIL", "PHONE", "TEXTAREA", "URL"] },
          OR: [
            { completionValue: null },
            {
              completionValue: {
                value: null,
              },
            },
          ],
        },
        {
          type: { in: ["IMAGE", "FILE"] },
          OR: [
            { completionValue: null },
            {
              completionValue: {
                files: { none: {} },
              },
            },
          ],
        },
      ],
    },
  });

  await prisma.templateClientAssignation.update({
    where: { id: assignationId },
    data: {
      completedFieldsCount: completedFields,
      completedSectionsCount: completedSections,

      lastActivityAt: lastActivity._max.updatedAt || null,
      ...(!hasUnfinishedRequiredFields &&
      completedFields > 0 &&
      completedSections > 0
        ? { completedAt: new Date(), status: "COMPLETED" }
        : { completedAt: null, status: "IN_PROGRESS" }),
    },
  });

  return {
    status: "ok",
  };
};
