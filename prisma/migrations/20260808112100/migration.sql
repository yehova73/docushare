-- CreateTable
CREATE TABLE "GoogleDriveAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleDriveAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleDriveAccount_userId_key" ON "GoogleDriveAccount"("userId");

-- AddForeignKey
ALTER TABLE "GoogleDriveAccount" ADD CONSTRAINT "GoogleDriveAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
