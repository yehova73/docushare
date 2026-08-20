"use server";

import {
  SubscriptionStatus,
  SubscriptionType,
} from "@/lib/generated/prisma/enums";
import Stripe from "stripe";
import { match } from "ts-pattern";
import { prisma } from "@/lib/prisma";
import { subscriptionsConfig } from "@/lib/subscriptions";
import { emailService } from "@/lib/emails/email-service";
import { updateSubscriptionAndFeatureAccess } from "./update-feature-access";
// import { updateOrganizationSubscriptionAndFeatureAccess } from "../organizations/get-organization-feature-access";

export const handleSubscriptionStatusUpdate = async (params: {
  userId: string;
  subscription: Stripe.Subscription;
}) => {
  const { userId, subscription } = params;

  console.log(
    "Handling subscription status update for user:",
    userId,
    subscription,
  );
  const stripeCustomerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;

  const priceConfig = subscriptionsConfig.find(
    (x) => x.monthly.priceId === priceId || x.yearly.priceId === priceId,
  );

  // Compute subscription period dates
  const subscriptionStartDate = (subscription as any).start_date
    ? new Date((subscription as any).start_date * 1000)
    : null;

  const currentPeriodStart = (subscription as any).items.data?.[0]
    ?.current_period_start
    ? new Date((subscription as any).items.data[0].current_period_start * 1000)
    : null;

  const currentPeriodEnd = (subscription as any).items.data?.[0]
    ?.current_period_end
    ? new Date((subscription as any).items.data[0].current_period_end * 1000)
    : null;

  const cancelAt = subscription.cancel_at
    ? new Date(subscription.cancel_at * 1000)
    : null;

  const canceledAt = subscription.canceled_at
    ? new Date(subscription.canceled_at * 1000)
    : null;

  // Map Stripe status → internal enum
  const status = match(subscription.status)
    .with("trialing", () => SubscriptionStatus.ACTIVE)
    .with("active", () => SubscriptionStatus.ACTIVE)
    .with("past_due", () => SubscriptionStatus.PAST_DUE)
    .with("unpaid", () => SubscriptionStatus.PAYMENT_FAILED)
    .with("canceled", () =>
      cancelAt && cancelAt > new Date()
        ? SubscriptionStatus.ACTIVE
        : SubscriptionStatus.CANCELLED,
    )
    .with("incomplete", () => SubscriptionStatus.INACTIVE)
    .with("incomplete_expired", () => SubscriptionStatus.INACTIVE)
    .with("paused", () => SubscriptionStatus.INACTIVE)
    .otherwise(() => SubscriptionStatus.INACTIVE);

  const prevSettings = await prisma.user.findFirst({
    where: { id: userId },
    include: { subscription: true },
  });

  const prevType = prevSettings?.subscription?.type || SubscriptionType.FREE;

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: stripeCustomerId,
      status: status,
      type: priceConfig?.type || SubscriptionType.FREE,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      subscriptionCanceledAt: cancelAt ?? canceledAt,
      currentPeriodStart: currentPeriodStart,
      currentPeriodEnd: currentPeriodEnd,
      subscriptionStartedAt: subscriptionStartDate,
    },
    update: {
      stripeCustomerId: stripeCustomerId,
      status: status,
      type: priceConfig?.type || SubscriptionType.FREE,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      subscriptionCanceledAt: cancelAt ?? canceledAt,
      subscriptionStartedAt: currentPeriodStart,
      currentPeriodStart: currentPeriodStart,
      currentPeriodEnd: currentPeriodEnd,
    },
  });

  if (prevType !== priceConfig?.type) {
    await updateSubscriptionAndFeatureAccess({
      userId,
      subscriptionType: priceConfig?.type || SubscriptionType.FREE,
    });

    if (prevSettings?.email) {
      if (
        prevSettings?.subscription?.type === SubscriptionType.FREE &&
        priceConfig?.type !== SubscriptionType.FREE
      ) {
        await emailService.sendSubscriptionStartedEmail({
          email: prevSettings?.email,
          userName: prevSettings?.name || "",
          planName: priceConfig?.type || SubscriptionType.FREE,
        });
      } else {
        await emailService.sendSubscriptionChangedEmail({
          email: prevSettings?.email,
          userName: prevSettings?.name || "",
          oldPlan: prevType,
          newPlan: priceConfig?.type || SubscriptionType.FREE,
        });
      }
    }
  } // Admin notifications for key lifecycle changes
  if (subscription.cancel_at_period_end) {
    if (prevSettings?.email) {
      await emailService.sendSubscriptionCancelledEmail({
        email: prevSettings?.email,
        userName: prevSettings?.name || "",
        cancelDate: cancelAt?.toDateString() || new Date().toDateString(),
        effectiveNow: false,
      });
    }
    // await sendAdminTelegramMessage(
    //   `🔔 Subscription will cancel at period end\nCustomer: ${stripeCustomerId}`,
    // );
    // if (user) {
    //   await generateAndSendReengagementCupon(
    //     user,
    //     "SUBSCRIPTION_SET_TO_CANCEL"
    //   );
    // }
  } else if (subscription.status === "trialing") {
    // await sendAdminTelegramMessage(
    //   `🧪 User is in a trial period\nCustomer: ${stripeCustomerId}\nTrial ends: ${trialEnd?.toISOString()}`,
    // );
  } else if (
    subscription.status === "past_due" ||
    subscription.status === "unpaid"
  ) {
    // Past-due email is sent by the invoice.payment_failed webhook event
    // to avoid duplicates (both invoice.payment_failed and subscription.updated fire for this transition).
  } else if (subscription.status === "canceled") {
    // Cancellation email is sent by the customer.subscription.deleted webhook event
    // to avoid duplicates (both subscription.updated and subscription.deleted fire for this transition).
  } else if (subscription.status === "active") {
    // await sendAdminTelegramMessage(
    //   `✅ Subscription active\nCustomer: ${stripeCustomerId}`,
    // );
  }

  console.log(
    `[Stripe] Subscription update handled for ${stripeCustomerId}: ${subscription.status}`,
  );
};
