-- AlterTable
ALTER TABLE "TemplateClientAssignation" ALTER COLUMN "lastActivityAt" DROP NOT NULL,
ALTER COLUMN "lastActivityAt" DROP DEFAULT;
