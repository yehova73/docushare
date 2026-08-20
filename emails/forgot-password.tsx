import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { emailStyles } from "./styles";
import { EmailContainer } from "./email-container";

interface ForgotPasswordEmailProps {
  userName: string;
  resetUrl: string;
}

export default function ForgotPasswordEmail({
  userName = "John",
  resetUrl = "https://resetpass",
}: ForgotPasswordEmailProps) {
  return (
    <EmailContainer
      title="Reset your password"
      preview="Reset your Tabzo password securely."
      reason="You're receiving this because you recently requested a password reset on Tabzo."
      hideUnsubscribe
    >
      <Text>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        We received a request to reset your password. Use the link below to set
        a new password for your Tabzo account.
      </Text>

      <Button href={resetUrl} style={emailStyles.button}>
        Reset Password
      </Button>

      <Text style={emailStyles.text}>
        This link will expire shortly. If you did not request a password reset,
        you can safely ignore this email. If the button doesn’t work, copy and
        paste this link into your browser:
      </Text>

      <Link
        href={resetUrl}
        style={{ ...emailStyles.text, ...emailStyles.link }}
      >
        {resetUrl}
      </Link>

      <Text style={emailStyles.footer}>
        For security, do not share this link with anyone. Tabzo will never ask
        for your password via email.
      </Text>
    </EmailContainer>
  );
}
