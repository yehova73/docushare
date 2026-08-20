"use client";

import { cancelSubscriptionAction } from "@/actions/account/subscriptions/cancel-subscription";
import { getCurrentSubscriptionAction } from "@/actions/account/subscriptions/get-current-subscription";
import { useRouter } from "next/dist/client/components/navigation";
import Link from "next/link";
import { useState } from "react";
import { UnsubscribeModal } from "./unsubscribe-modal";
import { Button } from "@/components/ui/button";

export const CurrentSubscriptionStatus: React.FC<{
  subscription: Awaited<ReturnType<typeof getCurrentSubscriptionAction>>;
}> = ({ subscription }) => {
  const { states } = subscription;
  const [cancelOpen, setCancelOpen] = useState(false);
  const router = useRouter();
  const isPro = subscription.subscription?.type === "PRO";
  const status = states.isActive
    ? states.isCancellationScheduled
      ? `Cancels  ${subscription.subscription?.currentPeriodEnd ? `on ${new Date(subscription.subscription?.currentPeriodEnd).toLocaleDateString()}` : "at current period end"}`
      : "Active"
    : states.isPaymentDue
      ? "Payment due"
      : states.isPaymentFailed
        ? "Payment failed"
        : states.isInactive
          ? "Inactive"
          : states.isCanceled
            ? "Canceled"
            : "Free plan";

  return (
    <div
      className="mt-6 rounded-xl border p-5 flex flex-wrap items-center gap-4 justify-between"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Current plan
        </div>
        <div className="mt-1 text-lg font-semibold">
          <span className="inline-flex items-center gap-2">
            {isPro ? "Pro Plan" : "Free Tier"}
            {/* {!isPro && (
              <span className="text-muted-foreground font-normal text-sm">
                ({workspaces.length}/
                {subscription?.featureAccess.workspacesLimit ?? 3} Workspaces
                used)
              </span>
            )} */}
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: states.isActive
                  ? "var(--emerald-soft)"
                  : "color-mix(in oklab, var(--amber) 15%, transparent)",
                color: states.isActive ? "var(--emerald)" : "var(--amber)",
              }}
            >
              {status}
            </span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {subscription?.subscription?.type === "PRO" && (
          <button
            onClick={() => setCancelOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium border"
            style={{ borderColor: "var(--color-border)" }}
          >
            Cancel subscription
          </button>
        )}
        <Link
          href={process.env.NEXT_PUBLIC_BILLING_PORTAL_URL!}
          passHref
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            //   onClick={() => setPlan(plan === "free" ? "pro" : "free")}
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: "var(--indigo)" }}
          >
            {!isPro ? "Upgrade to Pro" : "Manage Subscription"}
          </button>
        </Link>
      </div>
      <UnsubscribeModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={async () => {
          const res = await cancelSubscriptionAction();
          if (res) {
            router.refresh();
          }
        }}
      />
    </div>
  );
};
