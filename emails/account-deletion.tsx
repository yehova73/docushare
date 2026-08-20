import { Text } from "@react-email/components";
import { EmailContainer } from "./email-container";
import { emailStyles } from "./styles";

interface AccountDeletionEmailProps {
  userName: string;
  deletionDate: string;
}

export default function AccountDeletionEmail({
  userName = "John",
  deletionDate = "July 27, 2026",
}: AccountDeletionEmailProps) {
  return (
    <EmailContainer
      reason="You're receiving this because your Tabzo account was deleted."
      preview="Your Tabzo account has been deleted."
      title="Account deleted"
      hideUnsubscribe
    >
      <Text style={emailStyles.text}>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        Your Tabzo account was deleted on {deletionDate}. All associated cloud
        data has been permanently removed from our systems.
      </Text>

      <div style={deletionSection}>
        <Text style={deletionTitle}>What this includes:</Text>
        <Text style={deletionItem}>
          • Your profile and subscription details
        </Text>
        <Text style={deletionItem}>
          • Cloud-synced workspace configurations and links
        </Text>
        <Text style={deletionItem}>
          • Saved Workspace Dashboards (Markdown pads & Micro-Tasks)
        </Text>
        <Text style={deletionItem}>
          • Auto-snapshot histories and custom workspace tags
        </Text>
      </div>

      <Text style={emailStyles.text}>
        If this was a mistake, you can create a new Tabzo account at any time.
        Note that any local workspace data stored strictly on your browser
        extension will remain on your device until cleared manually.
      </Text>

      <Text style={emailStyles.text}>
        If you didn’t request this deletion or need assistance, reply to this
        email within 30 days.
      </Text>

      <Text style={{ fontSize: "14px", color: "#666", marginTop: "24px" }}>
        — The Tabzo Team
      </Text>
    </EmailContainer>
  );
}

const deletionSection = {
  backgroundColor: "#fef2f2",
  borderRadius: "8px",
  padding: "20px",
};

const deletionTitle = {
  color: "#991b1b",
  fontSize: "16px",
  fontWeight: "600",
  marginTop: 0,
};

const deletionItem = {
  color: "#991b1b",
  fontSize: "14px",
  lineHeight: "20px",
};
