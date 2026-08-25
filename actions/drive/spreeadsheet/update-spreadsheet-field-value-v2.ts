import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { capitalize } from "@/lib/utils";

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const DEFAULT_HEADERS = [
  "Request Id",
  "Template Id",
  "Sent Date",
  "Client Name",
  "Client Email",
  "Template Name",
  "Status",
  "Due Date",
] as const;

const HEADER_STYLE: XLSX.CellObject["s"] = {
  font: { bold: true, color: { rgb: "1A3A5C" } },
  fill: { patternType: "solid", fgColor: { rgb: "DDEEFF" } },
  alignment: { horizontal: "left", vertical: "center" },
};

// ─── Drive helpers ────────────────────────────────────────────────────────────

async function driveOverwriteOrCreate(
  fileId: string | undefined,
  parentFolderId: string,
  fileName: string,
  mimeType: string,
  body: Buffer | string,
  accessToken: string,
): Promise<string> {
  const contentType =
    mimeType === XLSX_MIME ? XLSX_MIME : "text/plain; charset=UTF-8";
  const bodyBuffer =
    typeof body === "string" ? Buffer.from(body, "utf-8") : body;

  if (fileId) {
    const patchRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": contentType,
        },
        body: bodyBuffer,
      },
    );

    if (patchRes.ok) return fileId;

    // Fall through to recreate if the file is gone or permission lost
    if (patchRes.status !== 404 && patchRes.status !== 403) {
      const err = await patchRes.json().catch(() => ({}));
      throw new Error(
        err?.error?.message ?? `Drive PATCH failed (${patchRes.status})`,
      );
    }
  }

  // Create new file via multipart upload
  const boundary = "----XLSXBoundary314159";
  const metadata = JSON.stringify({
    name: fileName,
    parents: [parentFolderId],
  });
  const metaPart =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    metadata +
    `\r\n`;
  const dataPart = `--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`;
  const closing = `\r\n--${boundary}--`;

  const parts = [
    Buffer.from(metaPart, "utf-8"),
    Buffer.from(dataPart, "utf-8"),
    bodyBuffer,
    Buffer.from(closing, "utf-8"),
  ];
  const multipart = Buffer.concat(parts);

  const createRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipart,
    },
  );

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(
      err?.error?.message ?? `Drive file create failed (${createRes.status})`,
    );
  }

  const created = await createRes.json();
  return created.id as string;
}

