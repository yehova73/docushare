import { Button, Hr, Section, Text } from "@react-email/components";
import { emailStyles } from "./styles";
import { EmailContainer } from "./email-container";

interface WelcomeEmailProps {
  userName?: string;
  email?: string;
}

export default function WelcomeEmail({ userName, email }: WelcomeEmailProps) {
  return (
    <EmailContainer
      preview="Freeze your browser tabs, eliminate tab clutter, and organize your work."
      title="Welcome to Tabzo"
      reason="You're receiving this because you created a Tabzo account."
      unsubscribeUrl={`https://tabzo.app/unsubscribe?type=important&email=${email}`}
    >
      <Text>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        Say goodbye to browser anxiety and 40+ open tabs scattered across
        windows. Tabzo helps you instantly freeze messy browser sessions into
        clean, organized workspaces so you never lose your place.
      </Text>

      <Section>
        <Text style={emailStyles.subtitle}>3 Quick Steps to Get Started</Text>

        <Section style={emailStyles.listItem}>
          <Text style={emailStyles.listItemTitle}>
            1. Freeze your active window
          </Text>
          <Text style={emailStyles.listItemDescription}>
            Click the Tabzo extension icon to capture and save your current
            multi-tab session instantly into a local workspace.
          </Text>
        </Section>

        <Section style={emailStyles.listItem}>
          <Text style={emailStyles.listItemTitle}>2. Name your workspace</Text>
          <Text style={emailStyles.listItemDescription}>
            Assign a project name (e.g., &quot;Project Delta&quot;). Tabzo
            prefaces your OS taskbar title so you can Alt-Tab straight back to
            your targeted workflow.
          </Text>
        </Section>

        <Section style={emailStyles.listItem}>
          <Text style={emailStyles.listItemTitle}>
            3. Restore and swap effortlessly
          </Text>
          <Text style={emailStyles.listItemDescription}>
            Reopen your saved link lists into clean, native Chrome windows
            whenever you&apos;re ready to jump back into a project.
          </Text>
        </Section>
      </Section>

      <Hr style={emailStyles.hr} />

      <Text style={emailStyles.text}>
        Ready to clear the clutter and streamline your tabs? Launch your
        workspace manager now.
      </Text>

      <Button href="https://tabzo.app/dashboard" style={emailStyles.button}>
        Open Tabzo Dashboard
      </Button>

      <Text style={{ fontSize: "14px", color: "#666", marginTop: "24px" }}>
        — The Tabzo Team
      </Text>
    </EmailContainer>
  );
}
