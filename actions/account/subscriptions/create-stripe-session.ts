"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account";
import { stripe } from "./config";

export const createStripeSessionAction = async (priceId: string) => {
  const user = await getUserFromSession();

  const userDetails = await prisma.user.findFirst({
    where: { id: user.id },
    select: { id: true, subscription: true },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    ...(userDetails?.subscription?.stripeCustomerId
      ? { customer: userDetails.subscription.stripeCustomerId }
      : user.email
        ? { customer_email: user.email }
        : {}),
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/api/stripe/session-completed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/app?action=session_canceled`,
    metadata: {
      userId: user.id,
    },
  });

  return {
    requireRedirect: true,
    url: session.url,
  };
};
