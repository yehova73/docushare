"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";
import { emailService } from "@/lib/emails/email-service";

export const sendContactMessageAction = async (props: {
  firstName: string;
  subject: string;
  email: string;
  message: string;
}) => {
  await emailService.sendAdminContactRequestEmail({
    email: props.email,
    message: props.message,
    name: props.firstName,
    subject: props.subject,
    type: "contact",
  });
  await prisma.contactRequest.create({
    data: {
      email: props.email,
      firstName: props.firstName,
      lastName: "",
      message: props.message,
      subject: props.subject,
    },
  });
};

export const createFeedbackAction = async (data: {
  rank: string;
  category: string;
  feedback: string;
}) => {
  console.log("Received feedback data:", data);
  const user = await getUserFromSession();

  const res = await prisma.feedback.create({
    data: {
      userId: user!.id,
      category: data.category,
      feedback: data.feedback,
      rating: data.rank,
    },
  });

  console.log("Feedback created:", res);
  if (user.email) {
    await emailService.sendAdminContactRequestEmail({
      email: user.email,
      name: user.name || "",
      message: data.feedback,
      subject: data.category,
      type: "support",
    });
  }

  return {
    data: null,
  };
};

export async function deleteContactRequest(
  id: string,
  type: "contact" | "feedback" = "contact",
) {
  if (type === "contact") {
    await prisma.contactRequest.delete({
      where: { id },
    });
  } else if (type === "feedback") {
    await prisma.feedback.delete({
      where: { id },
    });
  }
}
