import {
  TemplateField,
  TemplateFieldType,
} from "@/lib/generated/prisma/browser";
import { ClientWorkflowPayload, PortalItem, PortalSection } from "./types";

export function transformWorkflowToSections(
  workflow: ClientWorkflowPayload,
): PortalSection[] {
  const sections: PortalSection[] = [];

  // Sort sections by order
  const templateSections = (workflow.template?.sections ?? []).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  for (const section of templateSections) {
    // Sort fields by order
    const fields = (section.fields ?? []).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );

    const items: PortalItem[] = [];
    for (const field of fields) {
      items.push({
        ...field,
        status: "pending",
        value: field.completionValue?.value ?? undefined,
      });
    }

    sections.push({
      id: section.id,
      name: section.name,
      items,
    });
  }

  return sections;
}

export function formatDueDate(dueDate: Date | null | undefined): string {
  if (!dueDate) return "No due date";

  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`;
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else {
    const dayName = dueDate.toLocaleDateString("en-US", { weekday: "long" });
    return `Due in ${diffDays} days · ${dayName}`;
  }
}

export const isTextField = (field: TemplateField): boolean =>
  field.type === TemplateFieldType.TEXT ||
  field.type === TemplateFieldType.TEXTAREA ||
  field.type === TemplateFieldType.EMAIL ||
  field.type === TemplateFieldType.PHONE ||
  field.type === TemplateFieldType.URL ||
  field.type === TemplateFieldType.NUMBER;

export const PORTAL_BRANDING_DEFAULTS = {
  name: null,
  logoUrl: null,
  backgroundColor: "#0d1420",
  headerFooterColor: "#0f172a",
  primaryColor: "#6366f1",
  fieldBackgroundColor: "#0a0f1c",
  sectionCardBackgroundColor: "#0f172a",
  sectionTitleColor: "#f8fafc",
  fieldTitleColor: "#f1f5f9",
  fieldSubtitleColor: "#94a3b8",
  inputBackgroundColor: "#111a2b",
  uploadBackgroundColor: "#0d1420",
  borderRadius: 12,
  titleTemplate:
    "Hi {client name}, {user name} has requested {item count} items for {template name}.",
  submittedMessage:
    "Thank you! Your documents have been securely uploaded directly to {user name}'s storage. No further action is needed.",
} as const;

export function formatPortalMessage(
  template: string,
  values: {
    clientName?: string;
    userName?: string;
    itemCount?: number | string;
    templateName?: string;
  },
): string {
  return template
    .replace(/\{client ?name\}/gi, values.clientName ?? "")
    .replace(/\{user ?name\}/gi, values.userName ?? "")
    .replace(/\{item ?count\}/gi, String(values.itemCount ?? ""))
    .replace(/\{template ?name\}/gi, values.templateName ?? "");
}

export function getContrastColor(hex: string): string {
  const h = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return "#ffffff";
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0d1420" : "#ffffff";
}
