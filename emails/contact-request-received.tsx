import { Section, Text } from "@react-email/components";
import { EmailContainer } from "./email-container";
import { emailStyles } from "./styles";

export default function ContactRequestAcknowledgmentEmail({
  userRequest = "Test user request",
  userName,
}: {
  userRequest: string;
  userName?: string;
}) {
  return (
    <EmailContainer
      reason="You’re receiving this because you submitted a contact request on Tabzo."
      preview="We’ve received your contact request."
      title="Contact Request Received"
      hideUnsubscribe
    >
      <Text>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        Thank you for reaching out to Tabzo. We’ve received your request and
        will review it shortly.
      </Text>

      <Text style={emailStyles.text}>Here’s a summary of your request:</Text>

      <Section
        style={{
          backgroundColor: "#f3f4f6",
          padding: "12px 16px",
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ ...emailStyles.text, margin: 0 }}>{userRequest}</Text>
      </Section>

      <Text style={emailStyles.text}>
        Our team aims to respond within 24 hours. If your issue is urgent,
        please reply to this email or contact us directly at{" "}
        <a
          href="mailto:support@tabzo.app"
          style={{ color: "#0662adff", textDecoration: "underline" }}
        >
          support@tabzo.app
        </a>
        .
      </Text>
    </EmailContainer>
  );
}
