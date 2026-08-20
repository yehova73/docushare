"server-only";
"use server";

import { getValidDriveAccessToken } from "@/actions/drive/get-valid-drive-access-token";

interface CreateNestedStructureInput {
  parentFolderId: string;
  templateFolder: string;
  clientFolder: string;
  fileName?: string;
  fileContent?: string;
}

/**
 * Utility: Checks if a subfolder exists inside parentFolderId.
 * Creates it if it doesn't exist, returns the folder ID.
 */
async function getOrCreateFolder(
  folderName: string,
  parentFolderId: string,
  accessToken: string,
): Promise<string> {
  // 1. Search for existing folder with exact name inside parentFolderId
  // Escape single quotes in folder name for the Google Drive query syntax
  const sanitizedName = folderName.replace(/'/g, "\\'");
  const query = `'${parentFolderId}' in parents and name = '${sanitizedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;

  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query,
  )}&fields=files(id,name)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `Failed to query Google Drive folder`,
    );
  }

  const searchData = await searchRes.json();

  // Return existing folder ID if found
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // 2. If not found, create a new subfolder
  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `Failed to create folder: ${folderName}`,
    );
  }

  const newFolder = await createRes.json();
  return newFolder.id;
}

/**
 * Main Action: Creates parentFolder / templateFolder / clientFolder / demo.txt
 */
export async function createNestedStructureAndFile({
  parentFolderId,
  templateFolder,
  clientFolder,
  fileName = "demo.txt",
  fileContent = "Demo file inside nested template/client folder structure.",
}: CreateNestedStructureInput) {
  if (!parentFolderId) {
    throw new Error("Parent folder ID is required.");
  }

  const accessToken = await getValidDriveAccessToken();

  // Step A: Ensure Level 1 (templateFolder) exists
  const templateFolderId = await getOrCreateFolder(
    templateFolder,
    parentFolderId,
    accessToken,
  );

  // Step B: Ensure Level 2 (clientFolder) exists inside templateFolder
  const clientFolderId = await getOrCreateFolder(
    clientFolder,
    templateFolderId,
    accessToken,
  );

  // Step C: Upload demo file inside clientFolder
  const metadata = {
    name: fileName,
    mimeType: "text/plain",
    parents: [clientFolderId],
  };

  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
    fileContent +
    closeDelimiter;

  const uploadRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: body,
    },
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create demo file`);
  }

  const fileResult = await uploadRes.json();

  return {
    success: true,
    templateFolderId,
    clientFolderId,
    fileId: fileResult.id as string,
    fileName: fileResult.name as string,
  };
}
