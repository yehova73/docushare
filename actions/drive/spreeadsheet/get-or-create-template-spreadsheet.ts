import Papa from "papaparse";

const INDEX_SHEET_NAME = "client-portal-data";
const DEFAULT_HEADERS = [
  "Request Id",
  "Template Id",
  "Sent Date",
  "Client Name",
  "Client Email",
  "Template Name",
  "Status",
  "Due Date",
];

export interface RecordRowData {
  [key: string]: string | number | boolean | null | undefined;
}

export async function getOrCreateWorkspaceSpreadsheet(
  parentFolderId: string,
  accessToken: string,
  sheetTitle: string = INDEX_SHEET_NAME,
  additionalHeaders: string[] = [],
  newRowData?: RecordRowData,
): Promise<string> {
  const sanitizedTitle = sheetTitle.replace(/'/g, "\\'");
  const query = `'${parentFolderId}' in parents and name = '${sanitizedTitle}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`;

  // 1. Search for existing Google Sheet
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query,
  )}&fields=files(id,name)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `Failed to search for spreadsheet: ${sheetTitle}`,
    );
  }

  const searchData = await searchRes.json();
  const existingFile = searchData.files && searchData.files[0];

  // Combine target headers (DEFAULT + additional)
  const targetHeaders = Array.from(
    new Set([...DEFAULT_HEADERS, ...additionalHeaders]),
  );

  // ----------------------------------------------------
  // CASE A: UPDATE EXISTING SPREADSHEET
  // ----------------------------------------------------
  if (existingFile) {
    const fileId = existingFile.id;

    // Export current sheet as CSV string
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`;
    const exportRes = await fetch(exportUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!exportRes.ok) {
      throw new Error(`Failed to download existing spreadsheet data.`);
    }

    const csvText = await exportRes.text();

    // Parse existing CSV using PapaParse
    const parsed = Papa.parse<RecordRowData>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    let existingHeaders = parsed.meta.fields || [];
    let existingRows = parsed.data || [];

    // Identify headers that are missing in the current file
    const missingHeaders = targetHeaders.filter(
      (h) => !existingHeaders.includes(h),
    );

    // Also check if newRowData introduces additional dynamic keys
    if (newRowData) {
      Object.keys(newRowData).forEach((key) => {
        if (!existingHeaders.includes(key) && !missingHeaders.includes(key)) {
          missingHeaders.push(key);
        }
      });
    }

    // Append missing headers to the end of the header list
    const finalHeaders = [...existingHeaders, ...missingHeaders];

    // Append the new row if provided
    if (newRowData) {
      existingRows.push(newRowData);
    }

    // Unparse back to CSV format, enforcing exact column ordering
    const updatedCsv = Papa.unparse(
      {
        fields: finalHeaders,
        data: existingRows,
      },
      { newline: "\r\n" },
    );

    // Overwrite the Google Sheet with updated CSV data
    const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
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
        err.error?.message || `Failed to update Google Sheet content`,
      );
    }

    return fileId;
  }

  // ----------------------------------------------------
  // CASE B: CREATE NEW SPREADSHEET
  // ----------------------------------------------------

  // Combine headers with any dynamic keys found in newRowData
  let allHeaders = [...targetHeaders];
  if (newRowData) {
    const extraKeys = Object.keys(newRowData).filter(
      (k) => !allHeaders.includes(k),
    );
    allHeaders.push(...extraKeys);
  }

  const initialRows = newRowData ? [newRowData] : [];

  // Generate initial CSV content using PapaParse
  const csvContent = Papa.unparse(
    {
      fields: allHeaders,
      data: initialRows,
    },
    { newline: "\r\n" },
  );

  // Upload and convert directly to a Google Sheet
  const metadata = {
    name: sheetTitle,
    mimeType: "application/vnd.google-apps.spreadsheet",
    parents: [parentFolderId],
  };

  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/csv; charset=UTF-8\r\n\r\n" +
    csvContent +
    closeDelimiter;

  const createRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    },
  );

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(
      err.error?.message ||
        `Failed to create converted spreadsheet in Google Drive`,
    );
  }

  const newFile = await createRes.json();
  return newFile.id as string;
}
