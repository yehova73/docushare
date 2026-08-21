import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { subDays } from "date-fns";
import { ArrowRight, FileX } from "lucide-react";
import Link from "next/link";
import { match } from "ts-pattern";

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
          <div className=" ml-auto flex items-center gap-2">
            {/* {request.status === "OVERDUE" ||
              (request.dueDate && request.dueDate < new Date() && (
                <Badge
                  className={cn("ml-auto", "bg-orange-900 text-orange-100")}
                >
                  {request.completedFieldsCount} / {request.totalFieldsCount}{" "}
                  fields completed
                </Badge>
              ))} */}
            <Badge
              className={cn(
                match(request)
                  .when(
                    (x) =>
                      x.status === "OVERDUE" ||
                      (x.dueDate && x.dueDate < new Date()),
                    () => "bg-red-900 text-red-100",
                  )
                  .when(
                    (x) => x.status === "COMPLETED",
                    () => "bg-green-900 text-green-100",
                  )
                  .otherwise(() => "bg-blue-900 text-blue-100"),
              )}
            >
              {request.status === "DRAFT"
                ? "Draft"
                : request.status === "COMPLETED"
                  ? `Completed ${request.completedAt?.toLocaleDateString()}`
                  : request.status === "OVERDUE" ||
                      (request.dueDate && request.dueDate < new Date())
                    ? `Overdue since ${request.dueDate?.toLocaleDateString()}`
                    : `Due ${request.dueDate?.toLocaleDateString()}`}
            </Badge>
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
