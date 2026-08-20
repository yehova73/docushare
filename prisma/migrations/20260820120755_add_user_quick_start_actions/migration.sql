-- CreateTable
CREATE TABLE "UserQuickStartActions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdFirstTemplate" BOOLEAN NOT NULL DEFAULT false,
    "addedFirstClient" BOOLEAN NOT NULL DEFAULT false,
    "connectedGoogleDrive" BOOLEAN NOT NULL DEFAULT false,
    "createdDocumentRequest" BOOLEAN NOT NULL DEFAULT false,
    "sentFirstRequest" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserQuickStartActions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserQuickStartActions_userId_key" ON "UserQuickStartActions"("userId");

-- AddForeignKey
ALTER TABLE "UserQuickStartActions" ADD CONSTRAINT "UserQuickStartActions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
