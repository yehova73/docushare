import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  CircleCheck,
  ClipboardPlus,
  FilePlus,
  HardDrive,
  Send,
  UserPlus,
} from "lucide-react";

const quickStartActions = [
  {
    key: "createdFirstTemplate",
    title: "Create your first template",
    icon: FilePlus,
  },
  {
    key: "addedFirstClient",
    title: "Add your first client",
    icon: UserPlus,
  },
  {
    key: "connectedGoogleDrive",
    title: "Connect Google Drive",
    icon: HardDrive,
  },
  {
    key: "createdDocumentRequest",
    title: "Create a document request",
    icon: ClipboardPlus,
  },
  {
    key: "sentFirstRequest",
    title: "Send your first request",
    icon: Send,
  },
] as const;

type QuickStartActionKey = (typeof quickStartActions)[number]["key"];

export const QuickStart: React.FC<{ userId: string }> = async ({ userId }) => {
  const quickStartActionsState = await prisma.userQuickStartActions.findUnique({
    where: { userId },
  });

  const isCompleted = (key: QuickStartActionKey) =>
    quickStartActionsState?.[key] ?? false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickStartActions.map((action, index) => {
          const completed = isCompleted(action.key);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent hover:cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <action.icon className="w-4 h-4" />
                <div>
                  <div className="font-semibold text-sm">{action.title}</div>
                </div>
              </div>
              <CircleCheck
                className={`w-5 h-5 ${
                  completed ? "text-green-500" : "opacity-20"
                }`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
