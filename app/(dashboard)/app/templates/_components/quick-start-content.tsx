"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CircleCheck,
  ClipboardPlus,
  FilePlus,
  HardDrive,
  Send,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useAddClientSheet } from "@/components/modals/add-client-sheet/use-add-client-sheet";
import { useNewTemplateSheet } from "@/components/modals/new-template-sheet/use-new-template-sheet";

const quickStartActions = [
  {
    key: "createdFirstTemplate",
    title: "Create your first template",
    icon: FilePlus,
    link: "?action=add-template",
    action: "add-template",
  },
  {
    key: "addedFirstClient",
    title: "Add your first client",
    icon: UserPlus,
    link: "?action=add-client",
    action: "add-client",
  },
  {
    key: "connectedGoogleDrive",
    title: "Connect Google Drive",
    icon: HardDrive,
    link: "/app/settings#drive",
  },
  {
    key: "createdDocumentRequest",
    title: "Create a document request",
    icon: ClipboardPlus,
    link: "/app/new-assignation",
  },
  {
    key: "sentFirstRequest",
    title: "Send your first request",
    icon: Send,
    link: "/app/new-assignation",
  },
] as const;

type QuickStartActionKey = (typeof quickStartActions)[number]["key"];

interface QuickStartContentProps {
  completedActions: Record<QuickStartActionKey, boolean>;
}

export const QuickStartContent: React.FC<QuickStartContentProps> = ({
  completedActions,
}) => {
  const { openDialog: openTemplateDialog } = useNewTemplateSheet();
  const { openDialog: openClientDialog } = useAddClientSheet();

  const isCompleted = (key: QuickStartActionKey) =>
    completedActions[key] ?? false;

  const handleActionClick = (
    e: React.MouseEvent,
    action: (typeof quickStartActions)[number],
  ) => {
    if ((action as any).action === "add-template") {
      e.preventDefault();
      openTemplateDialog();
    } else if ((action as any).action === "add-client") {
      e.preventDefault();
      openClientDialog({});
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickStartActions.map((action, index) => {
          const completed = isCompleted(action.key);
          const hasCustomAction =
            (action as any).action === "add-template" ||
            (action as any).action === "add-client";

          const content = (
            <div
              className={cn(
                "flex items-center justify-between p-2 border rounded-lg transition-colors",
                !completed && "hover:bg-accent cursor-pointer",
              )}
              onClick={(e) =>
                !completed && hasCustomAction && handleActionClick(e, action)
              }
            >
              <div
                className={cn(
                  "flex items-center gap-2",
                  completed && "opacity-50",
                )}
              >
                <action.icon className="w-4 h-4" />
                <div>
                  <div className="font-semibold text-sm">{action.title}</div>
                </div>
              </div>
              <CircleCheck
                className={`w-5 h-5 ${
                  completed ? "text-success" : "opacity-20"
                }`}
              />
            </div>
          );

          if (hasCustomAction) {
            return <React.Fragment key={action.key}>{content}</React.Fragment>;
          }

          return (
            <Link key={action.key} href={action.link ?? "#"} passHref>
              {content}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
};
