"use client";

import { deleteClientAction } from "@/actions/clients/delete-client";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { useAddClientSheet } from "@/components/modals/add-client-sheet/use-add-client-sheet";
import { requireConfirmation } from "@/components/modals/confirmation-modal/use-confirmation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useServerAction } from "@/hooks/use-server-action";
import { ClientGetPayload } from "@/lib/generated/prisma/models";
import {
  Copy,
  Edit2,
  ExternalLink,
  Plus,
  Trash,
  UserPlus,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAssignWorkflowToClientSheet } from "@/components/modals/assign-workflow-to-client-sheet/use-assign-workflow-to-client-sheet";

export const ClientsTable: React.FC<{
  initialClients: ClientGetPayload<{
    include: {
      templateClientAssignations: {
        include: { template: { select: { totalFields: true; name: true } } };
      };
    };
  }>[];
}> = ({ initialClients }) => {
  const { openSheet: openAssignWorkflowSheet } =
    useAssignWorkflowToClientSheet();
  const { openDialog } = useAddClientSheet();
  const [clients, setClients] = useState<
    ClientGetPayload<{
      include: {
        templateClientAssignations: {
          include: { template: { select: { totalFields: true; name: true } } };
        };
      };
    }>[]
  >(initialClients);
  const { call: callDeleteClient } = useServerAction(deleteClientAction);

  const handleDeleteClient = async (clientId: string) => {
    const confirmation = await requireConfirmation({
      title: "Delete Client",
      subtitle:
        "Are you sure you want to delete this client? All this client's workflows will be canceled. This action cannot be undone.",
    }).promise;

    if (confirmation) {
      const res = await callDeleteClient(clientId);

      if (res) {
        setClients((prev) => prev.filter((c) => c.id !== clientId));
      }
    }
  };
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Clients"
        description="Manage your clients"
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => openAssignWorkflowSheet()}
              variant="secondary"
            >
              <Plus /> New Request
            </Button>
            <Button
              onClick={() =>
                openDialog({
                  cb: (c) =>
                    setClients((prev) => [
                      ...prev,
                      { ...c, templateClientAssignations: [] },
                    ]),
                })
              }
            >
              <UserPlus /> Add Client
            </Button>
          </div>
        }
      />
      <Card className="gap-0 py-0">
        {!clients.length && (
          <Empty className="">
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <UserX />
              </EmptyMedia>
              <EmptyTitle>No Clients</EmptyTitle>
              <EmptyDescription>
                You haven't added any clients yet. Add your first client to get
                started.
              </EmptyDescription>
              <EmptyContent>
                <Button
                  onClick={() =>
                    openDialog({
                      cb: (c) =>
                        setClients((prev) =>
                          prev.some((x) => x.id === c.id)
                            ? prev.map((x) =>
                                x.id === c.id
                                  ? { ...c, templateClientAssignations: [] }
                                  : x,
                              )
                            : [
                                ...prev,
                                { ...c, templateClientAssignations: [] },
                              ],
                        ),
                    })
                  }
                >
                  <UserPlus /> Add Client
                </Button>
              </EmptyContent>
            </EmptyHeader>
          </Empty>
        )}
        {!!clients.length && (
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Client</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="text-center">Requests</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => {
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <Avatar size="sm">
                            <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
                              {c.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {c.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {c.company}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {c.email}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        {c.phone}
                      </TableCell>
                      <TableCell className="text-center text-sm tabular-nums">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <span className="cursor-pointer hover:underline transition-colors inline-block">
                              {
                                c.templateClientAssignations.filter(
                                  (x) => x.status === "COMPLETED",
                                ).length
                              }{" "}
                              / {c.templateClientAssignations.length}
                            </span>
                          </HoverCardTrigger>

                          <HoverCardContent className="w-80 space-y-2">
                            <div className="text-sm font-medium text-foreground">
                              Requests in progress
                            </div>
                            {c.templateClientAssignations
                              .filter(
                                (x) =>
                                  x.status === "IN_PROGRESS" ||
                                  x.status === "OVERDUE",
                              )
                              .map((assignment) => (
                                <div className="gap-2" key={assignment.id}>
                                  <div className="flex items-center justify-between gap-2">
                                    <div>
                                      <div className="text-sm font-medium text-foreground">
                                        {assignment.name ||
                                          assignment.template.name}
                                      </div>
                                      <span className="text-foreground text-xs tabular-nums">
                                        {assignment.completedFieldsCount} /{" "}
                                        {assignment.template.totalFields}{" "}
                                        uploaded (
                                        {Math.round(
                                          (assignment.completedFieldsCount /
                                            assignment.template.totalFields ||
                                            1) * 100,
                                        )}
                                        %)
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-1.5 pt-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toast.success(
                                                "Upload link copied",
                                              );
                                              if (c.id) {
                                                navigator.clipboard.writeText(
                                                  `${window.location.origin}/client-portal/${assignment.id}`,
                                                );
                                              }
                                            }}
                                          >
                                            <Copy className="h-3.5 w-3.5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Copy client portal URL
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              window.open(
                                                `${window.location.origin}/client-portal/${assignment.id}`,
                                                "_blank",
                                              );
                                            }}
                                          >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Open client portal
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <Progress
                                    value={
                                      (assignment.completedFieldsCount /
                                        assignment.template.totalFields || 1) *
                                      100
                                    }
                                    className="h-2 mt-1"
                                  />
                                </div>
                              ))}
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            true
                              ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {true ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                openAssignWorkflowSheet({
                                  initialClientId: c.id,
                                })
                              }
                            >
                              <Plus />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Create new documents request
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                openDialog({
                                  editClient: c,
                                  cb: (c) =>
                                    setClients((prev) =>
                                      prev.some((x) => x.id === c.id)
                                        ? prev.map((x) =>
                                            x.id === c.id
                                              ? {
                                                  ...c,
                                                  templateClientAssignations:
                                                    [],
                                                }
                                              : x,
                                          )
                                        : [
                                            ...prev,
                                            {
                                              ...c,
                                              templateClientAssignations: [],
                                            },
                                          ],
                                    ),
                                })
                              }
                            >
                              <Edit2 />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit client details </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteClient(c.id)}
                            >
                              <Trash />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete client</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
