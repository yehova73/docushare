"use client";
import { isTextField } from "@/app/client-portal/[id]/_components/context/utils";
import { getFieldFileDownloadUrlAction } from "@/actions/s3/get-field-file-download-url";
import { Button } from "@/components/ui/button";
import useServerAction from "@/hooks/use-server-action";
import type { File as PrismaFile } from "@/lib/generated/prisma/browser";
import {
  FieldCompletionValueGetPayload,
  TemplateFieldGetPayload,
} from "@/lib/generated/prisma/models";
import JSZip from "jszip";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface KeyValuePair {
  key: string;
  value: string;
}

interface ZipDownloadButtonProps {
  fields: TemplateFieldGetPayload<{
    include: {
      completionValue: {
        include: {
          files: true;
        };
      };
    };
  }>[];
  textFileName?: string;
  zipFileName?: string;
}

export const DownloadArchiveButton = ({
  fields,
  textFileName = "text-values.txt",
  zipFileName = "archive.zip",
}: ZipDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { call } = useServerAction(getFieldFileDownloadUrlAction);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const zip = new JSZip();

      // 1. Add key-value pairs text file
      const textContent = fields
        .filter((field) => isTextField(field))
        .map(
          ({ name, completionValue }) =>
            `${name}: ${completionValue?.value || ""}`,
        )
        .join("\n");
      zip.file(textFileName, textContent);

      // 2. Map files and generate customized zip file names
      const filesToDownload: { file: PrismaFile; targetZipName: string }[] = [];

      for (const field of fields) {
        const fieldName = field.name.trim();
        const filesCount = field.completionValue?.files.length || 0;

        (field.completionValue?.files || []).forEach((file) => {
          let targetZipName: string;

          if (filesCount > 1) {
            // Multiple files: field.name-filename
            targetZipName = `${fieldName}-${file.fileName}`;
          } else {
            // Single file: use field.name, retaining original file extension
            const fileExtension = file.fileName.includes(".")
              ? `.${file.fileName.split(".").pop()}`
              : "";
            targetZipName = `${fieldName}${fileExtension}`;
          }

          filesToDownload.push({ file, targetZipName });
        });
      }

      // 3. Fetch pre-signed URLs concurrently via Promise.all
      const urlResults = await Promise.all(
        filesToDownload.map(({ file }) => call(file.id)),
      );

      // 4. Fetch binary blobs concurrently using pre-signed URLs
      const fileFetchPromises = filesToDownload.map(
        async ({ targetZipName }, index) => {
          const urlResult = urlResults[index];

          if (!urlResult?.downloadUrl) {
            throw new Error(
              `Failed to retrieve download URL for item index ${index}`,
            );
          }

          const response = await fetch(urlResult.downloadUrl);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch file payload for ${targetZipName}`,
            );
          }

          const blob = await response.blob();
          return { targetZipName, blob };
        },
      );

      const fetchedFiles = await Promise.all(fileFetchPromises);

      // 5. Add renamed file blobs to the ZIP archive
      for (const { targetZipName, blob } of fetchedFiles) {
        zip.file(targetZipName, blob);
      }

      // 6. Compress and trigger browser download
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const blobUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to generate zip archive:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? <Loader2 className="animate-spin" /> : <Download />}
      {isGenerating ? "Preparing Zip..." : "Download All"}
    </Button>
  );
};
