"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { FieldCompletionValueGetPayload } from "@/lib/generated/prisma/models";
import { deleteFileFromS3 } from "../s3";
import { after } from "next/server";
import { updateAssignedTemplateCompletion } from "../save-field-value";
import { getValidDriveAccessToken } from "../drive/get-valid-drive-access-token";
import { updateSpreadsheetFieldValue } from "../drive/spreeadsheet/update-spreadsheet-field-value";

export interface ReplaceFieldFileParams {
  fileId: string;
  fieldId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
}

export const replaceFieldFileAction = async (
  params: ReplaceFieldFileParams,
): Promise<
  ServerActionResponse<
    FieldCompletionValueGetPayload<{ include: { files: true } }>
  >
> => {
  try {
    // Fetch the existing file with its related field and template
    const file = await prisma.file.findUnique({
      where: {
        id: params.fileId,
      },
      include: {
        fieldCompletionValue: {
          include: {
            field: {
              include: {
                section: {
                  include: {
                    template: {
                      include: {
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
            },
          },
        },
      },
    });

    if (!file) {
      return {
        status: "error",
        message: {
          title: "File not found",
          description: "The file you are trying to replace does not exist",
        },
        data: null,
      };
    }

    const field = file.fieldCompletionValue?.field;
    const assignation = field?.section.template.templateClientAssignation;
    const userId = field?.section.template.userId;
    const oldS3Key = file.s3Key;

    if (!assignation) {
      return {
        status: "error",
        message: {
          title: "Assignation not found",
          description:
            "The file's template does not have an associated assignation",
        },
        data: null,
      };
    }

    // Save the new params on the existing File entry
    await prisma.file.update({
      where: {
        id: params.fileId,
      },
      data: {
        fileName: params.fileName,
        fileType: params.fileType,
        fileSize: params.fileSize,
        s3Key: params.s3Key,
      },
    });

    // Delete the old file from S3 after the DB record has been updated
    if (oldS3Key && oldS3Key !== params.s3Key) {
      const s3Result = await deleteFileFromS3(oldS3Key);
      if (!s3Result.success) {
        console.error("Failed to delete old file from S3:", oldS3Key);
      }
    }

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
          assignationId: assignation.id,
          fieldCompletionValueId: res?.id,
          title: `${field?.name} file replaced by ${assignation.client.name || "Client"}`,
          description: `File "${params.fileName}" has replaced "${file.fileName}" for the field "${field?.name}"`,
          type: "CLIENT_FIELD_UPDATE",
        },
      });
    }

    after(async () => {
      if (assignation.id) {
        await updateAssignedTemplateCompletion(assignation.id);
      }

      if (!userId) return;
      const googleDriveAccount = await prisma.googleDriveAccount.findUnique({
        where: { userId: userId },
      });
      if (!googleDriveAccount) {
        console.warn("No Google Drive account found for user:", userId);
        return;
      }
      const spreadsheetId = assignation.spreadsheetId;
      if (!spreadsheetId) {
        console.warn(
          "No spreadsheet ID found for assignation:",
          assignation.id,
        );
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

      await updateSpreadsheetFieldValue({
        spreadsheetId: spreadsheetId || undefined,
        accessToken: accessToken,
        requestId: assignation.id || "",
        columnName: field?.name || "",
        newValue: res?.files.map((f) => f.s3Key).join(", ") || "",
        parentFolderId: assignation.templateFolderId || undefined,
      });
    });

    return {
      status: "ok",
      message: {
        title: "File replaced successfully",
        description: `"${params.fileName}" has replaced "${file.fileName}" successfully`,
      },
      data: res,
    };
  } catch (error) {
    console.error("Failed to replace file:", error);
    return {
      status: "error",
      message: {
        title: "Failed to replace file",
        description: "An error occurred while replacing the file",
      },
      data: null,
    };
  }
};
