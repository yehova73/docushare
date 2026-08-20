/*
  Warnings:

  - You are about to drop the column `fileUrls` on the `FieldCompletionValue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FieldCompletionValue" DROP COLUMN "fileUrls";

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "s3Key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fieldCompletionValueId" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_s3Key_key" ON "File"("s3Key");

-- CreateIndex
CREATE INDEX "File_s3Key_idx" ON "File"("s3Key");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fieldCompletionValueId_fkey" FOREIGN KEY ("fieldCompletionValueId") REFERENCES "FieldCompletionValue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
