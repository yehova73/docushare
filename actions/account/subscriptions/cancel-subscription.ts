"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account";
import { stripe } from "./config";

export const cancelSubscriptionAction = async () => {
  const user = await getUserFromSession();
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new Error("No Stripe subscription found");
  }

  const canceledSubscription = await stripe.subscriptions.update(
    subscription.stripeSubscriptionId,
    { cancel_at_period_end: true },
  );

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      subscriptionCanceledAt: canceledSubscription.cancel_at
        ? new Date(canceledSubscription.cancel_at * 1000)
        : null,
    },
  });

  return { status: canceledSubscription.status };
};
