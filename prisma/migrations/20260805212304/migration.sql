-- CreateEnum
CREATE TYPE "AssignedTemplateStatus" AS ENUM ('DRAFT', 'ASSIGNED', 'COMPLETED', 'IN_PROGRESS', 'OVERDUE');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "status" "AssignedTemplateStatus";

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
