"use client";

import { useState } from "react";
import { FileText, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTxtFile } from "@/actions/drive/create-test-file";

interface DriveFolderSelectorProps {
  selectedFolder: { id: string; name: string } | null;
}

export function CreateFileSection({
  selectedFolder,
}: DriveFolderSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [createdFile, setCreatedFile] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateFile = async () => {
    if (!selectedFolder) return;

    setIsCreating(true);
    setError(null);
    setCreatedFile(null);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const res = await createTxtFile({
        folderId: selectedFolder.id,
        fileName: `note-${timestamp}.txt`,
        content: `This file was created dynamically on ${new Date().toLocaleString()}\nInside folder: ${selectedFolder.name} (${selectedFolder.id})`,
      });

      setCreatedFile({ id: res.fileId, name: res.fileName });
    } catch (err: any) {
      setError(err.message || "Failed to create .txt file.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!selectedFolder) return null;

  return (
    <div className="mt-4 p-4 border rounded-lg bg-card space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" /> Test File Creation
          </h4>
          <p className="text-xs text-muted-foreground">
            Create a test file inside <strong>{selectedFolder.name}</strong>
          </p>
        </div>

        <Button
          onClick={handleCreateFile}
          disabled={isCreating}
          variant="secondary"
          size="sm"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Creating...
            </>
          ) : (
            "Create .txt File"
          )}
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {createdFile && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center justify-between">
          <span>
            Created <strong>{createdFile.name}</strong>
          </span>
          <a
            href={`https://drive.google.com/file/d/${createdFile.id}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium hover:underline text-emerald-700"
          >
            View in Drive <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