/** Find a plain-text file by name inside a Drive folder, returns its ID or null. */
async function findFileInFolder(
  folderName: string,
  parentFolderId: string,
  accessToken: string,
): Promise<string | null> {
  const safeName = folderName.replace(/'/g, "\\'");
  const q = `'${parentFolderId}' in parents and name = '${safeName}' and mimeType = 'text/plain' and trashed = false`;
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}

// ─── XLSX builder ─────────────────────────────────────────────────────────────

function buildXlsx(headers: string[], rows: (string | number)[][]): Buffer {
  const headerRow: XLSX.CellObject[] = headers.map((h) => ({
    v: h,
    t: "s",
    s: HEADER_STYLE,
  }));

  const dataRows: XLSX.CellObject[][] = rows.map((row) =>
    row.map((cell) => ({ v: cell ?? "", t: "s" })),
  );

  const aoa: XLSX.CellObject[][] = [headerRow, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Freeze top row
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Auto column widths based on longest value
  ws["!cols"] = headers.map((h, colIdx) => {
    const maxLen = Math.max(
      h.length,
      ...rows.map((r) => String(r[colIdx] ?? "").length),
    );
    return { wch: Math.min(maxLen + 2, 60) };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Requests");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return buffer;
}

// ─── TXT builder ──────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

type AssignationWithDetail = Awaited<ReturnType<typeof fetchAssignationDetail>>;

async function fetchAssignationDetail(requestId: string) {
  return prisma.templateClientAssignation.findUniqueOrThrow({
    where: { id: requestId },
    include: {
      client: true,
      template: {
        include: {
          sections: {
            orderBy: { order: "asc" },
            include: {
              fields: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
      completionValues: {
        include: { files: true },
      },
    },
  });
}

function buildTxt(assignation: AssignationWithDetail): string {
  const clientName = assignation.client?.name ?? "Unknown Client";
  const templateName = assignation.template?.name ?? "Unknown Template";
  const status = capitalize(
    (assignation.status ?? "").toLowerCase().replaceAll("_", " "),
  );
  const dueDate = assignation.dueDate?.toDateString() ?? "—";

  const completionMap = new Map(
    assignation.completionValues.map((cv) => [cv.fieldId, cv]),
  );

  const lines: string[] = [
    `=== ${clientName} - ${templateName} ===`,
    `Portal: ${BASE_URL}/client-portal/${assignation.id}`,
    `Status: ${status}`,
    `Due Date: ${dueDate}`,
    "",
  ];

  for (const section of assignation.template?.sections ?? []) {
    lines.push(`--- ${section.name} ---`);

    for (const field of section.fields) {
      const cv = completionMap.get(field.id);
      const isFileField = field.type === "FILE" || field.type === "IMAGE";

      if (isFileField) {
        const files = cv?.files ?? [];
        if (files.length === 0) {
          lines.push(`${field.name}: —`);
        } else {
          for (const f of files) {
            const link = f.driveFileUrl ?? `${BASE_URL}/api/files/${f.id}`;
            lines.push(`${field.name}: [${f.fileName}] ${link}`);
          }
        }
      } else {
        lines.push(`${field.name}: ${cv?.value ?? "—"}`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

// ─── All-assignations loader for the main spreadsheet ─────────────────────────

async function fetchAllAssignationsForFolder(templateFolderId: string) {
  return prisma.templateClientAssignation.findMany({
    where: { templateFolderId },
    include: {
      client: true,
      template: {
        include: {
          sections: {
            orderBy: { order: "asc" },
            include: {
              fields: { orderBy: { order: "asc" } },
            },
          },
        },
      },
      completionValues: true,
    },
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface UpdateSpreadsheetV2Params {
  spreadsheetId?: string;
  clientSummaryFileId?: string;
  accessToken: string;
  requestId: string;
  parentFolderId: string;
  clientFolderId: string;
  sheetTitle?: string;
}

export interface UpdateSpreadsheetV2Result {
  spreadsheetId: string;
  clientSummaryFileId: string;
}

export async function updateSpreadsheetFieldValueV2({
  spreadsheetId,
  clientSummaryFileId,
  accessToken,
  requestId,
  parentFolderId,
  clientFolderId,
  sheetTitle = "Requests",
}: UpdateSpreadsheetV2Params): Promise<UpdateSpreadsheetV2Result> {
  const [allAssignations, assignationDetail] = await Promise.all([
    fetchAllAssignationsForFolder(parentFolderId),
    fetchAssignationDetail(requestId),
  ]);

  // ── Build XLSX ────────────────────────────────────────────────────────────

  // Collect all field names across every assignation (ordered, distinct)
  const fieldNamesSeen = new Set<string>();
  const orderedFieldNames: string[] = [];
  for (const a of allAssignations) {
    for (const section of a.template?.sections ?? []) {
      for (const field of section.fields) {
        if (!fieldNamesSeen.has(field.name)) {
          fieldNamesSeen.add(field.name);
          orderedFieldNames.push(field.name);
        }
      }
    }
  }

  const headers = [...DEFAULT_HEADERS, ...orderedFieldNames];

  const dataRows = allAssignations.map((a) => {
    const cvMap = new Map(a.completionValues.map((cv) => [cv.fieldId, cv]));

    // Build a fieldId→name lookup for this assignation
    const fieldIdToName = new Map<string, string>();
    for (const section of a.template?.sections ?? []) {
      for (const f of section.fields) fieldIdToName.set(f.id, f.name);
    }

    const base: (string | number)[] = [
      a.id,
      a.templateId,
      a.submittedAt?.toDateString() ?? "",
      a.client?.name ?? "",
      a.client?.email ?? "",
      a.template?.name ?? "",
      capitalize((a.status ?? "").toLowerCase().replaceAll("_", " ")),
      a.dueDate?.toDateString() ?? "",
    ];

    const fieldValues = orderedFieldNames.map((fieldName) => {
      // Find the cv whose field name matches
      for (const [fieldId, cv] of cvMap) {
        if (fieldIdToName.get(fieldId) === fieldName) {
          return cv.value ?? "";
        }
      }
      return "";
    });

    return [...base, ...fieldValues];
  });

  const xlsxBuffer = buildXlsx(headers, dataRows);

  // ── Build TXT ─────────────────────────────────────────────────────────────

  const txtContent = buildTxt(assignationDetail);
  const txtFileName =
    `${assignationDetail.client?.name ?? "client"}-summary.txt`
      .toLowerCase()
      .replace(/[^a-z0-9-_.]/g, "-");

  // Resolve existing TXT file ID: prefer stored ID, fall back to Drive search
  const existingTxtId =
    clientSummaryFileId ??
    (await findFileInFolder(txtFileName, clientFolderId, accessToken));

  // ── Upload both in parallel ───────────────────────────────────────────────

  const [newSpreadsheetId, newClientSummaryFileId] = await Promise.all([
    driveOverwriteOrCreate(
      spreadsheetId,
      parentFolderId,
      `${sheetTitle}.xlsx`,
      XLSX_MIME,
      xlsxBuffer,
      accessToken,
    ),
    driveOverwriteOrCreate(
      existingTxtId ?? undefined,
      clientFolderId,
      txtFileName,
      "text/plain",
      txtContent,
      accessToken,
    ),
  ]);

  return {
    spreadsheetId: newSpreadsheetId,
    clientSummaryFileId: newClientSummaryFileId,
  };
}
