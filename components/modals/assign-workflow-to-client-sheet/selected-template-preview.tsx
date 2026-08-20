"use client";

import { getCompleteTemplateByIdAction } from "@/actions/templates/get-complete-template-by-id";
import { getFieldIcon } from "@/app/(dashboard)/app/templates/[id]/_components/utils";
import { Label } from "@/components/ui/label";
import useServerAction from "@/hooks/use-server-action";
import { TemplateGetPayload } from "@/lib/generated/prisma/models";
import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

export const SelectedTemplatePreview: React.FC<{
  selectedTemplateId?: string;
  defaultOpen?: boolean;
}> = ({ selectedTemplateId, defaultOpen = false }) => {
  const { call: getSelectedTemplate, loading: loadingSelectedTemplate } =
    useServerAction(getCompleteTemplateByIdAction);

  const [viewTemplate, setViewTemplate] = React.useState<
    TemplateGetPayload<{
      include: {
        sections: {
          include: {
            name: true;
            fields: true;
          };
        };
      };
    }>
  >();

  // Track accordion open/close state
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    defaultOpen ? "preview-template" : undefined,
  );

  useEffect(() => {
    if (!selectedTemplateId) return;
    getSelectedTemplate(selectedTemplateId).then((res) => {
      if (res) {
        setViewTemplate(res);
      }
    });
  }, [selectedTemplateId, getSelectedTemplate]);

  // Calculate counts dynamically
  const stats = useMemo(() => {
    if (!viewTemplate?.sections)
      return { sectionsCount: 0, fieldsCount: 0, requiredCount: 0 };

    const sectionsCount = viewTemplate.sections.length;
    let fieldsCount = 0;
    let requiredCount = 0;

    viewTemplate.sections.forEach((section) => {
      if (section.fields) {
        fieldsCount += section.fields.length;
        requiredCount += section.fields.filter(
          (field) => field.required,
        ).length;
      }
    });

    return { sectionsCount, fieldsCount, requiredCount };
  }, [viewTemplate]);

  const isCollapsed = !accordionValue;

  return (
    <div className="space-y-2">
      {/* Show summary text in place of content when collapsed */}
      {isCollapsed && viewTemplate && (
        <div className="text-sm text-muted-foreground">
          {stats.sectionsCount} section
          {stats.sectionsCount !== 1 ? "s" : ""}, {stats.fieldsCount} field
          {stats.fieldsCount !== 1 ? "s" : ""}, {stats.requiredCount} required
        </div>
      )}

      <div className="space-y-4 pt-2">
        {viewTemplate?.sections.map((section) => (
          <div key={section.id}>
            {/* Section Header */}
            <div className="mb-2 ">
              <h3 className="text-sm font-semibold text-card-foreground">
                {section.name}
              </h3>
            </div>

            {/* Fields List */}
            <div className="space-y-2 pl-2 border-l border-primary/50">
              {section.fields && section.fields.length > 0 ? (
                section.fields.map((field) => {
                  const Icon = getFieldIcon(field.type);
                  return (
                    <div
                      key={field.id}
                      className="flex items-start gap-3 rounded-md border border-border/60 bg-muted/40 p-2.5 transition-colors hover:bg-accent/50"
                    >
                      <div className="mt-0.5 rounded p-1 bg-background text-muted-foreground border border-border/40 shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">
                            {field.name}
                          </span>
                          {field.required && (
                            <span className="text-[10px] text-destructive font-semibold">
                              *Required
                            </span>
                          )}
                          {field.type && (
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                              {field.type}
                            </span>
                          )}
                        </div>
                        {field.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {field.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  No fields in this section.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
