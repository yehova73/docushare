"use client";

import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { requireConfirmation } from "@/components/modals/confirmation-modal/use-confirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import {
  NEW_ASSIGNATION_STEPS,
  useNewAssignationContext,
} from "./new-assignation-context";
import { ClientsStep } from "./steps/clients-step";
import { DeadlinesStep } from "./steps/deadlines-step";
import { RemindersStep } from "./steps/reminders-step";
import { ReviewStep } from "./steps/review-step";
import { TemplateStep } from "./steps/template-step";

const STEP_COMPONENTS = [
  ClientsStep,
  TemplateStep,
  RemindersStep,
  DeadlinesStep,
  ReviewStep,
] as const;

export function NewAssignationStepper() {
  const router = useRouter();
  const {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    selectedClientIds,
    selectedTemplateId,
    templates,
    clients,
    loading,
    saving,
    submitting,
    submit,
    draftId,
  } = useNewAssignationContext();

  const [navigating, setNavigating] = React.useState(false);

  const step = NEW_ASSIGNATION_STEPS[currentStep];
  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = currentStep === NEW_ASSIGNATION_STEPS.length - 1;

  const progress = Math.round(
    ((currentStep + 1) / NEW_ASSIGNATION_STEPS.length) * 100,
  );

  const canGoNext = (() => {
    switch (currentStep) {
      case 0:
        return selectedClientIds.length > 0;
      case 1:
        return selectedTemplateId !== null;
      default:
        return true;
    }
  })();

  const handleNavigation = async (action: () => Promise<void>) => {
    if (navigating) return;
    setNavigating(true);
    try {
      await action();
    } finally {
      setNavigating(false);
    }
  };

  const handleSubmit = async () => {
    const confirmation = requireConfirmation({
      title: "Submit request",
      subtitle: `This will assign the template to ${selectedClientIds.length} client${selectedClientIds.length === 1 ? "" : "s"} and send them a secure upload link. Are you sure you want to continue?`,
      buttons: {
        isSuccess: true,
        confirm: "Yes, submit request",
        cancel: "No, go back",
      },
    });
    const confirmed = await confirmation.promise;
    if (!confirmed) return;

    const results = await submit(true);
    if (!results || results.length === 0) return;
    toast.success("Assignation submitted", {
      description: `The template was assigned to ${results.length} client${results.length === 1 ? "" : "s"}.`,
    });
    router.push("/app/requests");
  };

  const isBusy = saving || submitting || navigating;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between gap-2">
        <nav aria-label="Assignation steps">
          <ol className="flex flex-wrap items-center gap-2">
            {NEW_ASSIGNATION_STEPS.map((s, index) => {
              const isCurrent = index === currentStep;
              const isDone = index < currentStep;
              return (
                <li key={s.id} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="text-muted-foreground/40">/</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleNavigation(() => goToStep(index))}
                    disabled={index > currentStep || isBusy}
                    className={cn(
                      "cursor-pointer group flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                      isCurrent
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full text-[10px] font-semibold",
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isDone
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isDone ? <Check className="size-2.5" /> : index + 1}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleNavigation(prevStep)}
            disabled={currentStep === 0 || isBusy}
          >
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>

          {isLastStep ? (
            <Button type="button" onClick={handleSubmit} disabled={isBusy}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send data-icon="inline-start" />
                  Submit request
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => handleNavigation(nextStep)}
              disabled={!canGoNext || isBusy}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight data-icon="inline-end" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="h-2" />

      {/* Step content */}
      <Card>
        <CardContent className="flex flex-col gap-6">
          {/* <div>
            <h2 className="text-lg font-semibold text-foreground">
              {step.label}
            </h2>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div> */}

          {loading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {step.label}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
              <StepComponent />
            </>
          )}
        </CardContent>
      </Card>

      {/* Footer */}

      {/* Step indicator for mobile */}
      <p className="text-center text-xs text-muted-foreground sm:hidden">
        Step {currentStep + 1} of {NEW_ASSIGNATION_STEPS.length} · {step.label}{" "}
        · {clients.length} clients · {templates.length} templates
        {draftId ? " · draft saved" : ""}
      </p>
    </div>
  );
}
