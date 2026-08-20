import { SendVerificationRequestParams } from "next-auth/providers/email";
import MagicLinkEmail from "@/emails/magic-link-email";
import EmailChangeVerificationEmail from "@/emails/email-change-verification";
import AccountDeletionEmail from "@/emails/account-deletion";
import WelcomeEmail from "@/emails/welcome-email";
import ContactRequestEmail from "@/emails/contact-request";
import { sendEmail } from "./send-email";
import ForgotPasswordEmail from "@/emails/forgot-password";
import SupportRequestAcknowledgmentEmail from "@/emails/support-request-received";
import ContactRequestAcknowledgmentEmail from "@/emails/contact-request-received";
import PasswordChangeConfirmationEmail from "@/emails/password-change-confirmation";
import EmailChangeConfirmationEmail from "@/emails/email-change-confirmation";
import SubscriptionChangeEmail from "@/emails/subscription-changed-email";
import { SubscriptionType } from "../generated/prisma/enums";
import SubscriptionCancellationEmail from "@/emails/subscription-cancelled";
import SubscriptionPastDueEmail from "@/emails/subscription-past-due-email";
import SubscriptionStartedEmail from "@/emails/subscription-started";

export const SENDER_DOMAIN = "fluxgate.app";

export const emailService = {
  sendWelcomeEmail: async (params: { email: string; name?: string }) => {
    await sendEmail({
      component: WelcomeEmail,
      receiver: params.email,
      subject: `Welcome to Tabzo`,
      props: {
        userName: params.name,
        email: params.email,
      },
      senderEmail: "mike@tabzo.app",
      senderName: "Mike from Tabzo",
    });
  },
  sendMagicLinkEmail: async (params: SendVerificationRequestParams) => {
    console.log(params.url);
    await sendEmail({
      component: MagicLinkEmail,
      receiver: params.identifier,
      subject: "Your Tabzo magic link",
      props: {
        magicLink: params.url,
      },
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },
  sendSubscriptionStartedEmail: async (params: {
    email: string;
    userName?: string;
    planName: string;
  }) => {
    await sendEmail({
      component: SubscriptionStartedEmail,
      receiver: params.email,
      subject: `Your Tabzo subscription is now active!`,
      props: {
        userName: params.userName,
        planName: params.planName,
      },
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },
  sendChangeEmailRequestEmail: async (params: {
    email: string;
    url: string;
    name: string;
  }) => {
    await sendEmail({
      component: EmailChangeVerificationEmail,
      receiver: params.email,
      subject: "Your Tabzo email change request",
      props: {
        userName: params.name,
        verificationUrl: params.url,
        newEmail: params.email,
      },
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },
  sendEmailChangeConfirmationEmail: async (params: {
    email: string;
    name: string;
  }) => {
    await sendEmail({
      component: EmailChangeConfirmationEmail,
      receiver: params.email,
      subject: "Your Tabzo email has been changed",
      props: {
        userName: params.name,
      },
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },
  sendAccountDeletedEmail: async (params: { email: string; name: string }) => {
    await sendEmail({
      component: AccountDeletionEmail,
      receiver: params.email,
      subject: "Your Tabzo account has been deleted",
      props: {
        userName: params.name,
        deletionDate: new Date().toDateString(),
      },
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },
  sendAdminContactRequestEmail: async (parmas: {
    name: string;
    email: string;
    subject: string;
    message: string;
    type?: "contact" | "support";
  }) => {
    await sendEmail({
      component: ContactRequestEmail,
      receiver: "support@tabzo.app",
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo Contact Form",
      props: parmas,
      subject: `Tabzo - New Contact: ${parmas.subject.substring(0, 100)}`,
    });
    if (parmas.type === "contact") {
      await sendEmail({
        component: SupportRequestAcknowledgmentEmail,
        receiver: parmas.email,
        subject: `We’ve received your support request.`,
        senderEmail: "no-reply@tabzo.app",
        senderName: "Tabzo Support Team",
        props: {
          userRequest: parmas.message,
          userName: parmas.name,
          email: parmas.email,
        },
      });
    } else {
      await sendEmail({
        component: ContactRequestAcknowledgmentEmail,
        receiver: parmas.email,
        subject: `We’ve received your contact request.`,
        senderEmail: "no-reply@tabzo.app",
        senderName: "Tabzo Contact Team",
        props: {
          userRequest: parmas.message,
          userName: parmas.name,
        },
      });
    }
  },
  sendForgotPasswordEmail: async (params: {
    email: string;
    url: string;
    name: string;
  }) => {
    console.log("reset password url", params.url);
    await sendEmail({
      component: ForgotPasswordEmail,
      receiver: params.email,
      subject: "Reset your Tabzo password",
      props: {
        userName: params.name,
        resetUrl: params.url,
        newEmail: params.email,
      },
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },
  sendPasswordChangeConfirmationEmail: async (params: {
    email: string;
    name: string;
  }) => {
    await sendEmail({
      component: PasswordChangeConfirmationEmail,
      receiver: params.email,
      subject: "Your Tabzo password has been reset",
      props: { userName: params.name },
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },

  sendSubscriptionChangedEmail: async (params: {
    email: string;
    userName?: string;
    oldPlan: SubscriptionType;
    newPlan: SubscriptionType;
  }) => {
    await sendEmail({
      component: SubscriptionChangeEmail,
      receiver: params.email,
      subject: `Your Tabzo subscription has been updated.`,
      props: params,
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },

  sendSubscriptionCancelledEmail: async (params: {
    email: string;
    userName?: string;
    cancelDate: string;
    effectiveNow?: boolean;
  }) => {
    await sendEmail({
      component: SubscriptionCancellationEmail,
      receiver: params.email,
      subject: `Your Tabzo subscription has been canceled.`,
      props: params,
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo",
    });
  },

  async sendSubscriptionPastDueEmail(params: {
    email: string;
    userName?: string;
    billingPortalUrl: string;
  }) {
    await sendEmail({
      component: SubscriptionPastDueEmail,
      receiver: params.email,
      subject: `Your Tabzo subscription is past due.`,
      props: params,
      senderEmail: "no-reply@tabzo.app",
      senderName: "Tabzo Billing Team",
    });
  },
};
