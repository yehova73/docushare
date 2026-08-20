// Shared file validation logic for upload & replace flows.

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export const BLOCKED_EXTENSIONS = new Set([
  // Executables
  "exe",
  "bat",
  "cmd",
  "com",
  "scr",
  "msi",
  "app",
  "dmg",
  "bin",
  // Scripts
  "sh",
  "bash",
  "py",
  "js",
  "ts",
  "jsx",
  "tsx",
  "vbs",
  "jar",
  "class",
  // Archives (can contain malicious files)
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  // Libraries/System
  "dll",
  "so",
  "dylib",
  "ko",
  // Others
  "pkg",
]);

export const ALLOWED_IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "tiff",
]);

export const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  // Documents
  "pdf",
  "doc",
  "docx",
  "txt",
  "rtf",
  "odt",
  // Spreadsheets
  "xls",
  "xlsx",
  "csv",
  "ods",
  // Presentations
  "ppt",
  "pptx",
  "odp",
  // Other
  "json",
  "xml",
]);

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function validateFile(
  file: File,
  isImageField: boolean,
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size exceeds ${sizeMB}MB limit. Please choose a smaller file.`,
    };
  }

  const extension = getFileExtension(file.name);

  // Check for blocked extensions
  if (BLOCKED_EXTENSIONS.has(extension)) {
    return {
      valid: false,
      error: `File type ".${extension}" is not allowed for security reasons.`,
    };
  }

  // Validate based on field type
  if (isImageField) {
    if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
      return {
        valid: false,
        error: `Only image files are allowed for this field. Supported formats: ${Array.from(ALLOWED_IMAGE_EXTENSIONS).join(", ")}`,
      };
    }
  } else {
    // For document fields, allow documents or images
    if (
      !ALLOWED_DOCUMENT_EXTENSIONS.has(extension) &&
      !ALLOWED_IMAGE_EXTENSIONS.has(extension)
    ) {
      const allowed = Array.from(
        new Set([...ALLOWED_DOCUMENT_EXTENSIONS, ...ALLOWED_IMAGE_EXTENSIONS]),
      ).join(", ");
      return {
        valid: false,
        error: `File type not allowed. Supported formats: ${allowed}`,
      };
    }
  }

  return { valid: true };
}
