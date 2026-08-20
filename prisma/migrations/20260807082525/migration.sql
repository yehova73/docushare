-- CreateTable
CREATE TABLE "FieldCompletionValue" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "assignationId" TEXT NOT NULL,
    "value" TEXT,
    "fileUrls" TEXT[],

    CONSTRAINT "FieldCompletionValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FieldCompletionValue_fieldId_key" ON "FieldCompletionValue"("fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "FieldCompletionValue_fieldId_assignationId_key" ON "FieldCompletionValue"("fieldId", "assignationId");

-- AddForeignKey
ALTER TABLE "FieldCompletionValue" ADD CONSTRAINT "FieldCompletionValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "TemplateField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldCompletionValue" ADD CONSTRAINT "FieldCompletionValue_assignationId_fkey" FOREIGN KEY ("assignationId") REFERENCES "TemplateClientAssignation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
