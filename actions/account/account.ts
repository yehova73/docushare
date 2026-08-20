"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { authOptions } from "@/lib/auth";
import { emailService } from "@/lib/emails/email-service";
import { prisma } from "@/lib/prisma";
import { FeatureAccessConfig } from "@/lib/subscriptions";
import bcrypt from "bcryptjs";
import { addDays } from "date-fns";
import { getServerSession } from "next-auth";
import { sendChangeEmailRequest } from "./email-change";
import { SubscriptionType } from "@/lib/generated/prisma/browser";

export const getUserFromSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("No user found!");
  }

  return {
    ...session?.user,
  };
};

export const getPotentialUserFromSession = async () => {
  const session = await getServerSession(authOptions);

  return session?.user;
};

export const updateUserAccountAction = async (data: {
  newName: string;
  newEmail: string;
}): Promise<
  ServerActionResponse<{
    updateName?: string;
    hasSendEmailChangeRequest?: boolean;
  }>
> => {
  const user = await getUserFromSession();
  const existingUser = await prisma.user.findUnique({
    where: { id: user!.id },
  });

  let hasSendEmailChangeRequest = false;
  if (data.newEmail !== existingUser!.email) {
    await sendChangeEmailRequest(data.newEmail);
    hasSendEmailChangeRequest = true;
  }

  const res = await prisma.user.update({
    where: { id: existingUser!.id },
    data: {
      name: data.newName,
    },
  });

  return {
    status: "ok",
    requireRefresh: false,
    message: {
      title: "Account Updated",
      description: hasSendEmailChangeRequest
        ? "A confirmation email has been sent to your new email address."
        : "Your account has been updated successfully.",
    },
    data: {
      updateName: res.name || undefined,
      hasSendEmailChangeRequest,
    },
  };
};

export async function createUserAction(data: {
  name: string;
  email: string;
  password: string;
}) {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: "Email already registered." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  if (!user) {
    return {
      success: false,
      error: "Failed to create account! Please try again.",
    };
  }

  await handleNewUserFields(user.id);

  if (user.email) {
    await emailService.sendWelcomeEmail({
      email: user.email,
      name: user.name || "",
    });
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
    },
  };
}

export const handleNewUserFields = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      trialEndsAt: addDays(new Date(), 14),
      subscription: {
        create: {
          currentPeriodStart: new Date(),
          status: "ACTIVE",
          type: "FREE",
          subscriptionStartedAt: new Date(),
        },
      },
      userSetupChecklist: {},
      featureAccess: {
        create: {
          ...FeatureAccessConfig[SubscriptionType.FREE],
        },
      },
    },
  });
};
