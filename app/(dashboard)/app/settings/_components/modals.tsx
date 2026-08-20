"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, type ChangeEvent, type ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  KeyRound,
  Mail,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { sendChangeEmailRequest } from "@/actions/account/email-change";
import { updatePasswordAction } from "@/actions/account/password";
import { cn } from "@/lib/utils";

export function ConfirmModalShell({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-lg gap-0  w-full border border-border bg-card p-0 shadow-sm">
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmModalHeader({
  icon,
  title,
  desc,
  tone = "default",
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  tone?: "default" | "warn" | "danger";
}) {
  const toneClasses =
    tone === "warn"
      ? "border-amber/50 bg-amber/10 text-amber-foreground"
      : tone === "danger"
        ? "border-rose/50 bg-rose/10 text-rose-foreground"
        : "border-border bg-muted/70 text-foreground";

  return (
    <DialogHeader
      className={cn(
        "flex flex-row items-center gap-2 border-b px-6 py-5",
        toneClasses,
      )}
    >
      <div className="">
        <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {desc}
        </DialogDescription>
      </div>
    </DialogHeader>
  );
}

type TextFieldProps = Omit<React.ComponentProps<"input">, "onChange"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function TextField({
  label,
  value,
  onChange,
  className,
  ...props
}: TextFieldProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-sm font-medium text-foreground/90">{label}</span>
      <Input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        className={className}
        {...props}
      />
    </label>
  );
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  hasPassword,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  hasPassword: boolean;
}) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  function reset() {
    setCur("");
    setNext("");
    setConfirm("");
  }

  async function submit() {
    if (hasPassword && !cur) return toast.error("Fill in all fields");
    if (!next) return toast.error("Fill in all fields");
    if (next.length < 8)
      return toast.error("Password must be at least 8 characters");
    if (next !== confirm) return toast.error("Passwords don't match");

    setIsUpdating(true);
    try {
      const res = await updatePasswordAction({
        oldPassword: cur,
        newPassword: next,
      });

      if (res?.status !== "ok") {
        toast.error(res?.message?.title || "Failed to update password", {
          description: res?.message?.description,
        });
        return;
      }

      toast.success(res.message?.title || "Password updated", {
        description: res.message?.description,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update password",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <ConfirmModalShell open={open} onOpenChange={onOpenChange}>
      <ConfirmModalHeader
        icon={<KeyRound className="h-4 w-4" />}
        title={hasPassword ? "Change password" : "Set password"}
        desc={
          hasPassword
            ? "Enter your current password, then choose a new one."
            : "Create a password so you can sign in with email and password."
        }
      />
      <div className="p-5 space-y-3">
        {hasPassword && (
          <TextField
            label="Current password"
            type="password"
            value={cur}
            onChange={setCur}
            placeholder="••••••••"
          />
        )}
        <TextField
          label={hasPassword ? "New password" : "Password"}
          type="password"
          value={next}
          onChange={setNext}
          placeholder="At least 8 characters"
        />
        <TextField
          label={hasPassword ? "Confirm new password" : "Confirm password"}
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repeat password"
        />
      </div>
      <div
        className="p-4 border-t flex justify-end gap-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            reset();
            onOpenChange(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="default" size="sm" onClick={submit}>
          Update password
        </Button>
      </div>
    </ConfirmModalShell>
  );
}

export function ChangeEmailModal({
  open,
  onOpenChange,
  hasPassword,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  hasPassword: boolean;
}) {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function submit() {
    if (!email || !confirmEmail) return toast.error("Fill in all fields");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Enter a valid email");
    if (email !== confirmEmail)
      return toast.error("Email addresses do not match");
    if (hasPassword && !pw) return toast.error("Confirm your password");

    setIsSending(true);
    try {
      await sendChangeEmailRequest(email, pw);
      toast.success(`Verification link sent to ${email}`);
      setEmail("");
      setConfirmEmail("");
      setPw("");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send verification link",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <ConfirmModalShell open={open} onOpenChange={onOpenChange}>
      <ConfirmModalHeader
        icon={<Mail className="h-4 w-4" />}
        title="Change email address"
        desc="We'll send a confirmation link to the new address."
      />
      <div className="p-5 space-y-3">
        <TextField
          label="New email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
        />
        <TextField
          label="Confirm new email"
          type="email"
          value={confirmEmail}
          onChange={setConfirmEmail}
          placeholder="you@company.com"
        />
        {hasPassword && (
          <TextField
            label="Confirm password"
            type="password"
            value={pw}
            onChange={setPw}
            placeholder="Your current password"
          />
        )}
      </div>
      <div
        className="p-4 border-t flex justify-end gap-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={submit}
          disabled={isSending}
        >
          {isSending ? "Sending…" : "Send verification"}
        </Button>
      </div>
    </ConfirmModalShell>
  );
}

export function ResetDataModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [ack, setAck] = useState(false);
  function submit() {
    if (!ack) return toast.error("Please acknowledge the warning");
    toast.success("All workspace data has been reset");
    setAck(false);
    onOpenChange(false);
  }
  return (
    <ConfirmModalShell open={open} onOpenChange={onOpenChange}>
      <ConfirmModalHeader
        tone="warn"
        icon={<RotateCcw className="h-4 w-4" />}
        title="Reset all workspace data"
        desc="This will delete all workspaces, snapshots, and notes."
      />
      <div className="p-5 space-y-3 text-sm">
        <div
          className="rounded-md border p-3 text-xs"
          style={{
            borderColor: "var(--amber)",
            backgroundColor:
              "color-mix(in oklab, var(--amber) 10%, transparent)",
          }}
        >
          Your account will stay active. Billing, email, and password are
          unaffected.
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={ack}
            onChange={(e) => setAck(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border border-border text-foreground"
          />
          <span>
            I understand this permanently deletes my workspace data and cannot
            be undone.
          </span>
        </label>
      </div>
      <div
        className="p-4 border-t flex justify-end gap-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="secondary" size="sm" onClick={submit}>
          Reset data
        </Button>
      </div>
    </ConfirmModalShell>
  );
}

// ---- Multi-step confirmations ----

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all"
          style={{
            width: i === step ? 20 : 8,
            backgroundColor:
              i <= step ? "var(--indigo)" : "var(--color-border)",
          }}
        />
      ))}
    </div>
  );
}

