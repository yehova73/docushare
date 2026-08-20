/*
  Warnings:

  - The values [CHECKBOX,DROPDOWN,RADIO] on the enum `TemplateFieldType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `acceptedMimeTypes` on the `TemplateField` table. All the data in the column will be lost.
  - You are about to drop the column `fieldWidth` on the `TemplateField` table. All the data in the column will be lost.
  - You are about to drop the column `helpText` on the `TemplateField` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `TemplateField` table. All the data in the column will be lost.
  - You are about to drop the column `maxFileSize` on the `TemplateField` table. All the data in the column will be lost.
  - You are about to drop the column `validation` on the `TemplateField` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TemplateFieldType_new" AS ENUM ('TEXT', 'TEXTAREA', 'EMAIL', 'PHONE', 'URL', 'NUMBER', 'FILE', 'IMAGE');
ALTER TABLE "TemplateField" ALTER COLUMN "type" TYPE "TemplateFieldType_new" USING ("type"::text::"TemplateFieldType_new");
ALTER TYPE "TemplateFieldType" RENAME TO "TemplateFieldType_old";
ALTER TYPE "TemplateFieldType_new" RENAME TO "TemplateFieldType";
DROP TYPE "public"."TemplateFieldType_old";
COMMIT;

-- AlterTable
ALTER TABLE "TemplateField" DROP COLUMN "acceptedMimeTypes",
DROP COLUMN "fieldWidth",
DROP COLUMN "helpText",
DROP COLUMN "label",
DROP COLUMN "maxFileSize",
DROP COLUMN "validation";
