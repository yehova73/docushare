"use client";

import { subscriptionsConfig } from "@/lib/subscriptions";
import { useState } from "react";
import { PlanCard } from "./plan-card";
import { UnsubscribeModal } from "./unsubscribe-modal";
import { getCurrentSubscriptionAction } from "@/actions/account/subscriptions/get-current-subscription";
import { createStripeSessionAction } from "@/actions/account/subscriptions/create-stripe-session";
import { changeSubscriptionAction } from "@/actions/account/subscriptions/update-subscription";
import { cancelSubscriptionAction } from "@/actions/account/subscriptions/cancel-subscription";
import { useRouter } from "next/dist/client/components/navigation";

export function PricingCards({
  subscription,
}: {
  subscription: Awaited<ReturnType<typeof getCurrentSubscriptionAction>>;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isPro = subscription.subscription?.type === "PRO";

  async function selectPlan(plan: (typeof subscriptionsConfig)[number]) {
    if (plan.type === "FREE") {
      setCancelOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      if (isPro) {
        await changeSubscriptionAction(plan.monthly.priceId);
        return;
      }

      const result = await createStripeSessionAction(plan.monthly.priceId);
      if (result.url) {
        window.location.assign(result.url);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptionsConfig.map((sub) => (
          <PlanCard
            key={sub.name}
            name={sub.name}
            price={{
              priceId: sub.monthly.priceId,
              monthlyPrice: sub.monthly.priceValue
                ? `$${sub.monthly.priceValue}`
                : "Free",
            }}
            features={sub.features}
            active={subscription?.subscription?.type === sub.type}
            onSelect={() => selectPlan(sub)}
            disabled={isLoading}
          />
        ))}
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
}
