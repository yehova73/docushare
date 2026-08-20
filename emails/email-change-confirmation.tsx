import { Button, Hr, Text } from "@react-email/components";
import { EmailContainer } from "./email-container";
import { emailStyles } from "./styles";

export default function EmailChangeConfirmationEmail({
  userName = "John",
}: {
  userName?: string;
}) {
  return (
    <EmailContainer
      reason="You're receiving this because the email for your Tabzo account was recently updated."
      preview="Your Tabzo email has been updated."
      title="Email Updated"
      hideUnsubscribe
    >
      <Text style={emailStyles.text}>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        This is a confirmation that your Tabzo account email has been changed to
        this address.
      </Text>

      <Text style={emailStyles.text}>
        If you requested this change, no further action is needed.
      </Text>

      <Text style={emailStyles.text}>
        If you did <strong>not</strong> request this change, please contact our
        support team immediately.
      </Text>

      <Button href="mailto:support@tabzo.app" style={emailStyles.button}>
        Contact Support
      </Button>

      <Hr style={emailStyles.hr} />

      <Text style={emailStyles.footer}>
        For security, do not share your password or account details. Tabzo will
        never ask for your credentials via email.
      </Text>

      <Text style={emailStyles.footer}>
        Support email:{" "}
        <a
          href="mailto:support@tabzo.app"
          style={{ color: "#0662adff", textDecoration: "underline" }}
        >
          support@tabzo.app
        </a>
      </Text>
    </EmailContainer>
  );
}
