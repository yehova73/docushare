-- AlterTable
ALTER TABLE "TemplateClientAssignation" ADD COLUMN     "completedFieldsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedSectionsCount" INTEGER NOT NULL DEFAULT 0;
