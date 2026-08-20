"use client";

import { FileGetPayload } from "@/lib/generated/prisma/models";
import {
  FileText,
  CheckCircle2,
  Download,
  RefreshCw,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PortalItem } from "../context/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRef, useState } from "react";
import useServerAction from "@/hooks/use-server-action";
import { useS3Upload } from "@/hooks/use-s3-upload";
import { getFieldFileDownloadUrlAction } from "@/actions/s3/get-field-file-download-url";
import { deleteFieldFileAction } from "@/actions/s3/delete-field-file";
import { replaceFieldFileAction } from "@/actions/s3/replace-field-file";
import { generateFieldUploadKeyAction } from "@/actions/s3/generate-field-upload-key";
import { useClientPortalContext } from "../context/client-portal-context";
import { requireConfirmation } from "@/components/modals/confirmation-modal/use-confirmation";
import { validateFile } from "./file-validation";

export const UploadedFile: React.FC<{
  file: FileGetPayload<{}>;
  item: PortalItem;
}> = ({ file, item }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const { onFieldFilesUpdate: onUploadFinished } = useClientPortalContext();
  const { call: callDeleteFile } = useServerAction(deleteFieldFileAction);
  const { call: callGetDownloadUrl } = useServerAction(
    getFieldFileDownloadUrlAction,
  );
  const { call: callReplaceFile } = useServerAction(replaceFieldFileAction);

  const isImage = item.type === "IMAGE";
  const fileLabel = isImage ? "image" : "file";

  const { progress, uploadFile, fileName } = useS3Upload({
    getS3UploadKey: () => generateFieldUploadKeyAction(item.id),
    onUploadComplete: (params) => {
      console.log(
        "Upload complete, calling replaceFieldFileAction with params:",
        {
          ...params,
          fileId: file.id,
          fieldId: item.id,
        },
      );
      callReplaceFile({
        ...params,
        fileId: file.id,
        fieldId: item.id,
      }).then((res) => {
        if (res) {
          onUploadFinished(item.id, res);
        }
        setIsReplacing(false);
      });
    },
  });

  const handleDelete = async (fileId: string) => {
    setIsDeleting(true);
    try {
      const result = await callDeleteFile(fileId);

      if (result) {
        onUploadFinished(item.id, {
          ...item.completionValue,
          files:
            item.completionValue?.files?.filter((f) => f.id !== fileId) || [],
        } as any);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (!item.completionValue?.files?.[0]?.id) return;

    setIsDownloading(true);
    try {
      const result = await callGetDownloadUrl(item.completionValue.files[0].id);

      if (result?.downloadUrl) {
        // Create a temporary link and trigger download
        const link = document.createElement("a");
        link.href = result.downloadUrl;
        link.target = "_blank";
        link.download = item.completionValue.files[0].fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReplaceClick = async () => {
    setValidationError(null);

    // Require confirmation before replacing the existing file
    const confirmation = requireConfirmation({
      title: `Replace ${fileLabel}?`,
      subtitle: `This will replace "${file.fileName ?? item.name}" with a new file. The old file will be permanently removed from storage.`,
      buttons: {
        confirm: "Replace",
        isSuccess: true,
        cancel: "Cancel",
      },
    });

    const result = await confirmation.promise;
    if (result) {
      replaceInputRef.current?.click();
    }
  };

  const handleReplaceFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    console.log("File input changed for replacement:", files);
    // Reset input value so selecting the same file again still triggers change
    if (!files || files.length === 0) return;

    const newFile = files[0];
    const validation = validateFile(newFile, isImage);
    console.log("File selected for replacement:", newFile, validation);
    if (!validation.valid) {
      setValidationError(validation.error || "File validation failed");
      return;
    }

    setValidationError(null);
    setIsReplacing(true);
    const result = await uploadFile({ file: newFile, isReupload: true });
    if (!result) {
      setIsReplacing(false);
      e.target.value = "";
    }
  };

  return (
    <>
      {validationError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-red-600" />
          <p>{validationError}</p>
        </div>
      )}
      <input
        ref={replaceInputRef}
        type="file"
        accept={isImage ? "image/*" : undefined}
        className="sr-only"
        onChange={handleReplaceFileChange}
      />
      {isReplacing ? (
        <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              {fileName ?? file.fileName ?? item.name}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {progress}%
            </span>
          </div>
          <Progress value={progress} />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 aspect-square items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <FileText className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {file.fileName ?? item.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3" />
                {fileLabel.charAt(0).toUpperCase() + fileLabel.slice(1)}{" "}
                uploaded
              </span>
            </div>
          </div>
          <div className="flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <Download data-icon="inline-start" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download {fileLabel}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleReplaceClick}
                  disabled={isReplacing}
                >
                  {isReplacing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <RefreshCw data-icon="inline-start" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Replace {fileLabel}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      await handleDelete(file.id);
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  disabled={isDeleting}
                >
                  <X data-icon="inline-start" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete {fileLabel}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </>
  );
};
