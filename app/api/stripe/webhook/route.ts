/* eslint-disable @typescript-eslint/no-explicit-any */

import { handleSubscriptionStatusUpdate } from "@/actions/account/subscriptions/handle-subscription-status-update";
import { emailService } from "@/lib/emails/email-service";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import stripe, { Stripe } from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("Stripe Webhook received:", req.method);

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 },
    );
  }
  console.log("received stripe event");
  let event;
  try {
    const rawBody = await req.text(); // Get raw text body

    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      "whsec_0520011d9fdb7782d0a49d546ed47f57f3474d9a71401925d39afac2d9c274dd",
    );

    // await sendAdminTelegramMessage(`Stripe Webhook Event: ${event.type}`);
    // console.log(session);
    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId = invoice.customer;
        if (!customerId) return;
        // await grantReferrerCreditBalance(customerId.toString());
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("handleSubscriptionCanceled", subscription);
        const canceledSub = await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "CANCELLED",
            ...(subscription.canceled_at
              ? {
                  subscriptionCanceledAt: new Date(
                    subscription.canceled_at * 1000,
                  ),
                }
              : {}),
          },
          include: { user: { select: { email: true, name: true } } },
        });

        if (canceledSub.user?.email) {
          await emailService.sendSubscriptionCancelledEmail({
            email: canceledSub.user.email,
            userName: canceledSub.user.name || undefined,
            cancelDate: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )
              : new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
            effectiveNow: true,
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubscriptionId = (invoice as any).subscription as
          | string
          | null;

        if (stripeSubscriptionId) {
          const failedSub = await prisma.subscription.update({
            where: { stripeSubscriptionId: stripeSubscriptionId },
            data: {
              status: "PAYMENT_FAILED",
            },
            include: { user: { select: { email: true, name: true } } },
          });

          if (failedSub.user?.email) {
            await emailService.sendSubscriptionPastDueEmail({
              email: failedSub.user.email,
              userName: failedSub.user.name || undefined,
              billingPortalUrl: `https://billing.stripe.com/p/login/${process.env.NEXT_PUBLIC_STRIPE_PORTAL_ID}?prefilled_email=${failedSub.user.email}`,
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionRecord = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (subscriptionRecord && subscriptionRecord.userId) {
          handleSubscriptionStatusUpdate({
            userId: subscriptionRecord.userId,
            subscription,
          });
        }
        break;
      }

      case "customer.deleted": {
        const stripeCustomerId = event.data.object.id as string;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: stripeCustomerId || "never" },
          data: {
            stripeCustomerId: null,
          },
        });
      }
    }
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
