"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";
import { File } from "@/lib/generated/prisma/client";
import { FieldCompletionValue } from "@/lib/generated/prisma/browser";
import { FieldCompletionValueGetPayload } from "@/lib/generated/prisma/models";
import { after } from "next/server";
import { updateAssignedTemplateCompletion } from "../save-field-value";
import { getValidDriveAccessToken } from "../drive/get-valid-drive-access-token";
import { updateSpreadsheetFieldValueV2 } from "../drive/spreeadsheet/update-spreadsheet-field-value-v2";

export interface CompleteUploadParams {
  fieldId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
}

export const completeFieldUploadAction = async (
  params: CompleteUploadParams,
): Promise<
  ServerActionResponse<
    FieldCompletionValueGetPayload<{ include: { files: true } }>
  >
> => {
  try {
    // Fetch the FieldCompletionValue with its related assignation and template
    const field = await prisma.templateField.findUnique({
      where: {
        id: params.fieldId,
      },
      select: {
        completionValue: true,
        name: true,
        section: {
          select: {
            template: {
              select: {
                userId: true,
                templateClientAssignation: {
                  include: {
                    client: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const userId = field?.section.template.userId;

    if (!field) {
      return {
        status: "error",
        message: {
          title: "Field not found",
          description: "The field completion value does not exist",
        },
        data: null,
      };
    }

    if (!field.section.template.templateClientAssignation) {
      return {
        status: "error",
        message: {
          title: "Assignation not found",
          description:
            "The field's template does not have an associated assignation",
        },
        data: null,
      };
    }

    // Create the File entry and link it to the FieldCompletionValue
    const file = await prisma.file.create({
      data: {
        fileName: params.fileName,
        fileType: params.fileType,
        fileSize: params.fileSize,
        s3Key: params.s3Key,
        fieldCompletionValue: {
          connectOrCreate: {
            where: { fieldId: params.fieldId },
            create: {
              fieldId: params.fieldId,
              assignationId:
                field.section.template.templateClientAssignation.id,
            },
          },
        },
      },
    });

    const res = await prisma.fieldCompletionValue.findFirst({
      where: { fieldId: params.fieldId },
      include: {
        files: true,
      },
    });

    if (userId) {
      await prisma.activityLog.create({
        data: {
          userId: userId,
          assignationId: field.section.template.templateClientAssignation?.id,
          fieldCompletionValueId: res?.id,
          title: `${field.name} file uploaded by ${field.section.template.templateClientAssignation?.client.name || "Client"}`,
          description: `File "${params.fileName}" has been uploaded successfully for the field "${field.name}"`,
          type: "CLIENT_FIELD_UPDATE",
        },
      });
    }

    after(async () => {
      if (field.section.template.templateClientAssignation?.id) {
        await updateAssignedTemplateCompletion(
          field.section.template.templateClientAssignation?.id,
        );
      }

      if (!userId) return;
      const assignation = field.section.template.templateClientAssignation;
      if (!assignation?.templateFolderId || !assignation?.clientFolderId) {
        console.warn(
          "Drive folders not set up for assignation:",
          assignation?.id,
        );
        return;
      }
      const googleDriveAccount = await prisma.googleDriveAccount.findUnique({
        where: { userId: userId },
      });
      if (!googleDriveAccount) {
        console.warn("No Google Drive account found for user:", userId);
        return;
      }
      const accessToken = await getValidDriveAccessToken();
      if (!accessToken) {
        console.warn(
          "No valid Google Drive access token found for user:",
          userId,
        );
        return;
      }

      const result = await updateSpreadsheetFieldValueV2({
        spreadsheetId: assignation.spreadsheetId ?? undefined,
        clientSummaryFileId: assignation.clientSummaryFileId ?? undefined,
        accessToken,
        requestId: assignation.id,
        parentFolderId: assignation.templateFolderId,
        clientFolderId: assignation.clientFolderId,
      });

      if (
        result.spreadsheetId !== assignation.spreadsheetId ||
        result.clientSummaryFileId !== assignation.clientSummaryFileId
      ) {
        await prisma.templateClientAssignation.update({
          where: { id: assignation.id },
          data: {
            spreadsheetId: result.spreadsheetId,
            clientSummaryFileId: result.clientSummaryFileId,
          },
        });
      }
    });

    return {
      status: "ok",
      message: {
        title: "File uploaded successfully",
        description: `"${params.fileName}" has been uploaded successfully`,
      },
      data: res,
    };
  } catch (error) {
    console.error("Failed to complete upload:", error);
    return {
      status: "error",
      message: {
        title: "Failed to complete upload",
        description: "An error occurred while completing the file upload",
      },
      data: null,
    };
  }
};
