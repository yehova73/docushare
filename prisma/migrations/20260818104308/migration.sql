-- CreateEnum
CREATE TYPE "ActivityLogType" AS ENUM ('REMINDER', 'CLIENT_FIELD_UPDATE');

-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "type" "ActivityLogType" NOT NULL DEFAULT 'CLIENT_FIELD_UPDATE';
