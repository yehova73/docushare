"use server";

import { SubscriptionType } from "@/lib/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { FeatureAccessConfig } from "@/lib/subscriptions";

export const updateSubscriptionAndFeatureAccess = async (params: {
  userId: string;
  subscriptionType: SubscriptionType;
}) => {
  const { subscriptionType, userId } = params;
  // Ensure the user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!userExists) {
    throw new Error("User not found");
  }

  const data =
    FeatureAccessConfig[subscriptionType] ||
    FeatureAccessConfig[SubscriptionType.FREE];
  console.log("new features   for user", userId, data);
  const upserted = await prisma.userFeatureAccess.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: {
      ...data,
    },
  });

  return upserted;
};
