"use server";

import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { stripe } from "./config";
import { handleSubscriptionStatusUpdate } from "./handle-subscription-status-update";
import { getUserFromSession } from "../account";

export const handleStripeSessionAction = async (sessionId: string) => {
  const session = await getStripeSession(sessionId);
  if (session.payment_status !== "paid") {
    console.error("ERROR: Session is not paid yet.");
    return false; // Session is not paid
  }
  // Check if the session is completed
  if (session.status !== "complete") {
    console.error("ERROR:  Session is not complete.");
    return false; // Session is not completed
  }

  //   await sendAdminTelegramMessage(`STRIPE SESSION COMPLETE`);

  const price = session.line_items?.data[0].price;
  const priceId = price?.id;
  if (!priceId) {
    console.error("ERROR: priceId is not complete.");
    return false; // Session is not completed
  }

  const stripeSessionEmail = session.customer_details?.email;
  if (!stripeSessionEmail) {
    console.error("ERROR:  email not found!");
    return false; // Session is not completed
  }
  console.log("email from stripe", stripeSessionEmail);

  console.log("session.metadata", session.metadata);

  const { userId } = parseStripeSessionMetadata(session.metadata);
  console.log("received", userId);
  const user = await getUserFromSession();
  if (!user || !user.id) {
    console.error("User not found");
    return false;
  }

  const subscriptionId = session.subscription?.toString();
  if (!subscriptionId) {
    return false;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const userIdToUpdate = userId || user.id;

  // if (referrerId) {
  //   await grantReferrerCreditBalance(referrerId, user.id);
  // }

  await handleSubscriptionStatusUpdate({
    subscription,
    userId: userIdToUpdate,
  });

  return {
    userId: userIdToUpdate,
    value: price.unit_amount,
  };
};

export async function getStripeSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price"],
    });
    return session;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

const parseStripeSessionMetadata = (
  metadata: Stripe.Metadata | null,
): {
  userId: string;
  referrerId?: string;
} => {
  return {
    userId: (metadata as any).userId || undefined,
    referrerId: (metadata as any).referrerId || undefined,
  };
};

// export const grantReferrerCreditBalance = async (stripeCustomerId: string) => {
//   const customerUser = await prisma.user.findFirst({
//     where: { subscription: { stripeCustomerId } },
//     select: { id: true },
//   });

//   if (!customerUser) return;

//   const referral = await prisma.referral.findFirst({
//     where: {
//       refereeId: customerUser.id,
//       converted: false,
//     },
//     include: {
//       referrer: {
//         include: {
//           user: {
//             select: { subscription: true },
//           },
//         },
//       },
//     },
//   });

//   if (!referral?.referrer?.user?.subscription?.stripeCustomerId) return;

//   await prisma.$transaction(async (tx) => {
//     await stripe.customers.createBalanceTransaction(
//       referral.referrer.user.subscription?.stripeCustomerId!,
//       {
//         amount: -1000, // $10 credit
//         currency: "usd",
//         description: "Referral reward",
//       },
//     );

//     await tx.referral.update({
//       where: {
//         refereeId_referrerId: {
//           refereeId: referral.refereeId,
//           referrerId: referral.referrerId,
//         },
//       },
//       data: {
//         converted: true,
//         convertedAt: new Date(),
//       },
//     });
//   });
// };
