import { after } from "next/server";
import { prisma } from "@/lib/prisma";

export type QuickStartActionKey =
  | "createdFirstTemplate"
  | "addedFirstClient"
  | "connectedGoogleDrive"
  | "createdDocumentRequest"
  | "sentFirstRequest";

/**
 * Schedules (via Next.js `after`) the completion of a quick start action for
 * the given user. This is intentionally deferred so the DB write never blocks
 * the server action / route handler response.
 */
export const markQuickStartActionComplete = (
  userId: string,
  action: QuickStartActionKey,
) => {
  after(async () => {
    try {
      await prisma.userQuickStartActions.upsert({
        where: { userId },
        update: { [action]: true },
        create: { userId, [action]: true },
      });
    } catch (error) {
      console.error(
        `Failed to mark quick start action "${action}" complete:`,
        error,
      );
    }
  });
};
