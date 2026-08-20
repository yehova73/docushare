-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_assignationId_fkey";

-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "fieldCompletionValueId" TEXT,
ADD COLUMN     "reminderId" TEXT;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_assignationId_fkey" FOREIGN KEY ("assignationId") REFERENCES "TemplateClientAssignation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_fieldCompletionValueId_fkey" FOREIGN KEY ("fieldCompletionValueId") REFERENCES "FieldCompletionValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
