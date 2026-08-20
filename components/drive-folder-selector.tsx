"use client";

import { getValidDriveAccessToken } from "@/actions/drive/get-valid-drive-access-token";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useServerAction from "@/hooks/use-server-action";
import {
  CheckCircle2,
  ExternalLink,
  Folder,
  FolderPen,
  PowerOff,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { disconnectGoogleDriveAction } from "@/actions/drive/disconnect";
import { setSelectedFolderAction } from "@/actions/drive/set-selected-folder";
import { SettingRow } from "@/app/(dashboard)/app/settings/_components/components";
import { Switch } from "./ui/switch";
import Link from "next/link";

// 1. Dynamically import DrivePicker with SSR disabled as per package docs
const DrivePicker = dynamic(
  () =>
    import("@googleworkspace/drive-picker-react").then(
      (mod) => mod.DrivePicker,
    ),
  { ssr: false },
);

const DrivePickerDocsView = dynamic(
  () =>
    import("@googleworkspace/drive-picker-react").then(
      (mod) => mod.DrivePickerDocsView,
    ),
  { ssr: false },
);

interface SelectedFolder {
  id: string;
  name: string;
}

export function DriveFolderSelector({
  initialSettings,
}: {
  initialSettings?: {
    email?: string;
    name?: string;
    imageUrl?: string;
    id: string;
    folderId?: string | null;
    folderName?: string | null;
  };
}) {
  const { call: callDisconnectDrive, loading: loadingDisconnectDrive } =
    useServerAction(disconnectGoogleDriveAction);
  const { call: callSetSelectedFolder, loading: loadingSetSelectedFolder } =
    useServerAction(setSelectedFolderAction);
  const [token, setToken] = useState<string | null>(null);
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<SelectedFolder | null>(
    initialSettings?.folderId && initialSettings?.folderName
      ? {
          id: initialSettings.folderId,
          name: initialSettings.folderName,
        }
      : null,
  );
  const [error, setError] = useState<string | null>(null);

  // 2. Fetch fresh OAuth token from Next.js server route before triggering picker
  const handleStartPicker = async () => {
    setError(null);
    setIsFetchingToken(true);
    const scrollY = window.scrollY;
    try {
      const data = await getValidDriveAccessToken();
      setToken(data);
      setIsPickerOpen(true);

      // Lock scroll position immediately after modal injection
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    } catch (err: any) {
      setError(err.message || "Error initializing Google Picker.");
    } finally {
      setIsFetchingToken(false);
    }
  };

  // 3. Handle folder selection event payload
  const handlePicked = async (event: any) => {
    setIsPickerOpen(false);
    const detail = event.detail;
    console.log("Drive Picker selected:", detail);

    if (detail && detail.docs && detail.docs.length > 0) {
      const pickedFolder = detail.docs[0];
      const folderData: SelectedFolder = {
        id: pickedFolder.id,
        name: pickedFolder.name,
      };

      setSelectedFolder(folderData);
      await callSetSelectedFolder(folderData.id, folderData.name);
    }
  };

  useEffect(() => {
    if (!isPickerOpen) return;

    // Save current scroll position
    const currentScrollX = window.scrollX;
    const currentScrollY = window.scrollY;

    // Prevent any scroll jumps caused by Google's internal .focus()
    const preventScroll = () => {
      window.scrollTo(currentScrollX, currentScrollY);
    };

    window.addEventListener("scroll", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("scroll", preventScroll);
    };
  }, [isPickerOpen]);

  return (
    <Card className="shadow-sm mx-4 mb-4 px-4 ">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={initialSettings?.imageUrl || ""}
                alt="User Avatar"
              />
              <AvatarFallback className="bg-primary/10 font-medium text-primary">
                {initialSettings?.name?.charAt(0).toUpperCase() || "G"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {initialSettings?.name || ""}
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              </span>
              <span className="text-xs text-muted-foreground">
                {initialSettings?.email}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!selectedFolder && (
            <Button
              size="sm"
              onClick={handleStartPicker}
              disabled={isFetchingToken}
            >
              <Folder />
              Select Folder
            </Button>
          )}

          <Button
            variant={"destructive"}
            size="sm"
            onClick={callDisconnectDrive}
            disabled={loadingDisconnectDrive}
          >
            <PowerOff />
            Disconnect
          </Button>
        </div>
      </div>
      {selectedFolder && (
        <>
          <div className=" grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
            <div className="min-w-0">
              <div className="text-sm font-medium">Selected Folder</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                We will upload client documents in the
                /template-name/client-name subfolder of this folder
              </div>
            </div>
            <div className="shrink-0 flex gap-2">
              <>
                <Link
                  href={`https://drive.google.com/drive/folders/${selectedFolder.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  passHref
                >
                  <Button size="sm" variant={"outline"}>
                    <ExternalLink />/ {selectedFolder.name} / [Template-Name] /
                    [Client-Name]
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant={"outline"}
                  onClick={handleStartPicker}
                  disabled={isFetchingToken}
                >
                  <FolderPen />
                  Change Folder
                </Button>
              </>
            </div>
          </div>
          <div className=" grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
            <div className="min-w-0">
              <div className="text-sm font-medium">DocuShare Backups</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Backup client uploaded files on DocuShare
              </div>
            </div>
            <div className="shrink-0">
              <Switch />
            </div>
          </div>
        </>
      )}
      {isPickerOpen && token && (
        <DrivePicker
          app-id={"concise-volt-504911-g2"}
          client-id={process.env.GOOGLE_DRIVE_CLIENT_ID || ""}
          developer-key={process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY || ""}
          oauth-token={token}
          onPicked={handlePicked}
          onCanceled={() => setIsPickerOpen(false)}
          title="Select destination folder"
          onOauthError={(e: any) =>
            setError(
              `OAuth Error: ${e.detail?.message || "Authentication failed"}`,
            )
          }
        >
          {/* Configure view specifically for Drive Folders */}
          <DrivePickerDocsView
            view-id="FOLDERS"
            select-folder-enabled="true"
            include-folders="true"
            mime-types="application/vnd.google-apps.folder"
            owned-by-me="true"
          />
        </DrivePicker>
      )}
    </Card>
  );
  // return (
  //   <Card className="w-full max-w-lg shadow-sm">
  //     <CardHeader>
  //       <div className="flex items-center justify-between">
  //         <CardTitle className="text-lg font-semibold flex items-center gap-2">
  //           <Folder className="h-5 w-5 text-blue-600" />
  //           Google Drive Target
  //         </CardTitle>
  //         {selectedFolder && (
  //           <Badge
  //             variant="outline"
  //             className="text-emerald-600 border-emerald-200 bg-emerald-50"
  //           >
  //             <CheckCircle2 className="h-3 w-3 mr-1" /> Configured
  //           </Badge>
  //         )}
  //       </div>
  //       <CardDescription>
  //         Select the root destination folder in Google Drive where files will be
  //         uploaded.
  //       </CardDescription>
  //     </CardHeader>

  //     <CardContent className="space-y-4">
  //       {error && (
  //         <Alert variant="destructive">
  //           <AlertCircle className="h-4 w-4" />
  //           <AlertTitle>Error</AlertTitle>
  //           <AlertDescription>{error}</AlertDescription>
  //         </Alert>
  //       )}

  //       {selectedFolder ? (
  //         <div className="p-3 bg-muted rounded-md flex items-center justify-between">
  //           <div className="space-y-0.5">
  //             <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
  //               Selected Folder
  //             </p>
  //             <p className="text-sm font-semibold">{selectedFolder.name}</p>
  //             <p className="text-xs text-muted-foreground font-mono">
  //               {selectedFolder.id}
  //             </p>
  //           </div>
  //         </div>
  //       ) : (
  //         <p className="text-sm text-muted-foreground">
  //           No Google Drive folder currently selected.
  //         </p>
  //       )}

  //       {/* 5. Render DrivePicker only when token is ready and modal is requested */}

  //     </CardContent>
  //     {selectedFolder && <CreateFileSection selectedFolder={selectedFolder} />}
  //     {selectedFolder && <NestedFolderDemo selectedFolder={selectedFolder} />}
  //     <CardFooter>
  //       <Button
  //         onClick={handleStartPicker}
  //         disabled={isFetchingToken}
  //         className="w-full"
  //       >
  //         {isFetchingToken ? (
  //           <>
  //             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //             Opening Drive Picker...
  //           </>
  //         ) : selectedFolder ? (
  //           "Change Target Folder"
  //         ) : (
  //           "Select Target Folder"
  //         )}
  //       </Button>
  //     </CardFooter>
  //   </Card>
  // );
}
