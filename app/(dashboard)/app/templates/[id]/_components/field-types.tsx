"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemplateFieldType } from "@/lib/generated/prisma/enums";
import { Plus } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { fieldsDescriptions, getFieldIcon } from "./utils";
import { Draggable, Droppable } from "@hello-pangea/dnd";

function PaletteCard({
  item,
}: {
  item: { type: TemplateFieldType; name: string; description: string };
}) {
  const Icon = getFieldIcon(item.type);
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-shadow hover:shadow-sm">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight">{item.name}</p>
        <p className="text-xs text-muted-foreground leading-snug mt-0.5">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function DraggableFieldItem({
  field,
}: {
  field: { type: TemplateFieldType; name: string; description: string };
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `field-type-${field.type}`,
      data: {
        type: "field-type",
        fieldType: field.type,
        fieldName: field.name,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center justify-between p-3 border rounded-md cursor-grab active:cursor-grabbing hover:bg-muted transition-colors",
        isDragging && "opacity-50 bg-muted",
      )}
    >
      <div>
        <h4 className="text-sm font-medium">{field.name}</h4>
        <p className="text-xs text-muted-foreground">{field.description}</p>
      </div>
      <Button size="sm" variant="ghost" className="pointer-events-none">
        <Plus />
      </Button>
    </li>
  );
}

export const FieldPalette = () => {
  const flatItems = fieldsDescriptions.flatMap((group) =>
    group.items.map((item, index) => ({ ...item, flatIndex: index })),
  );

  let runningIndex = 0;
  const groups = fieldsDescriptions.map((group) => ({
    type: group.type,
    items: group.items.map((item) => ({ ...item, flatIndex: runningIndex++ })),
  }));

  return (
    <aside className="shrink-0 pr-4 h-full overflow-y-auto w-1/3 max-w-[400px]">
      <div className="">
        <h2 className="text-sm font-semibold tracking-tight">Field Types</h2>
        <p className="text-xs text-muted-foreground">Drag into a section</p>
      </div>
      <Droppable
        droppableId="palette"
        isDropDisabled
        renderClone={(provided, snapshot, rubric) => {
          const item = flatItems[rubric.source.index];
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="flex items-start gap-3 rounded-lg border bg-card p-3 shadow-lg ring-2 ring-ring/40"
              style={{ ...provided.draggableProps.style, width: 220 }}
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                {(() => {
                  const Icon = getFieldIcon(item.type);
                  return <Icon className="h-4 w-4" />;
                })()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{item.name}</p>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        }}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mt-3 space-y-5"
          >
            {groups.map((group) => (
              <div key={group.type}>
                <h3 className="mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.type}
                </h3>
                <div className="space-y-2">
                  {group.items.map((item, index) => (
                    <div key={item.type} className="relative">
                      {/* Static card stays in place during drag (the template). */}
                      <PaletteCard item={item} />
                      {/* Transparent draggable overlay on top — this is what gets lifted. */}
                      <Draggable
                        draggableId={`palette-${item.type}`}
                        index={item.flatIndex}
                      >
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...(dragProvided.dragHandleProps as any)}
                            className="absolute inset-0 opacity-0"
                          >
                            <PaletteCard item={item} />
                          </div>
                        )}
                      </Draggable>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Placeholder kept but clipped so it never creates a gap. */}
            <div aria-hidden style={{ height: 0, overflow: "hidden" }}>
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </aside>
  );
};
