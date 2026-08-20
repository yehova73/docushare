-- CreateEnum
CREATE TYPE "ReminderScheduleType" AS ENUM ('AFTER', 'EVERY');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('ASSIGNMENT_STARTED', 'ASSIGNMENT_REMINDER', 'ASSIGNMENT_DUE', 'ASSIGNMENT_DUE_SOON', 'ASSIGNMENT_OVERDUE', 'ASSIGNMENT_OVERDUE_REMINDER', 'ASSIGNMENT_COMPLETED');

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "scheduleType" "ReminderScheduleType" NOT NULL,
    "everyDays" INTEGER,
    "afterDays" INTEGER,
    "reminderType" "ReminderType" NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
