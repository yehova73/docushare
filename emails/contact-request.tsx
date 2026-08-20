// ContactRequestEmail.tsx

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface ContactRequestEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactRequestEmail({
  name,
  email,
  subject,
  message,
}: ContactRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Percevo - New contact request</Preview>
      <Body
        style={{
          fontFamily: "Helvetica, Arial, sans-serif",
          backgroundColor: "#f9f9f9",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            New Percevo Contact Request
          </Text>
          <Hr style={{ margin: "16px 0" }} />

          <Section>
            <Text>
              <strong>Name:</strong> {name}
            </Text>
            <Text>
              <strong>Email:</strong> {email}
            </Text>
            <Text>
              <strong>Subject:</strong> {subject}
            </Text>
            <Text>
              <strong>Message:</strong>
            </Text>
            <Text style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
              {message}
            </Text>
          </Section>

          <Hr style={{ margin: "24px 0" }} />
          <Text style={{ fontSize: "12px", color: "#999" }}>
            You are receiving this email because someone submitted a contact
            form on your website.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
