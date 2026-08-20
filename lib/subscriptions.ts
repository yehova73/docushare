import { SubscriptionType } from "./generated/prisma/enums";

// Assuming you have an enum like this defined elsewhere:
// enum SubscriptionType { FREE = "FREE", PRO = "PRO" }

export const subscriptionsConfig = [
  {
    name: "Free",
    description: "Basic browser tab management and local workspace saving.",
    monthly: { priceValue: 0, priceId: "" },
    yearly: { priceValue: 0, priceId: "" },
    workspaces: 3, // Replaces totalMonthlyReviews
    linksPerWorkspace: 20, // Replaces locations
    features: [
      {
        title: "Up to 3 workspaces",
        description:
          "Freeze and manage up to 3 distinct browser workflows and environments.",
      },

      {
        title: "Basic session saving",
        description:
          "Instantly capture and close active multi-tab window states to reclaim system RAM.",
      },
      {
        title: "3 days session history",
        description:
          "Keep a rolling history of your saved tab sessions for up to 3 days.",
      },
      {
        title: "Manual capture only",
        description:
          "Manually trigger one-click window suspension for your tab environments.",
      },
      {
        title: "Local backups",
        description:
          "Your session data is stored securely offline on your local machine.",
      },
    ],
    trialAvailable: false, // Note: fixed the spelling from 'trialAvaliable'
    type: SubscriptionType.FREE,
    recommended: false,
  },
  {
    name: "Pro",
    description:
      "Cloud-synced workspaces and advanced focus tools for power users.",
    monthly: { priceValue: 8, priceId: "price_1TxCk5Pbmk7YwP2mHk163bzb" },
    yearly: { priceValue: 80, priceId: "price_yearly_placeholder" }, // Adjust yearly value/ID as needed
    workspaces: -1, // -1 represents Unlimited
    linksPerWorkspace: -1, // -1 represents Unlimited
    features: [
      {
        title: "Unlimited workspaces",
        description:
          "Create as many customized browser environments as you need without restrictions.",
      },

      {
        title: "Workspace Groups & Tags",
        description:
          "Organize and filter your environments with custom tags and grouping.",
      },
      {
        title: "Workspace focus hub",
        description:
          "Access the Index-0 dashboard with a persistent markdown scratchpad and focus micro-tasks checklist.",
      },
      {
        title: "Cloud cross-device sync",
        description:
          "Secure, encrypted syncing of your workspace sessions across all your devices via the SaaS app.",
      },
      {
        title: "90 days session history",
        description:
          "Restore previous window configurations and contexts from the last 90 days.",
      },
      {
        title: "Continuous Window Backups",
        description:
          "Automatically saves your window states in the background so you never lose your progress.",
      },
      {
        title: "Priority support",
        description:
          "Get priority assistance whenever you need help managing your workspaces.",
      },
    ],
    missingFeatures: [],
    trialAvailable: false,
    type: SubscriptionType.PRO,
    recommended: true, // Matches the 'highlight' prop from your React component
  },
];

export const FeatureAccessConfig = {
  [SubscriptionType.FREE]: {
    workspacesLimit: 3,
    workspaceLinksLimit: 20,
    workspaceDashboardPageAccess: false,
    groupsAccess: false,
    autoSnapshotsAccess: false,
    snapshotDaysRetention: 5,
  },
  [SubscriptionType.PRO]: {
    workspacesLimit: null,
    workspaceLinksLimit: null,
    workspaceDashboardPageAccess: true,
    groupsAccess: true,
    autoSnapshotsAccess: true,
    snapshotDaysRetention: 90,
  },
};
