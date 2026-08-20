// hooks/useS3Upload.ts
"use client";

import { useState, useCallback } from "react";
import { getPresignedUploadUrl } from "@/actions/s3";
import {
  useServerAction,
  ServerActionFn,
  ServerActionResponse,
} from "./use-server-action";

export type UploadStatus =
  | "idle"
  | "getting-url"
  | "uploading"
  | "success"
  | "error";

export interface UploadResult {
  key: string;
  url: string;
}

export interface GenerateUploadKeyResponse {
  s3Key: string;
}

export interface UseS3UploadParams {
  getS3UploadKey: () => Promise<
    ServerActionResponse<GenerateUploadKeyResponse>
  >;
  onUploadComplete: (params: {
    fileName: string;
    fileType: string;
    fileSize: number;
    s3Key: string;
    isReupload?: boolean;
  }) => void;
}

export function useS3Upload(params: UseS3UploadParams) {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { call: callGetS3UploadKey } = useServerAction(params.getS3UploadKey);

  const uploadFile = useCallback(
    async (uploadParams: {
      file: File;
      isReupload?: boolean;
    }): Promise<UploadResult | null> => {
      setStatus("getting-url");
      setProgress(0);
      setError(null);
      setFileName(uploadParams.file.name);

      try {
        // 1. Get S3 key from server action
        const s3KeyResult = await callGetS3UploadKey();

        if (!s3KeyResult?.s3Key) {
          throw new Error("Could not generate S3 upload key");
        }

        const s3Key = s3KeyResult.s3Key;

        // 2. Get presigned URL from Server Action
        const res = await getPresignedUploadUrl({
          key: s3Key,
          fileName: uploadParams.file.name,
          fileType: uploadParams.file.type,
          fileSize: uploadParams.file.size,
        });

        if (!res.success || !res.uploadUrl || !res.key) {
          throw new Error(res.error || "Could not retrieve upload URL");
        }

        const { uploadUrl, key } = res;

        // 3. Upload file directly to S3 via XMLHttpRequest for progress tracking
        setStatus("uploading");

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round(
                (event.loaded / event.total) * 100,
              );
              setProgress(percentComplete);
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status code ${xhr.status}`));
            }
          });

          xhr.addEventListener("error", () =>
            reject(new Error("Network error during upload")),
          );
          xhr.addEventListener("abort", () =>
            reject(new Error("Upload aborted")),
          );

          xhr.open("PUT", uploadUrl);
          xhr.setRequestHeader("Content-Type", uploadParams.file.type);
          xhr.send(uploadParams.file);
        });

        // 4. Call onUploadComplete to create File entry and link it
        params.onUploadComplete({
          fileName: uploadParams.file.name,
          fileType: uploadParams.file.type,
          fileSize: uploadParams.file.size,
          s3Key: key,
          isReupload: uploadParams.isReupload,
        });

        setStatus("success");
        return { key, url: uploadUrl.split("?")[0] }; // Base S3 URL without query parameters
      } catch (err: any) {
        const message =
          err.message || "An unknown error occurred during upload";
        setError(message);
        setStatus("error");
        return null;
      }
    },
    [callGetS3UploadKey, params.onUploadComplete],
  );

  const reset = useCallback(() => {
    setProgress(0);
    setStatus("idle");
    setError(null);
  }, []);

  return { uploadFile, progress, status, error, fileName, reset };
}
