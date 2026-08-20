-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "assignmentId" TEXT;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "TemplateClientAssignation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
