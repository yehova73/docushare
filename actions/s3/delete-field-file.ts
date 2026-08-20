"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";
import { deleteFileFromS3 } from "../s3";
import { updateAssignedTemplateCompletion } from "../save-field-value";
import { after } from "next/server";

export const deleteFieldFileAction = async (
  fileId: string,
): Promise<ServerActionResponse<{ success: boolean }>> => {
  try {
    // Fetch the file with its related field and template
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
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
          description: "The file does not exist",
        },
        data: null,
      };
    }

    if (!file.fieldCompletionValue?.field) {
      return {
        status: "error",
        message: {
          title: "Invalid file structure",
          description: "The file is not properly linked to a field",
        },
        data: null,
      };
    }

    const userId = file.fieldCompletionValue.field.section.template.userId;

    // Delete from S3
    const s3Result = await deleteFileFromS3(file.s3Key);

    if (!s3Result.success) {
      console.error(
        "Failed to delete from S3, but continuing with DB deletion",
      );
    }

    // Delete from database
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    if (userId) {
      await prisma.activityLog.create({
        data: {
          userId: userId,
          assignationId:
            file.fieldCompletionValue.field.section.template
              .templateClientAssignation?.id,
          fieldCompletionValueId: file.fieldCompletionValue?.id,
          title: `${file.fieldCompletionValue.field.name} file deleted by ${file.fieldCompletionValue.field.section.template.templateClientAssignation?.client.name || "Client"}`,
          description: `File "${file.fileName}" has been deleted successfully for the field "${file.fieldCompletionValue.field.name}"`,
          type: "CLIENT_FIELD_UPDATE",
        },
      });
    }

    after(async () => {
      if (
        file.fieldCompletionValue?.field.section.template
          .templateClientAssignation?.id
      ) {
        await updateAssignedTemplateCompletion(
          file.fieldCompletionValue.field.section.template
            .templateClientAssignation?.id,
        );
      }
    });

    return {
      status: "ok",
      message: {
        title: "File deleted successfully",
        description: `"${file.fileName}" has been deleted successfully`,
      },
      data: { success: true },
    };
  } catch (error) {
    console.error("Failed to delete file:", error);
    return {
      status: "error",
      message: {
        title: "Failed to delete file",
        description: "An error occurred while deleting the file",
      },
      data: null,
    };
  }
};
