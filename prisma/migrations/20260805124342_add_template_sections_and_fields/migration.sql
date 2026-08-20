/*
  Warnings:

  - The values [PARAGRAPH,INPUT] on the enum `TemplateFieldType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `templateId` on the `TemplateField` table. All the data in the column will be lost.
  - Added the required column `sectionId` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TemplateFieldType_new" AS ENUM ('TEXT', 'TEXTAREA', 'EMAIL', 'PHONE', 'URL', 'NUMBER', 'FILE', 'IMAGE', 'CHECKBOX', 'DROPDOWN', 'RADIO');
ALTER TABLE "TemplateField" ALTER COLUMN "type" TYPE "TemplateFieldType_new" USING ("type"::text::"TemplateFieldType_new");
ALTER TYPE "TemplateFieldType" RENAME TO "TemplateFieldType_old";
ALTER TYPE "TemplateFieldType_new" RENAME TO "TemplateFieldType";
DROP TYPE "public"."TemplateFieldType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "TemplateField" DROP CONSTRAINT "TemplateField_templateId_fkey";

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "headerImage" TEXT;

-- AlterTable
ALTER TABLE "TemplateField" DROP COLUMN "templateId",
ADD COLUMN     "acceptedMimeTypes" TEXT,
ADD COLUMN     "allowMultiple" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "characterLimit" INTEGER,
ADD COLUMN     "fieldWidth" TEXT DEFAULT 'full',
ADD COLUMN     "helpText" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "maxFileSize" INTEGER,
ADD COLUMN     "sectionId" TEXT NOT NULL,
ADD COLUMN     "validation" TEXT;

-- CreateTable
CREATE TABLE "TemplateSection" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Untitled Section',
    "order" INTEGER NOT NULL DEFAULT 0,
    "collapsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TemplateSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateSection" ADD CONSTRAINT "TemplateSection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateField" ADD CONSTRAINT "TemplateField_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "TemplateSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
