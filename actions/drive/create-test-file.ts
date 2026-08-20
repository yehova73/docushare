"use server";

import { getValidDriveAccessToken } from "@/actions/drive/get-valid-drive-access-token";

interface CreateTxtFileInput {
  folderId: string;
  fileName?: string;
  content?: string;
}

export async function createTxtFile({
  folderId,
  fileName = "hello-world.txt",
  content = "Hello! This text file was created from Next.js using Google Drive API.",
}: CreateTxtFileInput) {
  if (!folderId) {
    throw new Error("Folder ID is required.");
  }

  // 1. Obtain a fresh access token for the logged-in user
  const accessToken = await getValidDriveAccessToken();

  // 2. Build metadata specifying file name, mimeType, and parent folder
  const metadata = {
    name: fileName,
    mimeType: "text/plain",
    parents: [folderId],
  };

  // 3. Construct a multipart request body containing both Metadata and File Content
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const body =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
    content +
    closeDelimiter;

  // 4. Send request to Google Drive upload API
  const response = await fetch(
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Failed to create file in Drive: ${response.statusText}`,
    );
  }

  const result = await response.json();

  return {
    success: true,
    fileId: result.id as string,
    fileName: result.name as string,
    mimeType: result.mimeType as string,
  };
}
