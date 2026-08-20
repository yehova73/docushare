/*
  Warnings:

  - The values [ASSIGNMENT_DUE] on the enum `ReminderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReminderType_new" AS ENUM ('ASSIGNMENT_STARTED', 'ASSIGNMENT_REMINDER', 'ASSIGNMENT_DUE_SOON', 'ASSIGNMENT_OVERDUE', 'ASSIGNMENT_OVERDUE_REMINDER', 'ASSIGNMENT_COMPLETED');
ALTER TABLE "Reminder" ALTER COLUMN "reminderType" TYPE "ReminderType_new" USING ("reminderType"::text::"ReminderType_new");
ALTER TYPE "ReminderType" RENAME TO "ReminderType_old";
ALTER TYPE "ReminderType_new" RENAME TO "ReminderType";
DROP TYPE "public"."ReminderType_old";
COMMIT;
