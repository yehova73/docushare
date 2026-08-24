import { getUserFromSession } from "@/actions/account/account";
import { prisma } from "@/lib/prisma";
import { SettingsView } from "./_components/settings-view";
import type { BrandingSettingsData } from "./_components/branding-settings";
import type { ReminderSettingsData } from "./_components/reminder-settings";

export default async function SettingsPage() {
  const user = await getUserFromSession();

  const details = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      email: true,
      password: true,
      googleDriveAccount: {
        select: {
          id: true,
          folderId: true,
          folderName: true,
          userEmail: true,
          userName: true,
          userPicture: true,
        },
      },
    },
  });

  const branding = await prisma.userBranding.findUnique({
    where: { userId: user.id },
    select: {
      name: true,
      logoUrl: true,
      logoKey: true,
      backgroundColor: true,
      headerFooterColor: true,
      primaryColor: true,
      fieldBackgroundColor: true,
      sectionCardBackgroundColor: true,
      sectionTitleColor: true,
      fieldTitleColor: true,
      fieldSubtitleColor: true,
      inputBackgroundColor: true,
      uploadBackgroundColor: true,
      borderRadius: true,
      titleTemplate: true,
      submittedMessage: true,
    },
  });

  const brandingData: BrandingSettingsData | undefined = branding
    ? {
        name: branding.name,
        logoUrl: branding.logoUrl,
        logoKey: branding.logoKey,
        backgroundColor: branding.backgroundColor,
        headerFooterColor: branding.headerFooterColor,
        primaryColor: branding.primaryColor,
        fieldBackgroundColor: branding.fieldBackgroundColor,
        sectionCardBackgroundColor: branding.sectionCardBackgroundColor,
        sectionTitleColor: branding.sectionTitleColor,
        fieldTitleColor: branding.fieldTitleColor,
        fieldSubtitleColor: branding.fieldSubtitleColor,
        inputBackgroundColor: branding.inputBackgroundColor,
        uploadBackgroundColor: branding.uploadBackgroundColor,
        borderRadius: branding.borderRadius,
        titleTemplate: branding.titleTemplate,
        submittedMessage: branding.submittedMessage,
      }
    : undefined;

  const reminderSettings = await prisma.userReminderSettings.findUnique({
    where: { userId: user.id },
    select: { senderName: true, sendingHour: true },
  });

  return (
    <SettingsView
      email={details?.email || ""}
      hasPassword={!!details?.password}
      branding={brandingData}
      reminderSettings={reminderSettings ?? undefined}
      drive={
        details?.googleDriveAccount
          ? {
              email: details.googleDriveAccount.userEmail || "",
              name: details.googleDriveAccount.userName || "",
              imageUrl: details.googleDriveAccount.userPicture || undefined,
              id: details.googleDriveAccount.id,
              folderId: details.googleDriveAccount.folderId || undefined,
              folderName: details.googleDriveAccount.folderName || undefined,
            }
          : undefined
      }
    />
  );
}
