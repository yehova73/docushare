"use client";

import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, InfoIcon } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PlanCard({
  name,
  price,
  features,
  highlight,
  active,
  onSelect,
  disabled,
}: {
  name: string;
  price: { priceId: string; monthlyPrice: string };
  features: { title: string; description: string }[];
  highlight?: boolean;
  active?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-card border p-5 relative flex flex-col",
        active && "border-2 border-primary",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{name} Plan</div>
        {active && (
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: "var(--emerald-soft)",
              color: "var(--emerald)",
            }}
          >
            Current
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight">
          {price.monthlyPrice}
        </span>
        {price.monthlyPrice !== "Free" && (
          <span className="text-xs text-muted-foreground">/mo</span>
        )}
      </div>
      <ul className="mt-4 space-y-2 text-sm mb-auto">
        {features.map((f) => (
          <li key={f.title} className="flex items-start gap-2">
            <Check
              className="h-4 w-4 mt-0.5 shrink-0"
              style={{ color: "var(--emerald)" }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5">
                  {f.title}
                  <InfoIcon className="size-3" />
                </span>
              </TooltipTrigger>
              <TooltipContent>{f.description}</TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>
      {onSelect && (
        <Button
          onClick={onSelect}
          disabled={disabled || active}
          className="mt-5 cursor-pointer h-auto w-full py-2"
        >
          {active
            ? "Current plan"
            : name === "Free"
              ? "Switch to Free"
              : "Upgrade to Pro"}
        </Button>
      )}
    </div>
  );
}
