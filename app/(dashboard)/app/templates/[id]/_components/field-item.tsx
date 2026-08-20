import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TemplateSectionGetPayload } from "@/lib/generated/prisma/models";
import { TemplateFieldType } from "@/lib/generated/prisma/enums";
import { useEditTemplate } from "./context/edit-template-context";
import { findFieldType, getFieldIcon } from "./utils";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function FieldItem({
  field,
  sectionId,
  index,
}: {
  field: TemplateSectionGetPayload<{ include: { fields: true } }>["fields"][0];
  sectionId: string;
  index: number;
}) {
  const { updateField, deleteField } = useEditTemplate();
  const [expanded, setExpanded] = useState(false);
  const ft = findFieldType(field.type);
  const Icon = getFieldIcon(field.type);

  const isFileOrImage =
    field.type === TemplateFieldType.FILE ||
    field.type === TemplateFieldType.IMAGE;

  return (
    <Draggable key={field.id} draggableId={field.id} index={index}>
      {(fProvided, fSnapshot) => (
        <div
          ref={fProvided.innerRef}
          {...(fProvided.draggableProps as any)}
          className={`rounded-lg border bg-background transition-shadow ${
            fSnapshot.isDragging ? "shadow-md ring-2 ring-ring/30" : ""
          }`}
        >
          {/* Header Row */}
          <div className="flex items-center gap-2 p-2">
            <span
              {...fProvided.dragHandleProps}
              className="cursor-grab active:cursor-grabbing text-muted-foreground"
            >
              <GripVertical className="h-4 w-4" />
            </span>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground w-20 shrink-0">
              {ft?.name ?? field.type}
            </span>
            <Input
              value={field.name}
              onChange={(e) =>
                updateField(sectionId, field.id, {
                  name: e.target.value,
                })
              }
              placeholder="Field name"
              className="h-7 text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => deleteField(sectionId, field.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="border-t px-2 py-3 space-y-3 text-sm">
              <div>
                <Label className="block text-xs font-medium text-muted-foreground mb-1">
                  Field Label
                </Label>
                <Input
                  value={field.name || ""}
                  onChange={(e) =>
                    updateField(sectionId, field.id, {
                      name: e.target.value || "",
                    })
                  }
                  placeholder="Field label"
                  className="h-8 text-xs"
                />
              </div>
              {/* Description */}
              <div>
                <Label className="block text-xs font-medium text-muted-foreground mb-1">
                  Description
                </Label>
                <Input
                  value={field.description || ""}
                  onChange={(e) =>
                    updateField(sectionId, field.id, {
                      description: e.target.value || null,
                    })
                  }
                  placeholder="Field description"
                  className="h-8 text-xs"
                />
              </div>

              {/* Placeholder */}
              <div>
                <Label className="block text-xs font-medium text-muted-foreground mb-1">
                  Placeholder
                </Label>
                <Input
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    updateField(sectionId, field.id, {
                      placeholder: e.target.value || null,
                    })
                  }
                  placeholder="Placeholder text"
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`required-${field.id}`}
                  className="text-xs font-medium text-muted-foreground cursor-pointer w-[120px]"
                >
                  Required
                </Label>
                <Checkbox
                  id={`required-${field.id}`}
                  checked={field.required}
                  onCheckedChange={(checked) =>
                    updateField(sectionId, field.id, {
                      required: checked as boolean,
                    })
                  }
                />
              </div>
              {/* Order */}
              {/* <div>
                <Label className="block text-xs font-medium text-muted-foreground mb-1">
                  Order
                </Label>
                <Input
                  type="number"
                  value={field.order}
                  onChange={(e) =>
                    updateField(sectionId, field.id, {
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="h-8 text-xs"
                />
              </div> */}

              {/* Allow Multiple - Only for File/Image */}
              {isFileOrImage && (
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`allow-multiple-${field.id}`}
                    className="text-xs font-medium text-muted-foreground cursor-pointer w-[120px]"
                  >
                    Allow multiple files
                  </Label>
                  <Checkbox
                    id={`allow-multiple-${field.id}`}
                    checked={field.allowMultiple}
                    onCheckedChange={(checked) =>
                      updateField(sectionId, field.id, {
                        allowMultiple: checked as boolean,
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
