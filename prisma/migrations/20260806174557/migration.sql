/*
  Warnings:

  - You are about to drop the column `clientId` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Template` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_clientId_fkey";

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "clientId",
DROP COLUMN "dueDate",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "TemplateClientAssignation" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "templateId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "status" "AssignedTemplateStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "TemplateClientAssignation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateClientAssignation_templateId_key" ON "TemplateClientAssignation"("templateId");

-- AddForeignKey
ALTER TABLE "TemplateClientAssignation" ADD CONSTRAINT "TemplateClientAssignation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateClientAssignation" ADD CONSTRAINT "TemplateClientAssignation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
