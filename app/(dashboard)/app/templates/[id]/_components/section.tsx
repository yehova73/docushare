import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TemplateSection } from "@/lib/generated/prisma/browser";
import { TemplateSectionGetPayload } from "@/lib/generated/prisma/models";
import { useEditTemplate } from "./context/edit-template-context";
import FieldItem from "./field-item";

export default function Section({
  section,
  index,
}: {
  section: TemplateSectionGetPayload<{ include: { fields: true } }>;
  index: number;
}) {
  const { renameSection, deleteSection, updateField, deleteField } =
    useEditTemplate();
  const [expanded, setExpanded] = useState(true);
  return (
    <Draggable draggableId={section.id} index={index}>
      {(dragProvided, dragSnapshot) => (
        <div
          ref={dragProvided.innerRef}
          {...(dragProvided.draggableProps as any)}
          className={`rounded-xl border bg-card shadow-sm transition-shadow ${
            dragSnapshot.isDragging ? "shadow-lg ring-2 ring-ring/30" : ""
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <button
              {...dragProvided.dragHandleProps}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              aria-label="Drag section"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <Input
              value={section.name}
              onChange={(e) => renameSection(section.id, e.target.value)}
              className="h-8 border-none shadow-none focus-visible:ring-0 px-1 font-medium text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => deleteSection(section.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {expanded && (
            <Droppable droppableId={section.id}>
              {(dropProvided, snapshot) => (
                <div
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  className={`p-3 space-y-2 border-t transition-colors rounded-b-xl ${
                    snapshot.isDraggingOver ? "bg-primary/5" : ""
                  }`}
                >
                  {section.fields.length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex items-center justify-center h-20 text-xs text-muted-foreground border border-dashed rounded-lg">
                      Drop fields here
                    </div>
                  )}
                  {section.fields.map((field, fIndex) => (
                    <FieldItem
                      key={field.id}
                      field={field}
                      sectionId={section.id}
                      index={fIndex}
                    />
                  ))}
                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
}
