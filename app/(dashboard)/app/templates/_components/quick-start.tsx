"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    title: "Create your first template",
    icon: FilePlus,
  },
  {
    title: "Add your first client",
    icon: UserPlus,
  },
  {
    title: "Connect Google Drive",
    icon: HardDrive,
  },
  {
    title: "Create a document request",
    icon: ClipboardPlus,
  },
  {
    title: "Send your first request",
    icon: Send,
  },
];
export const QuickStart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickStartActions.map((action, index) => (
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
            <CircleCheck className="w-5 h-5 opacity-20" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
