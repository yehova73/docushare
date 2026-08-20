"use client";

import { Bell, CalendarDays, Check, FileText, Users } from "lucide-react";
import * as React from "react";

import { RemindersAccordion } from "@/components/modals/assign-workflow-to-client-sheet/reminders-accordion";
import { SelectedTemplatePreview } from "@/components/modals/assign-workflow-to-client-sheet/selected-template-preview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useNewAssignationContext } from "../new-assignation-context";

const formatDate = (value: string) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
};

export function ReviewStep() {
  const { selectedClients, selectedTemplateId, templates, dueDates, draftId } =
    useNewAssignationContext();

  const selectedTemplate = templates.find(
    (template) => template.id === selectedTemplateId,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Clients */}
      <Accordion
        type="multiple"
        defaultValue={["clients", "template", "reminders"]}
        className="rounded-lg border border-border px-4"
      >
        <AccordionItem value="clients">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              Clients
              <span className="text-xs font-normal text-muted-foreground">
                {selectedClients.length} selected
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {selectedClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No clients selected.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {selectedClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{client.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {client.company || "No company"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {dueDates[client.id]
                        ? formatDate(dueDates[client.id])
                        : "No due date"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Template */}
      <Accordion
        type="multiple"
        defaultValue={["template", "reminders"]}
        className="rounded-lg border border-border px-4"
      >
        <AccordionItem value="template">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              Template
              {selectedTemplate && (
                <span className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                  <Check className="size-3.5 text-primary" />
                  {selectedTemplate.name} · {selectedTemplate.totalFields}{" "}
                  fields , {selectedTemplate.requiredFields} required
                </span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {selectedTemplateId ? (
              <SelectedTemplatePreview
                selectedTemplateId={selectedTemplateId}
                defaultOpen
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No template selected.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Reminders */}
      <Accordion
        type="multiple"
        defaultValue={["reminders"]}
        className="rounded-lg border border-border px-4"
      >
        <AccordionItem value="reminders">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              Reminders
              <span className="text-xs font-normal text-muted-foreground">
                Review the automated reminders for this assignation.
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <RemindersAccordion open batchId={draftId ?? undefined} readOnly />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
