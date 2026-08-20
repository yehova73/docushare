"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account";
import { stripe } from "./config";
import { getCurrentSubscriptionAction } from "./get-current-subscription";
import { handleSubscriptionStatusUpdate } from "./handle-subscription-status-update";

export const changeSubscriptionAction = async (newPriceId: string) => {
  const user = await getUserFromSession();

  const subscription = await getCurrentSubscriptionAction();
  if (
    !subscription.states.isActive ||
    !subscription.subscription?.stripeSubscriptionId
  ) {
    throw new Error("No active subscription found");
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.subscription.stripeSubscriptionId,
  );

  const updated = await stripe.subscriptions.update(
    subscription.subscription.stripeSubscriptionId,
    {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      trial_end: "now",
      proration_behavior: "create_prorations",
      cancel_at_period_end: false,
    },
  );

  await handleSubscriptionStatusUpdate({
    subscription: updated,
    userId: user.id,
  });

  await prisma.subscription.updateMany({
    where: { userId: user.id },
    data: { stripeCustomerId: updated.customer.toString() },
  });

  return { status: updated.status };
};
