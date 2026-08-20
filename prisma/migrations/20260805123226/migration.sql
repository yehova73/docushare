-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'PAYMENT_FAILED');

-- CreateEnum
CREATE TYPE "SubscriptionPeriod" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "TemplateFieldType" AS ENUM ('PARAGRAPH', 'FILE', 'IMAGE', 'URL', 'EMAIL', 'PHONE', 'INPUT');

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetTokenExp" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "hasCompletedOnboardingAt" TIMESTAMP(3),
    "trialStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trialEndsAt" TIMESTAMP(3),
    "signedUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSetupChecklist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstLocationAdded" BOOLEAN NOT NULL DEFAULT true,
    "aiRepliesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "enabledNotifications" BOOLEAN NOT NULL DEFAULT false,
    "refinedBrandVoice" BOOLEAN NOT NULL DEFAULT false,
    "addedAnotherLocation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSetupChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeEmailToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "newEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedAt" TIMESTAMP(3),
    "invalidatedAt" TIMESTAMP(3),

    CONSTRAINT "ChangeEmailToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserFeatureAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspacesLimit" INTEGER DEFAULT 3,
    "workspaceLinksLimit" INTEGER DEFAULT 20,
    "workspaceDashboardPageAccess" BOOLEAN NOT NULL DEFAULT false,
    "groupsAccess" BOOLEAN NOT NULL DEFAULT false,
    "autoSnapshotsAccess" BOOLEAN NOT NULL DEFAULT false,
    "snapshotDaysRetention" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "UserFeatureAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "stripePriceId" TEXT,
    "type" "SubscriptionType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "subscriptionStartedAt" TIMESTAMP(3),
    "subscriptionCanceledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "cancelationFeedback" TEXT,
    "priceId" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "rating" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "importantNotifications" BOOLEAN NOT NULL DEFAULT true,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT true,
    "devUpdates" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangePasswordToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedAt" TIMESTAMP(3),
    "invalidatedAt" TIMESTAMP(3),

    CONSTRAINT "ChangePasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateField" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "placeholder" TEXT,
    "type" "TemplateFieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TemplateField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "User"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "UserSetupChecklist_userId_key" ON "UserSetupChecklist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "UserFeatureAccess_userId_key" ON "UserFeatureAccess"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationSettings_userId_key" ON "UserNotificationSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSetupChecklist" ADD CONSTRAINT "UserSetupChecklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeEmailToken" ADD CONSTRAINT "ChangeEmailToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeatureAccess" ADD CONSTRAINT "UserFeatureAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotificationSettings" ADD CONSTRAINT "UserNotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangePasswordToken" ADD CONSTRAINT "ChangePasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateField" ADD CONSTRAINT "TemplateField_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
