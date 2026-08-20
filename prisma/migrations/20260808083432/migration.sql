-- AlterTable
ALTER TABLE "TemplateClientAssignation" ADD COLUMN     "totalFieldsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalRequiredFieldsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSectionsCount" INTEGER NOT NULL DEFAULT 0;
