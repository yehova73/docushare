import { getUserFromSession } from "@/actions/account/account";
import { getTemplateCategoriesAction } from "@/actions/templates/get-template-categories";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { NewTemplateModalTrigger } from "@/components/modals/new-template-sheet/new-template-sheet";
import { prisma } from "@/lib/prisma";
import { FileX } from "lucide-react";
import { TemplateCard } from "./_components/template-card";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { TemplatesFilters } from "./_components/templates-filters";

const TemplatesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const user = await getUserFromSession();

  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : "";
  const category = typeof sp.category === "string" ? sp.category : "";

  const categories = (await getTemplateCategoriesAction()).data ?? [];

  const myTemplates = await prisma.template.findMany({
    where: {
      userId: user?.id,
      templateClientAssignation: null,
      assignationBatches: { none: {} },
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(category ? { category } : {}),
    },
    include: {
      _count: {
        select: {
          assignationChildren: true,
        },
      },
      sections: {
        include: {
          fields: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const hasFilters = Boolean(search || category);

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Template library"
        description="Reusable document checklists for your common workflows."
        actions={
          <div className="flex items-center gap-2">
            <TemplatesFilters categories={categories} />
            <NewTemplateModalTrigger />
          </div>
        }
      />
      {myTemplates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myTemplates.map((template, i) => (
            <TemplateCard
              key={template.id}
              index={i}
              template={{
                id: template.id,
                category: template.category || "No category",
                itemCount: template.totalFields || 0,
                sectionsCount: template.totalSections || 0,
                usageCount: template._count.assignationChildren,
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
            />
          ))}
        </div>
      ) : (
        <Card>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant={"icon"}>
                <FileX />
              </EmptyMedia>
              <EmptyTitle>No templates found</EmptyTitle>
              <EmptyDescription>
                {hasFilters
                  ? "Try adjusting your search or filters."
                  : "You have no templates yet. Click the button above to create your first template."}
              </EmptyDescription>
              {!hasFilters && (
                <EmptyContent>
                  <NewTemplateModalTrigger />
                </EmptyContent>
              )}
            </EmptyHeader>
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default TemplatesPage;
