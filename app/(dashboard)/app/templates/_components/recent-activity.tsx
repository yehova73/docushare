import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { prisma } from "@/lib/prisma";
import { MegaphoneOff } from "lucide-react";
import Link from "next/link";

export const RecentActivity: React.FC<{ userId: string }> = async ({
  userId,
}) => {
  const lastActivity = await prisma.activityLog.findMany({
    where: {
      userId: userId,
      OR: [
        { assignationId: { not: null } },
        { fieldCompletionValueId: { not: null } },
        { reminderId: { not: null } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });

  return (
    <div className="pl-4 relative">
      {!lastActivity.length && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <MegaphoneOff />
            </EmptyMedia>
            <EmptyTitle>No recent activity</EmptyTitle>
            <EmptyDescription>
              Recent activity will appear here once you start sending requests
              to your clients.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!!lastActivity.length && (
        <span
          className="absolute top-2 bottom-2 left-1 w-px bg-border"
          aria-hidden
        />
      )}
      {lastActivity.slice(0, 7).map((item, index) => (
        <div key={index}>
          <Link href={`/app/requests/${item.assignationId}`} passHref>
            <div className="relative flex justify-between items-center gap-2 p-1 rounded-md hover:bg-muted transition-colors cursor-pointer">
              <span
                className="absolute top-[10px] -left-[15.5px] size-2 rounded-full ring-4 ring-background bg-primary "
                aria-hidden
              />
              <div>
                <div className="font-semibold line-clamp-1">{item.title}</div>
              </div>
              <div className="text-sm text-muted-foreground text-nowrap">
                {item.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
