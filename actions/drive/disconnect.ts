"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { getUserFromSession } from "../account/account";
import { prisma } from "@/lib/prisma";

export const disconnectGoogleDriveAction = async (): Promise<
  ServerActionResponse<void>
> => {
  const user = await getUserFromSession();

  await prisma.googleDriveAccount.deleteMany({
    where: {
      userId: user?.id,
    },
  });

  return {
    status: "ok",
    message: {
      title: "Google Drive disconnected",
      description:
        "Your Google Drive account has been disconnected successfully.",
    },
    requireRefresh: true,
    data: null,
  };
};
