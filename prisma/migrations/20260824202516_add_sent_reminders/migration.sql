-- CreateTable
CREATE TABLE "SentReminder" (
    "id" TEXT NOT NULL,
    "reminderId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "occurrenceKey" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "providerId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SentReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SentReminder_userId_sentAt_idx" ON "SentReminder"("userId", "sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "SentReminder_reminderId_assignmentId_occurrenceKey_key" ON "SentReminder"("reminderId", "assignmentId", "occurrenceKey");

-- AddForeignKey
ALTER TABLE "SentReminder" ADD CONSTRAINT "SentReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentReminder" ADD CONSTRAINT "SentReminder_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentReminder" ADD CONSTRAINT "SentReminder_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "TemplateClientAssignation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
