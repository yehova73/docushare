"server-only";

import { prisma } from "@/lib/prisma";
import { getValidDriveAccessToken } from "./get-valid-drive-access-token";
import { getOrCreateWorkspaceSpreadsheet } from "./spreeadsheet/get-or-create-template-spreadsheet";
import { capitalize } from "@/lib/utils";

interface EnsureDriveFoldersParams {
  userId: string;
  assignationId: string;
  templateName: string;
  clientName: string;
}

interface EnsureDriveFoldersResult {
  success: boolean;
  rootFolderId?: string;
  templateFolderId?: string;
  clientFolderId?: string;
  error?: string;
}

/**
/**
 * Checks if a subfolder with folderName exists inside parentFolderId.
 * Creates it if it doesn't exist and returns the folder ID.
 */
async function getOrCreateFolder(
  folderName: string,
  parentFolderId: string,
  accessToken: string,
): Promise<string> {
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
      err.error?.message || `Failed to search folder: ${folderName}`,
    );
  }

  const searchData = await searchRes.json();

  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Folder doesn't exist; create it
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
 * Background Task Function: Ensures `Root / TemplateName / ClientName` folder tree exists in Google Drive.
 */
export async function ensureDriveAssignationFoldersAndSpreadsheet({
  userId,
  assignationId,
  templateName,
  clientName,
}: EnsureDriveFoldersParams): Promise<EnsureDriveFoldersResult> {
  try {
    // 1. Fetch user's connected Google Drive account
    const driveAccount = await prisma.googleDriveAccount.findUnique({
      where: { userId },
    });

    // If Google Drive is not connected or no root folder selected, skip silently
    if (!driveAccount || !driveAccount.folderId) {
      return {
        success: false,
        error: "Google Drive is not connected or no root folder selected.",
      };
    }

    // 2. Resolve a valid access token
    const accessToken = await getValidDriveAccessToken();
    const rootFolderId = driveAccount.folderId;

    // 3. Ensure Template Folder exists inside Root
    const templateFolderId = await getOrCreateFolder(
      templateName,
      rootFolderId,
      accessToken,
    );

    // 4. Ensure Client Folder exists inside Template Folder
    const clientFolderId = await getOrCreateFolder(
      clientName,
      templateFolderId,
      accessToken,
    );

    await prisma.templateClientAssignation.update({
      where: { id: assignationId },
      data: {
        templateFolderId,
        clientFolderId,
      },
    });

    try {
      const assignation = await prisma.templateClientAssignation.findUnique({
        where: { id: assignationId },
        include: {
          client: true,
          template: {
            include: {
              sections: {
                orderBy: { order: "asc" },
                select: {
                  fields: {
                    orderBy: { order: "asc" },
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (assignation) {
        const fileId = await getOrCreateWorkspaceSpreadsheet(
          templateFolderId,
          accessToken,
          "Requests",
          assignation?.template?.sections.flatMap((section) =>
            section.fields.map((field) => field.name),
          ) || [],
          {
            "Request Id": assignation?.id,
            "Template Id": assignation?.templateId,
            "Sent Date": assignation?.submittedAt?.toDateString() || "",
            "Client Name": assignation?.client?.name || "",
            "Client Email": assignation?.client?.email || "",
            "Template Name": assignation?.template?.name || "",
            Status: capitalize(
              assignation?.status.toLowerCase().replaceAll("_", " ") || "",
            ),
            "Due Date": assignation?.dueDate?.toDateString() || "",
          },
        );

        await prisma.templateClientAssignation.update({
          where: { id: assignationId },
          data: {
            spreadsheetId: fileId,
          },
        });
      }
    } catch (error) {
      console.error(
        "[ensureDriveAssignationFoldersAndSpreadsheet Error]: Failed to create or access spreadsheet",
        error,
      );
    }

    return {
      success: true,
      rootFolderId,
      templateFolderId,
      clientFolderId,
    };
  } catch (error: any) {
    console.error(
      "[ensureDriveAssignationFoldersAndSpreadsheet Error]:",
      error,
    );
    return {
      success: false,
      error: error.message || "Failed to establish Drive folder structure",
    };
  }
}
