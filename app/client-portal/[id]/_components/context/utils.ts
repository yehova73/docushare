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
