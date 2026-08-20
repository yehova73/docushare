-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "batchId" TEXT;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "TemplateAssignationBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
