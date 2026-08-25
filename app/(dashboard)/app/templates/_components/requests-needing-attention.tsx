import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { StatusBadge } from "@/components/ui/request-status-badge";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { ArrowRight, FileX } from "lucide-react";
import Link from "next/link";

export const RequestsNeedingAttention: React.FC<{ userId: string }> = async ({
  userId,
}) => {
  const requestsNeedingAttention =
    await prisma.templateClientAssignation.findMany({
      where: {
        template: { userId },
        OR: [
          { status: "OVERDUE" },
          { dueDate: { lt: new Date() } },
          {
            status: "COMPLETED",
            completedAt: { gte: subDays(new Date(), 7) },
          },
          {
            status: "DRAFT",
          },
        ],
      },
      include: {
        template: true,
        client: true,
      },
    });

  if (!requestsNeedingAttention || requestsNeedingAttention.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <FileX />
          </EmptyMedia>
          <EmptyTitle>No requests needing attention</EmptyTitle>
          <EmptyDescription>
            You have no requests that are overdue, recently completed, or in
            draft status.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <div className="space-y-2">
      {requestsNeedingAttention.map((request) => (
        <div
          key={request.id}
          className="flex rounded-md  bg-clip-padding font-sans text-sm font-medium border border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 w-full justify-start h-auto py-2 px-3 text-left"
        >
          <div>
            <div className="font-semibold">{request.client.name}</div>
            <div className="text-sm text-muted-foreground">
              {request.name || request.template.name}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <StatusBadge status={request.status} />
            <Link href={`/app/requests/${request.id}`} passHref>
              <Button size={"sm"}>
                View Request <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
