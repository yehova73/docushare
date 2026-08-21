"use client";

import { revokeRequestAction } from "@/actions/assign-template/revoke-request";
import { requireConfirmation } from "@/components/modals/confirmation-modal/use-confirmation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useServerAction from "@/hooks/use-server-action";
import {
  ExternalLink,
  Link2,
  MoreHorizontal,
  MoreVertical,
  Send,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const RequestPageOptionsButton: React.FC<{
  id: string;
  clientName: string;
  clientFolderId?: string;
}> = ({ id, clientName, clientFolderId }) => {
  const { call: callRevokeRequest } = useServerAction(revokeRequestAction);
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" aria-label="More actions">
          <MoreVertical /> Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            toast.success("Upload link copied");
            navigator.clipboard.writeText(
              `${window.location.origin}/client-portal/${id}`,
            );
          }}
        >
          <Link2 />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            toast.success(`Ping sent to ${clientName}`);
          }}
        >
          <Send />
          Send manual ping
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!clientFolderId}>
          <ExternalLink />
          View in Google Drive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={async (e) => {
            e.stopPropagation();
            const confirmation = requireConfirmation({
              title: "Are you sure?",
              subtitle: "This will revoke the request and cannot be undone.",
            }).promise;
            const res = await confirmation;
            if (!res) return;
            callRevokeRequest(id).then((res) => {
              if (res?.id) {
                router.push("/app/requests");
              }
            });
          }}
        >
          <XCircle className="text-destructive" />
          Cancel request
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
