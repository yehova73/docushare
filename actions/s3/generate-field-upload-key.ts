"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import type { GenerateUploadKeyResponse } from "@/hooks/use-s3-upload";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";

export const generateFieldUploadKeyAction = async (
  fieldId: string,
): Promise<ServerActionResponse<GenerateUploadKeyResponse>> => {
  try {
    // Fetch the FieldCompletionValue with its related assignation and template
    const field = await prisma.templateField.findUnique({
      where: {
        id: fieldId,
      },
      include: {
        section: {
          include: {
            template: {
              select: { id: true, userId: true },
            },
          },
        },
      },
    });

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

    // Generate the S3 key: userId/assignationId/fieldCompletionValueId
    const s3Key = `${field.section.template.userId}/${field.section.template.id}/${field.id}`;

    return {
      status: "ok",
      data: {
        s3Key,
      },
    };
  } catch (error) {
    console.error("Failed to generate upload key:", error);
    return {
      status: "error",
      message: {
        title: "Failed to generate upload key",
        description: "An error occurred while generating the upload key",
      },
      data: null,
    };
  }
};
