import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import { emailStyles } from "./styles";
import { EmailContainer } from "./email-container";

export default function MagicLinkSignupEmail({
  magicLink = "https://localhost/ogin",
  userName,
}: {
  magicLink: string;
  userName?: string;
}) {
  return (
    <EmailContainer
      preview="Sign in to Percevo. No password required."
      title="Sign in to your account"
      reason="You're receiving this because you recently requested a magic link on Percevo."
      hideUnsubscribe
    >
      <Text>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        You requested a secure link to sign in to your Percevo account. Click
        the button below to continue:
      </Text>

      <Button href={magicLink} style={emailStyles.button}>
        Sign in to Percevo
      </Button>

      <Text style={emailStyles.text}>
        This link is unique to your account, works once, and expires soon. If
        the button doesn’t work, copy and paste this link into your browser:
      </Text>
      <Link
        href={magicLink}
        style={{ ...emailStyles.text, ...emailStyles.link }}
      >
        {magicLink}
      </Link>
      <Text style={emailStyles.text}>
        If you didn’t request this login, please ignore this email. Your account
        remains safe.
      </Text>
    </EmailContainer>
  );
}
