"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";
import { ServerActionResponse } from "@/hooks/use-server-action";
import { markQuickStartActionComplete } from "../quick-start/mark-quick-start-action-complete";

export const setSelectedFolderAction = async (
  folderId: string,
  folderName: string,
): Promise<ServerActionResponse<{ folderId: string; folderName: string }>> => {
  const user = await getUserFromSession();

  const driveAccount = await prisma.googleDriveAccount.findUnique({
    where: { userId: user?.id },
  });

  if (!driveAccount) {
    return {
      status: "error",
      message: {
        title: "Google Drive account not found",
        description: "Please connect your Google Drive account first",
      },
      data: null,
    };
  }

  await prisma.googleDriveAccount.update({
    where: { userId: user?.id },
    data: {
      folderId,
      folderName,
    },
  });

  markQuickStartActionComplete(user.id, "connectedGoogleDrive");
  return {
    status: "ok",
    message: {
      title: "Folder selected",
      description: `You have selected the folder "${folderName}"`,
    },
    data: { folderId, folderName },
  };
};
