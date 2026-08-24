"use client";

import { getRequests } from "@/actions/assign-template/get-requests";
import { revokeRequestAction } from "@/actions/assign-template/revoke-request";
import { requireConfirmation } from "@/components/modals/confirmation-modal/use-confirmation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/request-status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useServerAction from "@/hooks/use-server-action";
import { AssignedTemplateStatus } from "@/lib/generated/prisma/enums";
import { TemplateClientAssignationGetPayload } from "@/lib/generated/prisma/models";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Inbox,
  Link2,
  MoreHorizontal,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { RequestProgressCell } from "./request-progress-cell";

type RequestType = TemplateClientAssignationGetPayload<{
  include: { client: true; template: true };
}>;

export const RequestsTable: React.FC<{
  isOverview?: boolean;
  search?: string;
  clientIds?: string[];
  status?: AssignedTemplateStatus | "ALL";
}> = ({ isOverview, search = "", clientIds = [], status = "ALL" }) => {
  const [templateId, setTemplateId] = useState<string | undefined>();
  const [data, setData] = useState<RequestType[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const { call: callRevokeRequest } = useServerAction(revokeRequestAction);

  const router = useRouter();

  // Props may provide a new array instance on every render. Keep the fetch
  // dependencies stable when the actual client IDs have not changed.
  const clientIdsKey = clientIds.join(",");
  const stableClientIds = useMemo(() => clientIds, [clientIdsKey]);
  const filterSignature = `${search}||${status}||${clientIdsKey}`;
  const appliedFiltersRef = useRef(filterSignature);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRequests({
        page,
        limit,
        search,
        status,
        clientIds: stableClientIds,
        templateId,
      });
      setData(response.data);
      if (response.total !== undefined) {
        setTotal(response.total);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, status, stableClientIds, templateId]);

  // Fetch data whenever filters or pagination changes. When a filter changes,
  // restart from the first page instead of fetching with a stale page number.
  useEffect(() => {
    const filtersChanged = appliedFiltersRef.current !== filterSignature;
    appliedFiltersRef.current = filterSignature;

    if (filtersChanged && page !== 1) {
      setPage(1);
      return;
    }

    fetchData();
  }, [filterSignature, page, fetchData]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <Card className="gap-0 py-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-muted-foreground">
                Loading requests...
              </p>
            </div>
          ) : data.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Inbox />
                </EmptyMedia>
                <EmptyTitle>No requests found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search or filters.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              {!isOverview && (
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Client</TableHead>
                    <TableHead className="pl-4">Template</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Start date
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Last reminder
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Due date
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Last Activity
                    </TableHead>
                    <TableHead className="pr-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              )}
              <TableBody>
                {data.map((r) => {
                  return (
                    <TableRow
                      key={r.id}
                      onClick={() => router.push(`/app/requests/${r.id}`)}
                      className="cursor-pointer"
                    >
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-[11px] font-medium text-primary">
                              {r.client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {r.client.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {r.client.company}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pl-4">
                        <div>
                          <div className="font-medium text-foreground truncate max-w-[200px]">
                            {r.name || r.template.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {r.template.category || "No category"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <RequestProgressCell
                          assignationId={r.id}
                          completedFields={r.completedFieldsCount}
                          totalFields={r.totalFieldsCount}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {r.assignedAt
                          ? new Date(r.assignedAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        —
                      </TableCell>
                      <TableCell className="hidden text-sm md:table-cell">
                        {r.dueDate
                          ? new Date(r.dueDate).toLocaleDateString()
                          : "No due date"}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {r.lastActivityAt
                          ? new Date(r.lastActivityAt).toLocaleDateString()
                          : "—"}
                      </TableCell>

                      <TableCell className="pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Copy upload link"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success("Upload link copied");
                              navigator.clipboard.writeText(
                                `${window.location.origin}/client-portal/${r.id}`,
                              );
                            }}
                          >
                            <Link2 />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Send manual ping"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(
                                `Reminder sent to ${r.client.name}`,
                              );
                            }}
                          >
                            <Send />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="More actions"
                              >
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success("Upload link copied");
                                  navigator.clipboard.writeText(
                                    `${window.location.origin}/client-portal/${r.id}`,
                                  );
                                }}
                              >
                                <Link2 />
                                Copy link
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success(
                                    `Ping sent to ${r.client.name}`,
                                  );
                                }}
                              >
                                <Send />
                                Send manual ping
                              </DropdownMenuItem>
                              <Link
                                href={`https://drive.google.com/drive/folders/${r.clientFolderId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <DropdownMenuItem disabled={!r.clientFolderId}>
                                  <ExternalLink />
                                  View in Google Drive
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  const confirmation = requireConfirmation({
                                    title: "Are you sure?",
                                    subtitle:
                                      "This will revoke the request and cannot be undone.",
                                  }).promise;
                                  const res = await confirmation;
                                  if (!res) return;
                                  callRevokeRequest(r.id).then((res) => {
                                    if (res?.id) {
                                      fetchData();
                                    }
                                  });
                                }}
                              >
                                <XCircle className="text-destructive" />
                                Cancel request
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Pagination Controls */}
      {!isOverview && !isLoading && data.length > 0 && (
        <div className="flex items-center justify-between -mt-2">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => setPage(p)}
                  disabled={isLoading}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages || isLoading}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
