"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown } from "lucide-react";
import Link from "next/link";

export const TrialBox: React.FC<{ trialExpirationDate: Date }> = ({
  trialExpirationDate,
}) => {
  return (
    <Card className="flex flex-row items-center bg-gradient-to-r from-primary/10 to-secondary/10 border border-border p-4">
      <div className="bg-gradient-to-r rounded-xl from-primary to-blue-500 w-12 h-12 flex items-center justify-center">
        <Crown className="text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">Trial Period</h3>
        <p className="text-xs text-muted-foreground">
          Your trial period will expire on{" "}
          {trialExpirationDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          . After this date, you will need to upgrade to a paid plan to continue
          using the service.
        </p>
      </div>
      <Link href="/app/billing" className="ml-auto" passHref>
        <Button>Subscribe Now</Button>
      </Link>
    </Card>
  );
};
