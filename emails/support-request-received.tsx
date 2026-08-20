import { Text, Section } from "@react-email/components";
import { emailStyles } from "./styles";
import { EmailContainer } from "./email-container";

export default function SupportRequestAcknowledgmentEmail({
  userRequest = "Test user request",
  userName,
  email,
}: {
  userRequest: string;
  userName?: string;
  email?: string;
}) {
  return (
    <EmailContainer
      reason="You’re receiving this because you submitted a support request to Tabzo."
      preview="We’ve received your support request."
      title="Support Request Received"
      unsubscribeUrl={`https://tabzo.app/unsubscribe?type=important&email=${email}`}
    >
      <Text>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        Thank you for reaching out to Tabzo support. We’ve received your request
        and will review it shortly.
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
          style={{ color: "#0662ad", textDecoration: "underline" }}
        >
          support@tabzo.app
        </a>
        .
      </Text>

      <Text style={{ fontSize: "14px", color: "#666", marginTop: "24px" }}>
        Thank you for reaching out. We&apos;ll be in touch shortly.
        <br />— The Tabzo Team
      </Text>
    </EmailContainer>
  );
}
