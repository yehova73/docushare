-- CreateEnum
CREATE TYPE "TemplateAssignationBatchStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateTable
CREATE TABLE "TemplateAssignationBatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "status" "TemplateAssignationBatchStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateAssignationBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateAssignationBatchClient" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TemplateAssignationBatchClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemplateAssignationBatch_userId_idx" ON "TemplateAssignationBatch"("userId");

-- CreateIndex
CREATE INDEX "TemplateAssignationBatch_templateId_idx" ON "TemplateAssignationBatch"("templateId");

-- CreateIndex
CREATE INDEX "TemplateAssignationBatchClient_clientId_idx" ON "TemplateAssignationBatchClient"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateAssignationBatchClient_batchId_clientId_key" ON "TemplateAssignationBatchClient"("batchId", "clientId");

-- AddForeignKey
ALTER TABLE "TemplateAssignationBatch" ADD CONSTRAINT "TemplateAssignationBatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateAssignationBatch" ADD CONSTRAINT "TemplateAssignationBatch_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateAssignationBatchClient" ADD CONSTRAINT "TemplateAssignationBatchClient_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "TemplateAssignationBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateAssignationBatchClient" ADD CONSTRAINT "TemplateAssignationBatchClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
