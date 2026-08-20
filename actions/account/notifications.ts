"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "./account";
import { UserNotificationSettings } from "@/lib/generated/prisma/browser";
import { ServerActionResponse } from "@/hooks/use-server-action";

export const updateUserNotificationSettingsAction = async (
  input: Partial<
    Pick<
      UserNotificationSettings,
      "devUpdates" | "importantNotifications" | "marketingEmails"
    >
  >,
): Promise<ServerActionResponse<UserNotificationSettings>> => {
  const user = await getUserFromSession();
  const settings = await prisma.userNotificationSettings.findFirst({
    where: { userId: user!.id },
  });
  if (!settings) {
    const data = await prisma.userNotificationSettings.create({
      data: {
        ...input,
        userId: user!.id,
      },
    });

    return {
      status: "ok",
      requireRefresh: false,
      message: {
        title: "Notification Settings Updated",
        description:
          "Your notification settings have been updated successfully.",
      },
      data,
    };
  }
  const data = await prisma.userNotificationSettings.update({
    where: { id: settings.id },
    data: {
      ...input,
      userId: user!.id,
    },
  });

  return {
    status: "ok",
    requireRefresh: false,
    message: {
      title: "Notification Settings Updated",
      description: "Your notification settings have been updated successfully.",
    },
    data,
  };
};
