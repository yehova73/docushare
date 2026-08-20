import { Text, Button } from "@react-email/components";
import { emailStyles } from "./styles";
import { EmailContainer } from "./email-container";

interface SubscriptionPastDueEmailProps {
  userName?: string;
  billingPortalUrl: string;
}

export default function SubscriptionPastDueEmail({
  userName,
  billingPortalUrl,
}: SubscriptionPastDueEmailProps) {
  return (
    <EmailContainer
      reason="You're receiving this because there is an issue with your Tabzo subscription payment."
      preview="Update your payment method to keep your Tabzo Pro features active."
      title="Payment Action Required"
      hideUnsubscribe
    >
      <Text style={emailStyles.text}>
        {userName ? `Hi ${userName},` : "Hi,"}
      </Text>

      <Text style={emailStyles.text}>
        We were unable to process your latest payment for Tabzo Pro. Your
        subscription is currently past due.
      </Text>

      <Text style={emailStyles.text}>
        To prevent interruptions to your unlimited workspace vaults, cloud sync,
        workspace groups, and the workspace dashboard, please update your
        payment method.
      </Text>

      <Button href={billingPortalUrl} style={emailStyles.button}>
        Update Payment Details
      </Button>

      <Text style={emailStyles.text}>
        Once updated, your payment will be retried and full access to your Pro
        features will resume automatically.
      </Text>

      <Text style={{ fontSize: "14px", color: "#666", marginTop: "24px" }}>
        — The Tabzo Team
      </Text>
    </EmailContainer>
  );
}
