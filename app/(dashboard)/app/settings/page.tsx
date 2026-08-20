import { getUserFromSession } from "@/actions/account/account";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { prisma } from "@/lib/prisma";
import { SettingsView } from "./_components/settings-view";

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

  return (
    <SettingsView
      email={details?.email || ""}
      hasPassword={!!details?.password}
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
