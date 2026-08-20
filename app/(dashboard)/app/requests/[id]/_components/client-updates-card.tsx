import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { prisma } from "@/lib/prisma";
import { ArrowRight, MegaphoneOff } from "lucide-react";
import { ActivityLog } from "@/lib/generated/prisma/browser";

interface ClientUpdatesCardContentProps {
  updates: ActivityLog[];
}

const ClientUpdatesCardContent = ({
  updates,
}: ClientUpdatesCardContentProps) => {
  return (
    <Card className="h-min">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Client updates</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"secondary"} size={"xs"}>
              View All <ArrowRight />
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-2xl">
            <DialogHeader>
              <DialogTitle>All Client Updates</DialogTitle>
              <DialogDescription>
                A complete history of all client updates for this assignment
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96 w-full">
              <div className="pl-4 relative">
                {!updates.length ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={"icon"}>
                        <MegaphoneOff />
                      </EmptyMedia>
                      <EmptyTitle>No updates</EmptyTitle>
                      <EmptyDescription>
                        No client updates found
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <>
                    {updates.length > 0 && (
                      <span
                        className="absolute top-3 bottom-2 left-1 w-px bg-border"
                        aria-hidden
                      />
                    )}
                    {updates.map((item, index) => (
                      <div
                        key={index}
                        className="relative flex justify-between items-center gap-2 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <span
                          className="absolute top-[16px] -left-[15.5px] size-2 rounded-full ring-4 ring-background bg-primary"
                          aria-hidden
                        />
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground text-nowrap">
                          {item.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="pl-4 relative">
          {!updates.length && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                  <MegaphoneOff />
                </EmptyMedia>
                <EmptyTitle>No recent activity</EmptyTitle>
                <EmptyDescription>
                  Recent activity will appear here once you start sending
                  requests to your clients.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          {!!updates.length && (
            <span
              className="absolute top-2 bottom-2 left-1 w-px bg-border"
              aria-hidden
            />
          )}
          {updates.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="relative flex justify-between items-center gap-2 p-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const ClientUpdatesCard = async ({
  assignationId,
  userId,
}: {
  userId: string;
  assignationId: string;
}) => {
  const updates = await prisma.activityLog.findMany({
    where: {
      assignationId: assignationId,
      userId: userId,
      type: "CLIENT_FIELD_UPDATE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ClientUpdatesCardContent updates={updates} />;
};
