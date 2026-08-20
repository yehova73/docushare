import { Button, Text } from "@react-email/components";
import { EmailContainer } from "./email-container";
import { emailStyles } from "./styles";

interface EmailChangeVerificationProps {
  userName: string;
  newEmail: string;
  verificationUrl: string;
}

export default function EmailChangeVerificationEmail({
  userName = "John",
  newEmail = "newemail@example.com",
  verificationUrl = "",
}: EmailChangeVerificationProps) {
  return (
    <EmailContainer
      title="Verify Your New Email"
      preview="Verify your new email address for Tabzo."
      reason="You're receiving this because you recently requested an email change on Tabzo."
      hideUnsubscribe
    >
      <Text style={emailStyles.text}>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        You recently requested to change your email address for your Tabzo
        account. To complete this change, please verify your new email address.
      </Text>

      <div style={emailStyles.text}>
        <Text style={emailAddress}>{newEmail}</Text>
      </div>

      <Text style={emailStyles.text}>
        Click the button below to verify this email address and complete the
        change:
      </Text>
      <Button style={emailStyles.button} href={verificationUrl}>
        Verify email address
      </Button>

      <Text style={emailStyles.text}>
        If you didn't request this email change, please ignore this email or
        contact our support team if you have concerns about your account
        security.
      </Text>

      <Text style={emailStyles.text}>
        This verification link will expire in 24 hours for security reasons.
      </Text>
    </EmailContainer>
  );
}

const emailAddress = {
  fontSize: "18px",
  fontWeight: "600",
  margin: "0",
};
