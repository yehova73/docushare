import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { NewTemplateModalTrigger } from "@/components/modals/new-template-sheet/new-template-sheet";
import { prisma } from "@/lib/prisma";
import { PublicTemplates } from "../_components/public-templates";
import { TemplatesFilters } from "../_components/templates-filters";

const PublicTemplatesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : "";
  const category = typeof sp.category === "string" ? sp.category : "";

  const publicTemplateCategories = await prisma.template.findMany({
    where: {
      userId: null,
      assignationBatches: { none: {} },
      assignationParentTemplate: null,
      templateClientAssignation: null,
    },
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  const categories = publicTemplateCategories
    .map((template) => template.category)
    .filter((category): category is string => category !== null);

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Public Templates"
        description="Browse and import pre-built document templates."
        actions={
          <div className="flex items-center gap-2">
            <TemplatesFilters categories={categories} />
            <NewTemplateModalTrigger />
          </div>
        }
      />
      <PublicTemplates category={category} search={search} />
    </div>
  );
};

export default PublicTemplatesPage;
