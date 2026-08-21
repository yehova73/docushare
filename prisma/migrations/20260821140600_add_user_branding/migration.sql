-- CreateTable
CREATE TABLE "UserBranding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "logoUrl" TEXT,
    "logoKey" TEXT,
    "backgroundColor" TEXT NOT NULL DEFAULT '#0d1420',
    "headerFooterColor" TEXT NOT NULL DEFAULT '#0f172a',
    "primaryColor" TEXT NOT NULL DEFAULT '#6366f1',
    "borderRadius" INTEGER NOT NULL DEFAULT 12,
    "titleTemplate" TEXT NOT NULL DEFAULT 'Hi {client name}, {user name} has requested {item count} items for {template name}.',
    "submittedMessage" TEXT NOT NULL DEFAULT 'Thank you! Your documents have been securely uploaded directly to {user name}''s storage. No further action is needed.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBranding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBranding_userId_key" ON "UserBranding"("userId");

-- AddForeignKey
ALTER TABLE "UserBranding" ADD CONSTRAINT "UserBranding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
