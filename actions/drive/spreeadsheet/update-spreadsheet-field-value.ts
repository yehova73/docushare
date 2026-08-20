import Papa from "papaparse";
import { RecordRowData } from "./get-or-create-template-spreadsheet";
import { getOrCreateWorkspaceSpreadsheet } from "./get-or-create-template-spreadsheet";
import { prisma } from "@/lib/prisma";
import { capitalize, distinctBy } from "@/lib/utils";
/**
 * Normalizes column headers: trims spaces, replaces single/multiple spaces with '_',
 * and converts to lowercase for consistent case-insensitive comparisons.
 */
function normalizeHeader(header: string): string {
  return header.trim().replace(/\s+/g, "_").toLowerCase();
}

/**
 * Mock function to fetch full details for a request and insert a new row.
 * Now receives columnName and newValue so it doesn't drop updates.
 */
async function getInitialRowValues(
  assignationId: string,
  columnName?: string,
  newValue?: string | number | boolean | null,
) {
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

  if (!assignation) {
    throw new Error(`Assignation not found for ID: ${assignationId}`);
  }

  const additionalHeaders =
    assignation.template?.sections.flatMap((section) =>
      section.fields.map((field) => field.name),
    ) || [];

  const rowData: RecordRowData = {
    "Request Id": assignation.id,
    "Template Id": assignation.templateId,
    "Sent Date": assignation.submittedAt?.toDateString() || "",
    "Client Name": assignation.client?.name || "",
    "Client Email": assignation.client?.email || "",
    "Template Name": assignation.template?.name || "",
    Status: capitalize(
      (assignation?.status ?? "").toLowerCase().replaceAll("_", " ") || "",
    ),
    "Due Date": assignation.dueDate?.toDateString() || "",
  };

  if (columnName) {
    rowData[columnName] = newValue ?? "";
  }

  return { rowData, additionalHeaders };
}

interface UpdateFieldParams {
  spreadsheetId?: string;
  accessToken: string;
  requestId: string;
  columnName: string;
  newValue: string | number | boolean | null;
  parentFolderId?: string; // Required if the file needs to be recreated
  sheetTitle?: string; // Optional title if recreated (defaults to "client-portal-data")
}

export async function updateSpreadsheetFieldValue({
  spreadsheetId,
  accessToken,
  requestId,
  columnName,
  newValue,
  parentFolderId,
  sheetTitle = "client-portal-data",
}: UpdateFieldParams): Promise<string> {
  if (!spreadsheetId) {
    if (!parentFolderId) {
      throw new Error(
        `Cannot create spreadsheet for Request ID '${requestId}' because parentFolderId was not provided.`,
      );
    }

    console.warn(
      `No spreadsheetId provided for Request ID '${requestId}'. Creating new spreadsheet in folder ${parentFolderId}...`,
    );

    const { rowData, additionalHeaders } = await getInitialRowValues(
      requestId,
      columnName,
      newValue,
    );

    const newFileId = await getOrCreateWorkspaceSpreadsheet(
      parentFolderId,
      accessToken,
      sheetTitle,
      additionalHeaders,
      rowData,
    );

    return newFileId; // Return brand new ID so DB gets updated
  }

  const exportUrl = `https://www.googleapis.com/drive/v3/files/${spreadsheetId}/export?mimeType=text/csv`;

  let exportRes = await fetch(exportUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // ----------------------------------------------------
  // RECOVERY: Recreate file if 404 (Deleted) or 403 (Permission lost)
  // ----------------------------------------------------
  if (exportRes.status === 404 || exportRes.status === 403) {
    if (!parentFolderId) {
      throw new Error(
        `Spreadsheet ${spreadsheetId} is missing or inaccessible, and no parentFolderId was provided to recreate it.`,
      );
    }

    console.warn(
      `Spreadsheet ${spreadsheetId} inaccessible (Status ${exportRes.status}). Recreating file in folder ${parentFolderId}...`,
    );

    const initialData = await getInitialRowValues(
      requestId,
      columnName,
      newValue,
    );
    // Recreates the sheet and inserts the first row
    const newFileId = await getOrCreateWorkspaceSpreadsheet(
      parentFolderId,
      accessToken,
      sheetTitle,
      distinctBy(
        [columnName, ...initialData.additionalHeaders].filter(Boolean),
        (v) => v,
      ),
      initialData.rowData,
    );

    // Return the brand-new fileId so the caller can update the DB record
    return newFileId;
  }

  if (!exportRes.ok) {
    throw new Error(`Failed to export spreadsheet with ID: ${spreadsheetId}`);
  }

  const csvText = await exportRes.text();

  // Parse CSV
  const parsed = Papa.parse<RecordRowData>(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  let fields = parsed.meta.fields || [];
  let rows = parsed.data || [];

  // Normalize existing headers map
  const normalizedFieldsMap = new Map<string, string>();
  fields.forEach((field) => {
    normalizedFieldsMap.set(normalizeHeader(field), field);
  });

  const targetReqIdNorm = "request_id";
  const existingReqIdHeader =
    normalizedFieldsMap.get(targetReqIdNorm) ||
    fields.find((f) => normalizeHeader(f) === "requestid");

  if (!existingReqIdHeader) {
    console.warn(
      `No 'request_id' column found in spreadsheet ${spreadsheetId}. Skipping update.`,
    );
    return spreadsheetId;
  }

  // Search for the matching row
  const targetRowIndex = rows.findIndex(
    (row) =>
      String(row[existingReqIdHeader] ?? "").trim() ===
      String(requestId).trim(),
  );

  // If row is missing, delegate to mock / fallback row insertion
  if (targetRowIndex === -1) {
    console.log(
      `[Mock] Request ID '${requestId}' not found. Fetching details to insert new row...`,
    );

    const newRowData = await getInitialRowValues(
      requestId,
      columnName,
      newValue,
    );

    // Re-use your getOrCreateWorkspaceSpreadsheet helper which appends rows if file exists
    if (parentFolderId) {
      return await getOrCreateWorkspaceSpreadsheet(
        parentFolderId,
        accessToken,
        sheetTitle,
        distinctBy(
          [columnName, ...newRowData.additionalHeaders].filter(Boolean),
          (v) => v,
        ),
        newRowData.rowData,
      );
    }
    return spreadsheetId;
  }

  const targetColumnNorm = normalizeHeader(columnName);
  let targetColumnOriginal = normalizedFieldsMap.get(targetColumnNorm);

  if (!targetColumnOriginal) {
    targetColumnOriginal = columnName;
    fields.push(targetColumnOriginal);
  }

  // Update target value & sanitize nulls
  const sanitizedValue =
    newValue === null || newValue === undefined ? "" : newValue;
  rows[targetRowIndex][targetColumnOriginal] = sanitizedValue;

  const cleanedRows = rows.map((row) => {
    const cleanedRow: RecordRowData = {};
    fields.forEach((field) => {
      const val = row[field];
      cleanedRow[field] = val === null || val === undefined ? "" : val;
    });
    return cleanedRow;
  });

  const updatedCsv = Papa.unparse(
    { fields, data: cleanedRows },
    { newline: "\r\n" },
  );

  // Update existing Google Sheet
  const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${spreadsheetId}?uploadType=media`;
  const updateRes = await fetch(updateUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/csv; charset=UTF-8",
    },
    body: updatedCsv,
  });

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `Failed to update spreadsheet: ${spreadsheetId}`,
    );
  }

  return spreadsheetId;
}
