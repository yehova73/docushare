"use client";

import { completeFieldUploadAction } from "@/actions/s3/complete-field-upload";
import { generateFieldUploadKeyAction } from "@/actions/s3/generate-field-upload-key";
import { useS3Upload } from "@/hooks/use-s3-upload";
import { useServerAction } from "@/hooks/use-server-action";
import { useRef, useState } from "react";
import { PortalItem } from "../context/types";
import { useClientPortalContext } from "../context/client-portal-context";
import { FileText, UploadCloud, Camera, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validateFile } from "./file-validation";

export const FileUploadDropbox: React.FC<{
  item: PortalItem;
}> = ({ item }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { onFieldFilesUpdate: onUploadFinished } = useClientPortalContext();

  const { call: callCompleteUploadAction } = useServerAction(
    completeFieldUploadAction,
  );

  const { progress, uploadFile, fileName } = useS3Upload({
    getS3UploadKey: () => generateFieldUploadKeyAction(item.id),
    onUploadComplete: (params) =>
      callCompleteUploadAction({
        ...params,
        fieldId: item.id,
      }).then((res) => {
        if (res) {
          onUploadFinished(item.id, res);
        }
        setIsUploading(false);
      }),
  });

  const isImage = item.type === "IMAGE";

  const filesLabel = isImage ? "images" : "files";

  return (
    <>
      {validationError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-red-600" />
          <p>{validationError}</p>
        </div>
      )}
      {isUploading && (
        <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <FileText className="size-4 text-muted-foreground" />
              {fileName ?? item.name}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {progress}%
            </span>
          </div>
          <Progress value={progress} />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={isImage ? "image/*" : undefined}
        className="sr-only"
        onChange={(e) => {
          setValidationError(null);
          console.log("File input changed:", e.target.files);
          const files = e.target.files;
          if (files) {
            let hasError = false;
            for (let i = 0; i < files.length; i++) {
              const validation = validateFile(files[i], isImage);
              if (!validation.valid) {
                setValidationError(
                  validation.error || "File validation failed",
                );
                hasError = true;
                break;
              }
              if (!hasError) {
                setIsUploading(true);
                uploadFile({
                  file: files[i],
                });
              }
            }
          }
        }}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          setValidationError(null);
          const files = e.dataTransfer.files;
          if (files) {
            let hasError = false;
            for (let i = 0; i < files.length; i++) {
              const validation = validateFile(files[i], isImage);
              if (!validation.valid) {
                setValidationError(
                  validation.error || "File validation failed",
                );
                hasError = true;
                break;
              }
              if (!hasError) {
                setIsUploading(true);
                uploadFile({
                  file: files[i],
                });
              }
            }
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30",
        )}
        style={{
          backgroundColor: dragging ? undefined : "var(--portal-upload-bg)",
        }}
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag &amp; drop, or choose {filesLabel}
        </p>
        <div className="-mt-2 flex gap-2">
          <Button size="sm" onClick={() => inputRef.current?.click()}>
            <UploadCloud data-icon="inline-start" />
            Choose {filesLabel}
          </Button>
          {isImage && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <Camera data-icon="inline-start" />
              Take photo
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
