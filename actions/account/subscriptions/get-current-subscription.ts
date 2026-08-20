"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account";
import { SubscriptionType } from "@/lib/generated/prisma/enums";
import { FeatureAccessConfig } from "@/lib/subscriptions";

export const getCurrentSubscriptionAction = async () => {
  const user = await getUserFromSession();
  const userDetails = await prisma.user.findFirst({
    where: { id: user.id },
    select: {
      trialEndsAt: true,
      trialStartedAt: true,
      subscription: true,
      featureAccess: true,
      hasCompletedOnboardingAt: true,
    },
  });

  if (!userDetails) {
    throw new Error("User not found");
  }
  if (!userDetails?.featureAccess) {
    const newFeatureAccess = await prisma.userFeatureAccess.create({
      data: {
        userId: user.id,
        ...FeatureAccessConfig[SubscriptionType.FREE],
      },
    });

    userDetails.featureAccess = newFeatureAccess;
  }

  const isActive =
    !!userDetails.subscription &&
    userDetails.subscription.status === "ACTIVE" &&
    (!userDetails.subscription.currentPeriodEnd ||
      userDetails.subscription.currentPeriodEnd >= new Date());

  const subscriptionStatus = userDetails.subscription?.status ?? null;
  const cancellationDate = userDetails.subscription?.subscriptionCanceledAt;
  const isCancellationScheduled =
    isActive && !!cancellationDate && cancellationDate > new Date();

  return {
    userId: user.id,
    subscription: userDetails.subscription || undefined,
    states: {
      isActive,
      isTrialActive:
        isActive &&
        !!userDetails.trialEndsAt &&
        userDetails.trialEndsAt >= new Date(),
      isSubscriptionActive: isActive,
      isInactive: subscriptionStatus === "INACTIVE",
      isPaymentDue: subscriptionStatus === "PAST_DUE",
      isPaymentFailed: subscriptionStatus === "PAYMENT_FAILED",
      isCanceled: subscriptionStatus === "CANCELLED",
      isCancellationScheduled,
      trialEndsAt: userDetails.trialEndsAt,
      onboardingCompletedAt: userDetails.hasCompletedOnboardingAt,
    },
    featureAccess: userDetails.featureAccess,
  };
};
