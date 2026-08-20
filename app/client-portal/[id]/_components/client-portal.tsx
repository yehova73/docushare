"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TemplateField } from "@/lib/generated/prisma/browser";
import { TemplateFieldType } from "@/lib/generated/prisma/enums";
import { TemplateClientAssignationGetPayload } from "@/lib/generated/prisma/models";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { FieldInput } from "./field-input";
import { SuccessView } from "./success-view";
import { useClientPortalContext } from "./context/client-portal-context";
import { formatDueDate, isTextField } from "./context/utils";

/**
 * Transform workflow template sections and fields into sections with items
 */

export function ClientPortal() {
  const {
    workflow,
    allItems,
    isSectionComplete,
    getSectionCompletion,
    expandedSections,
    setExpandedSections,
    sections,
  } = useClientPortalContext();
  const [submitted, setSubmitted] = useState(false);

  const clientName = workflow.client?.name ?? "Valued Client";
  const organizationName = workflow.template?.user?.name ?? "Organization";
  const workflowName =
    workflow.name ?? workflow.template?.name ?? "your review";
  const dueDate = workflow.dueDate;

  // Calculate total items and completed items across all sections

  const completed = allItems.filter(
    (i) => i.status === "done" || (isTextField(i) && i.value),
  ).length;
  const requiredPending = allItems.filter(
    (i) => i.required && i.status !== "done",
  ).length;
  const canSubmit = requiredPending === 0;

  return (
    <div className="">
      {/* Header */}

      <main className="mx-auto max-w-2xl px-4 pt-24 pb-32">
        <AnimatePresence mode="wait">
          {submitted ? (
            <SuccessView key="success" />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-4"
            >
              {/* Welcome */}
              <div className="flex flex-col gap-3">
                <h1 className="text-xl font-semibold sm:text-2xl">
                  {`Hi ${clientName}, ${organizationName} has requested ${allItems.length} item${allItems.length !== 1 ? "s" : ""} for ${workflowName}.`}
                </h1>
                {dueDate && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                    <Clock className="size-4 shrink-0" />
                    {formatDueDate(dueDate)}
                  </div>
                )}
              </div>

              {/* Sections */}
              <div className="flex flex-col gap-2">
                <Accordion
                  type="multiple"
                  value={Array.from(expandedSections)}
                  onValueChange={(values) =>
                    setExpandedSections(new Set(values))
                  }
                  className="w-full"
                >
                  {sections.map((section) => {
                    const sectionCompletion = getSectionCompletion(section.id);
                    const isComplete = isSectionComplete(section.id);

                    return (
                      <AccordionItem
                        key={section.id}
                        value={section.id}
                        className="border-b"
                      >
                        <AccordionTrigger className="hover:no-underline hover:bg-background/50 focus:bg-background/50 focus:ring-0 cursor-pointer p-2 flex items-center">
                          <div className="flex flex-1 items-center gap-3 text-left mr-2">
                            <div className="flex flex-1 justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  {section.name}
                                </span>
                                {isComplete && (
                                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 min-w-1/2">
                                <Progress
                                  value={sectionCompletion}
                                  className="flex-1"
                                />
                                <span className="text-xs text-muted-foreground tabular-nums">
                                  {sectionCompletion}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0">
                          <div className="flex flex-col gap-3 p-2">
                            {section.items.map((item) => (
                              <FieldInput
                                key={item.id}
                                item={item}
                                assignationId={workflow.id}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky footer */}
      {!submitted && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 pt-3 pb-5">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {completed} of {allItems.length} items completed
              </span>
              <Progress
                value={Math.round((completed / allItems.length) * 100)}
              />
            </div>
            <Button
              size="lg"
              disabled={!canSubmit}
              onClick={() => setSubmitted(true)}
            >
              Submit all documents
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
