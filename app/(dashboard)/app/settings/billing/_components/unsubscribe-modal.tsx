import { useState } from "react";
import {
  ConfirmModalHeader,
  ConfirmModalShell,
} from "../../_components/modals";
import { AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all"
          style={{
            width:
              i === step
                ? "calc(100% / " + total + " + 40px)"
                : "calc(100% / " + total + " - 20px)",
            backgroundColor:
              i <= step ? "var(--indigo)" : "var(--color-border)",
          }}
        />
      ))}
    </div>
  );
}

export function UnsubscribeModal({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void | Promise<void>;
}) {
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const [ack, setAck] = useState(false);

  function close() {
    setStep(0);
    setReason("");
    setAck(false);
    onOpenChange(false);
  }

  const reasons = [
    "Too expensive",
    "Not using Pro features",
    "Missing a feature",
    "Switching to another tool",
    "Just taking a break",
    "Other",
  ];

  return (
    <ConfirmModalShell
      open={open}
      onOpenChange={(v) => (v ? onOpenChange(true) : close())}
    >
      <ConfirmModalHeader
        tone="warn"
        icon={<AlertTriangle className="h-4 w-4" />}
        title="Cancel Pro subscription"
        desc="You'll keep Pro access until the end of the current billing period."
      />
      <div className="px-5 pt-4">
        <StepDots step={step} total={3} />
      </div>

      {step === 0 && (
        <div className="p-5 space-y-3 text-sm">
          <div className="font-medium">What&apos;s the main reason?</div>
          <div className="grid grid-cols-1 gap-2">
            {reasons.map((r) => (
              <label
                key={r}
                className="flex items-center gap-2 rounded-md border p-2.5 cursor-pointer"
                style={{
                  borderColor:
                    reason === r ? "var(--indigo)" : "var(--color-border)",
                }}
              >
                <input
                  type="radio"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="p-5 space-y-3 text-sm">
          <div
            className="rounded-lg border p-4"
            style={{
              borderColor: "var(--indigo)",
              backgroundColor:
                "color-mix(in oklab, var(--indigo) 8%, transparent)",
            }}
          >
            <div className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Wait — here&apos;s 50% off for 3
              months
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Stay on Pro at just $4/mo for the next three months. No
              commitment, cancel anytime.
            </p>
            <button
              onClick={() => {
                toast.success(
                  "Discount applied — Pro continues at $4/mo for 3 months",
                );
                close();
              }}
              className="mt-3 px-3 py-2 rounded-md text-sm text-white"
              style={{ backgroundColor: "var(--indigo)" }}
            >
              Apply discount & stay
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            Not interested? Continue to the final step.
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="p-5 space-y-3 text-sm">
          <div
            className="rounded-md border p-3 text-xs space-y-1"
            style={{
              borderColor: "var(--amber)",
              backgroundColor:
                "color-mix(in oklab, var(--amber) 10%, transparent)",
            }}
          >
            <div className="font-medium">
              After cancellation you&apos;ll lose:
            </div>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Unlimited workspaces (cap drops to 3)</li>
              <li>Cloud cross-device sync</li>
              <li>Auto-snapshot timeline</li>
            </ul>
          </div>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              className="mt-1"
            />
            <span>
              I understand my Pro benefits will end at the next billing date.
            </span>
          </label>
        </div>
      )}

      <div
        className="p-4 border-t flex justify-between gap-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Button onClick={close} style={{ borderColor: "var(--color-border)" }}>
          Keep Pro
        </Button>
        <div className="flex gap-2">
          {step > 0 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="default"
              style={{ borderColor: "var(--color-border)" }}
            >
              Back
            </Button>
          )}
          {step < 2 && (
            <Button
              disabled={step === 0 && !reason}
              onClick={() => setStep(step + 1)}
              variant="default"
              style={{ borderColor: "var(--color-border)" }}
            >
              Continue
            </Button>
          )}
          {step === 2 && (
            <Button
              disabled={!ack}
              onClick={async () => {
                await onConfirm();
                toast.success("Subscription cancellation scheduled");
                close();
              }}
              variant="destructive"
            >
              Confirm cancellation
            </Button>
          )}
        </div>
      </div>
    </ConfirmModalShell>
  );
}
