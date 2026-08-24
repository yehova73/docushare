/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { htmlToText } from "html-to-text";
import { render } from "@react-email/render";
import * as React from "react";
import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: "798e82001@smtp-brevo.com", // generated ethereal user
//     pass: "64fFdWCzwm03Zn7c", // generated ethereal password
//   },
// });
type EmailOptionsType<T> = {
  component: React.FC<T>;
  props: T;
  subject: string;
  receiver: string;
  sendAt?: number;
  senderEmail?: string;
  senderName?: string;
  unsubscribeUrl?: string;
};

export const sendEmail = async <T>(props: EmailOptionsType<T>) => {
  // if (process.env.NODE_ENV !== "production") return;
  const emailHtml = await render(
    React.createElement(props.component as any, props.props as any),
  );

  const emailText = htmlToText(emailHtml, {
    wordwrap: 130,
    // Options to make tables and buttons readable
    selectors: [
      { selector: "a", options: { hideLinkHrefIfSameAsText: false } },
      { selector: "img", format: "skip" },
      { selector: "table", format: "block" },
      { selector: "button", format: "block" },
    ],
    // Preserve line breaks for paragraphs and headings
    preserveNewlines: true,
  });
  console.log(`SENDING EMAIL`, props.subject);

  const res = await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email: props.receiver }],
    sender: {
      name: props.senderName || "Tabzo",
      email:
        props.senderEmail ||
        process.env.BREVO_SENDER_EMAIL ||
        "no-reply@tabzo.app",
    },
    subject: props.subject,
    textContent: emailText,
    htmlContent: emailHtml,
  });

  return res;
};
