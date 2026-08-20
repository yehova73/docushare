import { prisma } from "@/lib/prisma";
import { TemplateCard } from "./template-card";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FileX } from "lucide-react";

export const PublicTemplates = async () => {
  const publicTemplates = await prisma.template.findMany({
    where: { userId: null, templateClientAssignation: null },
    include: {
      sections: {
        include: {
          fields: true,
        },
      },
    },
  });

  if (!publicTemplates || publicTemplates.length === 0) {
    return (
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <FileX />
            </EmptyMedia>
            <EmptyTitle>No public templates found</EmptyTitle>
            <EmptyDescription>
              There are no public templates available at the moment. Please
              check back later or create your own templates.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {publicTemplates.map((template, i) => (
        <TemplateCard
          key={template.id}
          index={i}
          template={{
            id: template.id,
            category: template.category || "No category",
            itemCount: template.totalFields,
            sectionsCount: template.totalSections,
            usageCount: 0,
            name: template.name,
            description: template.description || "",
            items: template.sections.flatMap((section) =>
              section.fields.map((field) => ({
                id: field.id,
                title: field.name,
                type: field.type,
              })),
            ),
          }}
          isPublicTemplate
        />
      ))}
    </div>
  );
};