export function DeleteAccountModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [reason, setReason] = useState("");
  const [ack, setAck] = useState(false);
  const [typed, setTyped] = useState("");
  const CONFIRM = "DELETE";

  function close() {
    setStep(0);
    setReason("");
    setAck(false);
    setTyped("");
    onOpenChange(false);
  }

  const reasons = [
    "Too expensive",
    "Not using it enough",
    "Missing a feature I need",
    "Found an alternative",
    "Privacy concerns",
    "Other",
  ];

  return (
    <ConfirmModalShell
      open={open}
      onOpenChange={(v) => (v ? onOpenChange(true) : close())}
    >
      <ConfirmModalHeader
        tone="danger"
        icon={<ShieldAlert className="h-4 w-4" />}
        title="Delete account"
        desc="This action is permanent and cannot be undone."
      />
      <div className="px-5 pt-4">
        <StepDots step={step} total={3} />
      </div>

      {step === 0 && (
        <div className="p-5 space-y-3 text-sm">
          <div className="font-medium">Why are you leaving?</div>
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
            className="rounded-md border p-3 text-xs space-y-1"
            style={{
              borderColor: "var(--rose, #f43f5e)",
              backgroundColor:
                "color-mix(in oklab, var(--rose, #f43f5e) 10%, transparent)",
            }}
          >
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-3.5 w-3.5" /> You will lose:
            </div>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>All workspaces, snapshots, and session notes</li>
              <li>Access to any active Pro subscription (no refund)</li>
              <li>
                Your email will be released for future sign-ups after 30 days
              </li>
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
              I understand my account and all data will be permanently deleted.
            </span>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="p-5 space-y-3 text-sm">
          <div>
            Type <span className="font-mono font-semibold">{CONFIRM}</span> to
            confirm.
          </div>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={CONFIRM}
            className="w-full h-10 px-3 rounded-md bg-secondary/40 border text-sm font-mono"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>
      )}

      <div
        className="p-4 border-t flex flex-col gap-2 sm:flex-row sm:justify-between"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Button variant="outline" size="sm" onClick={close}>
          Cancel
        </Button>
        <div className="flex flex-wrap gap-2">
          {step > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          {step < 2 && (
            <Button
              variant="destructive"
              size="sm"
              disabled={(step === 0 && !reason) || (step === 1 && !ack)}
              onClick={() => setStep(step + 1)}
            >
              Continue
            </Button>
          )}
          {step === 2 && (
            <Button
              variant="destructive"
              size="sm"
              disabled={typed !== CONFIRM}
              onClick={() => {
                toast.success("Account scheduled for deletion in 30 days");
                close();
              }}
            >
              Permanently delete
            </Button>
          )}
        </div>
      </div>
    </ConfirmModalShell>
  );
}
