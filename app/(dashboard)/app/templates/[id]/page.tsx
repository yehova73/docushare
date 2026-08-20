import { getUserFromSession } from "@/actions/account/account";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditTemplateProvider } from "./_components/context/edit-template-context";
import TemplateDragDropBuilder from "./_components/template-drag-drop-builder";
import { TemplateHeaderActions } from "./_components/TemplateHeaderActions";

const TemplatesPage: React.FC<{
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}> = async ({ params, searchParams }) => {
  const { id } = await params;
  const query = await searchParams;
  const batchId =
    typeof query?.batchId === "string" ? query.batchId : undefined;

  const user = await getUserFromSession();

  const template = await prisma.template.findUnique({
    where: { id, userId: user?.id },
    include: {
      sections: {
        include: {
          fields: true,
        },
      },
    },
  });

  if (!template) {
    return notFound();
  }

  return (
    <EditTemplateProvider initialTemplate={template}>
      <div className="space-y-6 w-full mx-auto">
        <DashboardPageHeader
          title={`${template.category} / ${template.name}`}
          description={template.description || "No description provided"}
          actions={<TemplateHeaderActions batchId={batchId} />}
        />
        <TemplateDragDropBuilder />
      </div>
    </EditTemplateProvider>
  );
};

export default TemplatesPage;
