-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "assignationParentTemplateId" TEXT;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_assignationParentTemplateId_fkey" FOREIGN KEY ("assignationParentTemplateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
