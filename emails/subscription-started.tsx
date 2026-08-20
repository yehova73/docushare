import { Button, Text, Section } from "@react-email/components";
import { emailStyles } from "./styles";
import { EmailContainer } from "./email-container";

interface SubscriptionStartedEmailProps {
  planName?: string;
  userName?: string;
  email?: string;
}

export default function SubscriptionStartedEmail({
  planName = "Pro",
  userName,
  email,
}: SubscriptionStartedEmailProps) {
  return (
    <EmailContainer
      reason={`You're receiving this because you upgraded your Tabzo account to ${planName}.`}
      preview={`Your Tabzo ${planName} subscription is now active!`}
      title="Subscription Activated"
      unsubscribeUrl={`https://tabzo.app/unsubscribe?type=important&email=${email}`}
    >
      <Text style={emailStyles.text}>
        {userName ? `Hi ${userName},` : "Hi,"}
      </Text>
      <Text style={emailStyles.text}>
        Thank you for subscribing to our <strong>{planName} tier</strong>.
        You&apos;ve unlocked unlimited workspaces, custom groups and tags, cloud
        cross-device sync, and access to your dedicated workspace focus hub.
      </Text>

      <Text style={emailStyles.text}>
        Here are the key Pro features now unlocked for you:
      </Text>

      {/* Pro Features Breakdown */}
      <Section style={emailStyles.listItem}>
        <Text style={emailStyles.listItemTitle}>
          1. Unlimited Workspaces & Links
        </Text>
        <Text style={emailStyles.listItemDescription}>
          Move past the 3-workspace free limit. Freeze and store as many
          multi-tab environments as you need, with no cap on saved links per
          project.
        </Text>
      </Section>

      <Section style={emailStyles.listItem}>
        <Text style={emailStyles.listItemTitle}>
          2. Workspace Groups & Tags
        </Text>
        <Text style={emailStyles.listItemDescription}>
          Organize, filter, and tag your growing library of browser environments
          to keep client work, dev projects, and research separated.
        </Text>
      </Section>

      <Section style={emailStyles.listItem}>
        <Text style={emailStyles.listItemTitle}>3. Workspace Dashboard</Text>
        <Text style={emailStyles.listItemDescription}>
          Restored windows now automatically launch with your workspace
          dashboard pinned as first tab, complete with a persistent notes and
          focus micro-tasks.
        </Text>
      </Section>

      <Section style={emailStyles.listItem}>
        <Text style={emailStyles.listItemTitle}>
          4. Cloud Cross-Device Sync & Auto-Snapshots
        </Text>
        <Text style={emailStyles.listItemDescription}>
          Your saved environments sync securely across all your machines, backed
          up automatically with a 90-day history timeline.
        </Text>
      </Section>

      <Text style={emailStyles.text}>
        Ready to structure your tabs and streamline your daily context
        switching?
      </Text>

      <Button href="https://tabzo.app/dashboard" style={emailStyles.button}>
        Launch your Dashboard
      </Button>

      <Text style={{ fontSize: "14px", color: "#666", marginTop: "24px" }}>
        Thank you for supporting Tabzo. <br />— The Tabzo Team
      </Text>
    </EmailContainer>
  );
}
