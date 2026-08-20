"use client";

import { PortalItem } from "../context/types";
import { FileUploadDropbox } from "./file-upload-dropbox";
import { UploadedFile } from "./uploaded-file";

export const FileUploadCard: React.FC<{
  item: PortalItem;
}> = ({ item }) => {
  return (
    <div className="space-y-2">
      {item.completionValue?.files.map((file) => (
        <UploadedFile key={file.id} file={file} item={item} />
      ))}
      {item.allowMultiple || !item.completionValue?.files.length ? (
        <FileUploadDropbox item={item} />
      ) : null}
    </div>
  );
};
