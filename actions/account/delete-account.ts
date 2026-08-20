"use server";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "./account";
import { ServerActionResponse } from "@/hooks/use-server-action";
import { emailService } from "@/lib/emails/email-service";

export const deleteAccountAction = async (feedback?: string) => {
  const user = await getUserFromSession();

  const userDetails = await prisma.user.findFirst({
    where: { id: user.id },
  });

  // if (userDetails?.subscription?.stripeCustomerId) {
  //   await cancelAllStripeSubscriptions(
  //     userDetails.subscription.stripeCustomerId,
  //   );
  // }

  const deleteResult = await prisma.$transaction(async (tx) => {
    await tx.user.delete({
      where: { id: user!.id },
    });

    await tx.subscription.updateMany({
      where: { userId: user!.id },
      data: {
        status: "CANCELLED",
        subscriptionCanceledAt: new Date(),
        cancellationReason: feedback || "Account Deleted",
        cancelationFeedback: feedback,
      },
    });
    return true;
  });
  // const deleteResult = await prisma.user.update({
  //   where: { id: user!.id },
  //   data: {
  //     deletedAt: new Date(),
  //   },
  // });

  if (!deleteResult) {
    throw new Error("Unexpected error occured! Please try again later");
  }

  if (user?.email) {
    await emailService.sendAccountDeletedEmail({
      email: user.email,
      name: user.name || "",
    });
  }
  return true;
};

// async function cancelAllStripeSubscriptions(stripeCustomerId: string) {
//   const subscriptions = await stripe.subscriptions.list({
//     customer: stripeCustomerId,
//     status: "all",
//     limit: 100,
//   });

//   for (const subscription of subscriptions.data) {
//     if (subscription.status !== "canceled") {
//       await stripe.subscriptions.cancel(subscription.id);
//     }
//   }
// }

export const deleteAllUserDataAction = async (): Promise<
  ServerActionResponse<null>
> => {
  const user = await getUserFromSession();

  return {
    status: "ok",
    requireRefresh: true,
    message: {
      title: "All Data Deleted",
      description: "All your data has been deleted successfully.",
    },
  };
};
