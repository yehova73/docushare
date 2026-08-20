import { getUserFromSession } from "@/actions/account/account";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { NewTemplateModalTrigger } from "@/components/modals/new-template-sheet/new-template-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { FileCheckCorner, Globe } from "lucide-react";
import { TemplateCard } from "./_components/template-card";
import { PublicTemplates } from "./_components/public-templates";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { FileX } from "lucide-react";
import { AssignWorkflowToClientSheetTrigger } from "@/components/modals/assign-workflow-to-client-sheet/assign-workflow-to-client-sheet";

const TemplatesPage = async () => {
  const user = await getUserFromSession();

  const myTemplates = await prisma.template.findMany({
    where: { userId: user?.id, templateClientAssignation: null },
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

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Template library"
        description="Reusable document checklists for your common workflows."
        actions={
          <div className="flex items-center gap-2">
            <AssignWorkflowToClientSheetTrigger variant="secondary" />
            <NewTemplateModalTrigger />
          </div>
        }
      />
      <Tabs defaultValue="my-templates">
        <TabsList className="mb-2">
          <TabsTrigger value="my-templates">
            <FileCheckCorner />
            My Templates
          </TabsTrigger>
          <TabsTrigger value="public-templates">
            <Globe />
            Public Templates
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-templates">
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
                    You have no templates yet. Click the button above to create
                    your first template.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <NewTemplateModalTrigger />
                </EmptyContent>
              </Empty>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="public-templates">
          <PublicTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesPage;
