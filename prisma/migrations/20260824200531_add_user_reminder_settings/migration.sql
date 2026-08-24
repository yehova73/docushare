-- CreateTable
CREATE TABLE "UserReminderSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "senderName" TEXT NOT NULL DEFAULT 'Tabzo',
    "sendingHour" INTEGER NOT NULL DEFAULT 9,

    CONSTRAINT "UserReminderSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserReminderSettings_userId_key" ON "UserReminderSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserReminderSettings" ADD CONSTRAINT "UserReminderSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
