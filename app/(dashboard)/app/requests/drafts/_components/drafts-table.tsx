"use client";

import { getAssignationDraftsAction } from "@/actions/assign-template/drafts/get-assignation-drafts";
import { deleteAssignationDraftAction } from "@/actions/assign-template/drafts/delete-assignation-draft";
import type { AssignationDraftListItem } from "@/actions/assign-template/drafts/get-assignation-drafts";
import { requireConfirmation } from "@/components/modals/confirmation-modal/use-confirmation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
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
import useServerAction from "@/hooks/use-server-action";
import { NEW_ASSIGNATION_STEPS } from "@/app/(dashboard)/app/new-assignation/_components/new-assignation-context";
import {
  ArrowRight,
  CalendarClock,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getInitials } from "@/lib/utils";

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatDateTime = (date: Date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function ClientCell({ draft }: { draft: AssignationDraftListItem }) {
  const clients = draft.clients;
  const total = clients.length;

  if (total === 0) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  // Single client: render inline with avatar + name.
  if (total === 1) {
    const client = clients[0].client;
    return (
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
            {getInitials(client.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{client.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {client.email || client.company || "No contact info"}
          </div>
        </div>
      </div>
    );
  }

  // Multiple clients: show a compact avatar stack + hover card with full list.
  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="flex items-center -space-x-2 cursor-pointer"
          aria-label={`${total} clients`}
        >
          {clients.slice(0, 3).map(({ client }) => (
            <Avatar
              key={client.id}
              size="sm"
              className="ring-2 ring-background"
            >
              <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
          ))}
          <span className="ml-3 text-sm font-medium text-foreground">
            {total} clients
          </span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="start">
        <div className="border-b border-border px-3 py-2">
          <p className="text-sm font-medium">{total} clients</p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {clients.map(({ client, dueDate }) => (
            <div
              key={client.id}
              className="flex items-center gap-2 border-b border-border/60 px-3 py-2 last:border-b-0"
            >
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">
                  {client.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {client.email || client.company || "No contact info"}
                </div>
              </div>
              {dueDate && (
                <span className="text-xs text-muted-foreground">
                  due {formatDate(dueDate)}
                </span>
              )}
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export const DraftsTable: React.FC<{
  search?: string;
  clientIds?: string[];
}> = ({ search = "", clientIds = [] }) => {
  const router = useRouter();
  const { call: deleteDraft, loading: deletingDraft } = useServerAction(
    deleteAssignationDraftAction,
  );

  const [drafts, setDrafts] = useState<AssignationDraftListItem[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAssignationDraftsAction({ search, clientIds }).then((res) => {
      if (cancelled) return;
      if (res?.status === "ok" && res.data) {
        setDrafts(res.data.drafts);
      }
      setLoadingDrafts(false);
    });
    return () => {
      cancelled = true;
    };
  }, [search, clientIds]);

  const handleDelete = async (draft: AssignationDraftListItem) => {
    const confirmation = requireConfirmation({
      title: "Delete draft?",
      subtitle: `This will permanently delete the draft for "${draft.template?.name ?? "no template"}" with ${draft.clients.length} client${draft.clients.length === 1 ? "" : "s"}. This action cannot be undone.`,
      buttons: {
        isSuccess: false,
        confirm: "Delete draft",
        cancel: "Keep draft",
      },
    });
    const confirmed = await confirmation.promise;
    if (!confirmed) return;

    setDeletingId(draft.id);
    try {
      const res = await deleteDraft(draft.id);
      if (res?.id) {
        setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleContinue = (draft: AssignationDraftListItem) => {
    router.push(`/app/new-assignation?draftId=${draft.id}`);
  };

  const stepLabel = (step: number) =>
    NEW_ASSIGNATION_STEPS[step]?.label ?? `Step ${step + 1}`;

  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          {loadingDrafts ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-muted-foreground">Loading drafts...</p>
            </div>
          ) : drafts.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CalendarClock />
                </EmptyMedia>
                <EmptyTitle>No drafts yet</EmptyTitle>
                <EmptyDescription>
                  Drafts you start from the assignation wizard will show up here
                  so you can pick up where you left off.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Clients</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead className="hidden md:table-cell">Step</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Updated
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drafts.map((draft) => (
                  <TableRow key={draft.id}>
                    <TableCell className="pl-4">
                      <ClientCell draft={draft} />
                    </TableCell>
                    <TableCell>
                      {draft.template ? (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">
                              {draft.template.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          No template
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex w-36 flex-col gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          {stepLabel(draft.currentStep)}
                        </span>
                        <Progress
                          value={
                            ((draft.currentStep + 1) /
                              NEW_ASSIGNATION_STEPS.length) *
                            100
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {formatDateTime(draft.updatedAt)}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {formatDate(draft.createdAt)}
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Delete draft"
                          onClick={() => handleDelete(draft)}
                          disabled={deletingDraft && deletingId === draft.id}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          {deletingDraft && deletingId === draft.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleContinue(draft)}
                          disabled={deletingDraft && deletingId === draft.id}
                        >
                          Continue <ArrowRight />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
