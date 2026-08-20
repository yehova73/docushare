"use client";

import { getFieldFileDownloadUrlAction } from "@/actions/s3/get-field-file-download-url";
import { Button } from "@/components/ui/button";
import useServerAction from "@/hooks/use-server-action";
import type { File } from "@/lib/generated/prisma/browser";
import { Download } from "lucide-react";

export const DownloadFileButton = ({ file }: { file: File }) => {
  const { call, loading } = useServerAction(getFieldFileDownloadUrlAction);

  return (
    <Button
      variant={"outline"}
      size="sm"
      onClick={async () => {
        const res = await call(file.id);
        if (res?.downloadUrl) {
          const link = document.createElement("a");
          link.href = res.downloadUrl;
          link.target = "_blank";
          link.download = file.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }}
      disabled={loading}
    >
      <Download />
      Download
    </Button>
  );
};
