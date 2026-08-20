"use client";

import { useState } from "react";
import { FolderTree, Loader2, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNestedStructureAndFile } from "@/actions/drive/create-nested-structure";

interface NestedFolderDemoProps {
  selectedFolder: { id: string; name: string } | null;
}

export function NestedFolderDemo({ selectedFolder }: NestedFolderDemoProps) {
  const [templateName, setTemplateName] = useState("Tax-Templates");
  const [clientName, setClientName] = useState("Acme-Corp");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    fileId: string;
    fileName: string;
    templateFolderId: string;
    clientFolderId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunDemo = async () => {
    if (!selectedFolder) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const res = await createNestedStructureAndFile({
        parentFolderId: selectedFolder.id,
        templateFolder: templateName.trim() || "Default-Template",
        clientFolder: clientName.trim() || "Default-Client",
        fileName: "welcome-demo.txt",
        fileContent: `Welcome!\nThis document was uploaded to: ${selectedFolder.name} / ${templateName} / ${clientName}\nGenerated on ${new Date().toLocaleString()}`,
      });

      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to create nested directory structure.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedFolder) return null;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-card space-y-4">
      <div className="space-y-1">
        <h4 className="text-base font-semibold flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-indigo-500" />
          Nested Folder & File Demo
        </h4>
        <p className="text-xs text-muted-foreground">
          Generates{" "}
          <strong>
            {selectedFolder.name} / [Template] / [Client] / demo.txt
          </strong>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="templateName" className="text-xs">
            Template Folder Name
          </Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g. Tax-Templates"
            className="h-8 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="clientName" className="text-xs">
            Client Folder Name
          </Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Acme-Corp"
            className="h-8 text-xs"
          />
        </div>
      </div>

      <Button
        onClick={handleRunDemo}
        disabled={isProcessing}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        size="sm"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Hierarchy & File...
          </>
        ) : (
          "Run Nested Upload Demo"
        )}
      </Button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {result && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-md text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Folder hierarchy and file created!
          </div>

          <div className="text-muted-foreground font-mono space-y-0.5">
            <p>📂 Root: {selectedFolder.name}</p>
            <p>└── 📂 {templateName}</p>
            <p> └── 📂 {clientName}</p>
            <p> └── 📄 {result.fileName}</p>
          </div>

          <div className="pt-1 flex gap-3">
            <a
              href={`https://drive.google.com/file/d/${result.fileId}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline"
            >
              View File <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href={`https://drive.google.com/drive/folders/${result.clientFolderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline"
            >
              Open Client Folder <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
