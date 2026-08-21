import { prisma } from "@/lib/prisma";
import { QuickStartContent } from "./quick-start-content";

export const QuickStart: React.FC<{ userId: string }> = async ({ userId }) => {
  const quickStartActionsState = await prisma.userQuickStartActions.findUnique({
    where: { userId },
  });

  const completedActions = {
    createdFirstTemplate: quickStartActionsState?.createdFirstTemplate ?? false,
    addedFirstClient: quickStartActionsState?.addedFirstClient ?? false,
    connectedGoogleDrive: quickStartActionsState?.connectedGoogleDrive ?? false,
    createdDocumentRequest:
      quickStartActionsState?.createdDocumentRequest ?? false,
    sentFirstRequest: quickStartActionsState?.sentFirstRequest ?? false,
  };

  if (Object.values(completedActions).every((completed) => completed)) {
    return null; // All actions completed, don't render the QuickStart component
  }
  return <QuickStartContent completedActions={completedActions} />;
};
