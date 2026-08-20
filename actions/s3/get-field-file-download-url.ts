"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";
import { getPresignedDownloadUrl } from "../s3";

export interface GetFileDownloadUrlResponse {
  downloadUrl: string;
}

export const getFieldFileDownloadUrlAction = async (
  fileId: string,
): Promise<ServerActionResponse<GetFileDownloadUrlResponse>> => {
  try {
    // Fetch the file with its related field and template
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
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

    // Get presigned download URL from S3
    const s3Result = await getPresignedDownloadUrl(file.s3Key);

    if (!s3Result.success || !s3Result.downloadUrl) {
      return {
        status: "error",
        message: {
          title: "Failed to get download URL",
          description: "An error occurred while retrieving the download URL",
        },
        data: null,
      };
    }

    return {
      status: "ok",
      data: {
        downloadUrl: s3Result.downloadUrl,
      },
    };
  } catch (error) {
    console.error("Failed to get download URL:", error);
    return {
      status: "error",
      message: {
        title: "Failed to get download URL",
        description: "An error occurred while retrieving the download URL",
      },
      data: null,
    };
  }
};
