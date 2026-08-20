import { Text, Section } from "@react-email/components";
import { emailStyles } from "./styles";
import { EmailContainer } from "./email-container";
import { SubscriptionType } from "@/lib/generated/prisma/enums";
import { capitalize } from "@/lib/utils";

interface SubscriptionChangeEmailProps {
  oldPlan: SubscriptionType;
  newPlan: SubscriptionType;
  userName?: string;
  email?: string;
}

const PLAN_FEATURES: Record<SubscriptionType, string[]> = {
  [SubscriptionType.FREE]: [
    "Up to 3 workspaces",
    "3 days rolling session history",
    "Manual window capture",
    "Offline local storage",
  ],

  [SubscriptionType.PRO]: [
    "Unlimited workspaces & links",
    "Workspace Dashboard (Markdown + Micro-Tasks)",
    "Custom workspace groups & tags",
    "Cloud cross-device sync",
    "90 days session history",
    "Continuous window backups",
    "Priority support",
  ],
};

export default function SubscriptionChangeEmail({
  oldPlan,
  newPlan,
  userName,
  email,
}: SubscriptionChangeEmailProps) {
  const isUpgrade =
    oldPlan === SubscriptionType.FREE && newPlan === SubscriptionType.PRO;

  return (
    <EmailContainer
      reason="You're receiving this email because your subscription was updated."
      preview={`Your Tabzo plan is now ${capitalize(newPlan?.toLowerCase() || "Free")}.`}
      title={isUpgrade ? "Welcome to Tabzo Pro" : "Subscription updated"}
      unsubscribeUrl={`https://yourdomain.com/unsubscribe?type=important&email=${email}`}
    >
      <Text style={emailStyles.text}>
        {userName ? `Hi ${userName},` : "Hi,"}
      </Text>

      <Text style={emailStyles.text}>
        Your Tabzo subscription has been updated from{" "}
        <strong>{capitalize(oldPlan?.toLowerCase() || "Free")}</strong> to{" "}
        <strong>{capitalize(newPlan?.toLowerCase() || "Free")}</strong>. The
        changes are already active.
      </Text>

      <Section
        style={{
          backgroundColor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 8,
          padding: "18px 20px",
          margin: "24px 0",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginTop: 0,
            marginBottom: 12,
          }}
        >
          Your {capitalize(newPlan?.toLowerCase() || "Free")} plan includes
        </Text>

        {PLAN_FEATURES[newPlan || SubscriptionType.FREE].map((feature) => (
          <Text
            key={feature}
            style={{
              margin: "6px 0",
              fontSize: 14,
            }}
          >
            • {feature}
          </Text>
        ))}
      </Section>

      {isUpgrade && (
        <Text style={emailStyles.text}>
          Your browser extension will automatically unlock your new Pro features
          the next time it syncs. If it doesn't update immediately, simply
          reopen the extension.
        </Text>
      )}

      <Text style={emailStyles.text}>
        If you didn't make this change, reply to this email and we'll help
        secure your account.
      </Text>

      <Text style={{ color: "#666", fontSize: 14, marginTop: 24 }}>
        — The Tabzo Team
      </Text>
    </EmailContainer>
  );
}
