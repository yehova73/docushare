"use client";

import { Button } from "@/components/ui/button";
import { TemplateField } from "@/lib/generated/prisma/browser";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useEditTemplate } from "./context/edit-template-context";
import { FieldPalette } from "./field-types";
import { findFieldType } from "./utils";
import Section from "./section";
import MobilePreview from "./mobile-preview";

let counter = 0;
const genFieldId = () => `field_${Date.now()}_${counter++}`;
const genSectionId = () => `section_${Date.now()}_${counter++}`;

export default function TemplateDragDropBuilder() {
  const { template, setTemplate, addEmptySection, deleteField } =
    useEditTemplate();

  const sections = useMemo(() => template.sections, [template.sections]);

  const onDragEnd: (result: any) => void = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    // Reorder sections
    if (
      source.droppableId === "sections" &&
      destination.droppableId === "sections"
    ) {
      const next = [...template.sections];
      const [moved] = next.splice(source.index, 1);
      next.splice(destination.index, 0, moved);
      setTemplate({ ...template, sections: next });
      return;
    }

    // Drop a field type from the palette into a section
    if (source.droppableId === "palette") {
      const type = result.draggableId.replace("palette-", "");
      const ft = findFieldType(type);
      const newField: TemplateField = {
        id: genFieldId(),
        type,
        name: ft?.name ?? "Field",
        description: ft?.description ?? "",
        allowMultiple: false,
        required: false,
        characterLimit: null,
        order: 0,
        placeholder: "",
        sectionId: destination.droppableId,
      };
      const updated = {
        ...template,
        sections: template.sections.map((s) => {
          if (s.id !== destination.droppableId) return s;
          const next = [...s.fields];
          next.splice(destination.index, 0, newField);
          return { ...s, fields: next };
        }),
      };
      setTemplate(updated);
      return;
    }

    // Move/reorder an existing field within or between sections
    const next = template.sections.map((s) => ({
      ...s,
      fields: [...s.fields],
    }));
    const fromSection = next.find((s) => s.id === source.droppableId);
    const toSection = next.find((s) => s.id === destination.droppableId);
    if (!fromSection || !toSection) return;
    const [moved] = fromSection.fields.splice(source.index, 1);
    toSection.fields.splice(destination.index, 0, moved);
    setTemplate({ ...template, sections: next });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-between w-full mx-auto">
        <FieldPalette />
        <div className=" border-r border-border self-stretch" />
        <main className="flex-1 flex grow flex-col min-w-0 col-span-2 px-4 max-w-3xl">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Form Builder
              </h1>
              <p className="text-xs text-muted-foreground">
                Drag field types into sections, reorder or delete them
              </p>
            </div>
            <Button onClick={() => addEmptySection()} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Section
            </Button>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto  mt-6">
              <Droppable droppableId="sections" type="SECTION">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4"
                  >
                    {sections.length === 0 && (
                      <div className="text-center py-20 text-sm text-muted-foreground">
                        No sections yet. Add one to get started.
                      </div>
                    )}
                    {sections.map((section, index) => (
                      <Section
                        key={section.id}
                        section={section}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </main>
        <div className=" border-l border-border self-stretch" />
        <MobilePreview />
      </div>
    </DragDropContext>
  );
}
