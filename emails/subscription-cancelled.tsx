import { Text } from "@react-email/components";
import { emailStyles } from "./styles";
import { EmailContainer } from "./email-container";

interface SubscriptionCancellationEmailProps {
  cancelDate: string;
  userName?: string;
  effectiveNow?: boolean;
}

export default function SubscriptionCancellationEmail({
  cancelDate = "January 12, 2026",
  userName,
  effectiveNow = true,
}: SubscriptionCancellationEmailProps) {
  return (
    <EmailContainer
      reason="You're receiving this because your Tabzo Pro subscription was canceled."
      preview={
        effectiveNow
          ? "Your Tabzo Pro subscription has been canceled."
          : `Your Tabzo Pro subscription will be canceled on ${cancelDate}.`
      }
      title={effectiveNow ? "Subscription canceled" : "Cancellation scheduled"}
      hideUnsubscribe
    >
      <Text style={emailStyles.text}>Hi{userName ? ` ${userName}` : ""},</Text>

      <Text style={emailStyles.text}>
        {effectiveNow ? (
          <>Your Tabzo Pro subscription was canceled on {cancelDate}.</>
        ) : (
          <>
            Your Tabzo Pro subscription is scheduled to be canceled on{" "}
            {cancelDate}.
          </>
        )}
      </Text>

      <div style={deletionSection}>
        <Text style={deletionTitle}>What this means:</Text>

        <Text style={deletionItem}>
          • You will lose access to the Workspace Dashboard (Markdown Pad &
          Focus Micro-Tasks)
        </Text>

        <Text style={deletionItem}>
          • Workspaces will be capped at 3 active workspaces
        </Text>

        <Text style={deletionItem}>
          • Cloud cross-device sync, custom groups/tags, and background backups
          will be disabled
        </Text>

        <Text style={{ ...deletionItem, marginBottom: 0 }}>
          • Your local workspace data will remain safe on your current machine
        </Text>
      </div>

      <Text style={emailStyles.text}>
        {effectiveNow ? (
          <>
            If this was a mistake, you can reactivate your subscription anytime
            from your dashboard.
          </>
        ) : (
          <>
            If you change your mind, you can cancel or modify this action before{" "}
            {cancelDate}.
          </>
        )}
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
  padding: "16px 20px",
  marginTop: "16px",
  marginBottom: "16px",
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
  marginBottom: "4px",
};
