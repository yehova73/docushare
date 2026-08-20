"use client";

import { ChevronsUpDown, Loader2, Plus } from "lucide-react";
import * as React from "react";

import { getAssignTemplateSheetDataAction } from "@/actions/assign-template/get-assign-template-sheet-data";
import { assignTemplateToClientAction } from "@/actions/assign-template/assign-template-to-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useServerAction } from "@/hooks/use-server-action";
import { Client, Template } from "@/lib/generated/prisma/browser";
import { SelectedTemplatePreview } from "./selected-template-preview";
import { useAssignWorkflowToClientSheet } from "./use-assign-workflow-to-client-sheet";
import { RemindersAccordion } from "./reminders-accordion";
import { requireConfirmation } from "../confirmation-modal/use-confirmation";

export function AssignWorkflowToClientSheet() {
  const { open, closeDialog, initialClientId, initialTemplateId } =
    useAssignWorkflowToClientSheet();
  const { call: getData, loading: loadingData } = useServerAction(
    getAssignTemplateSheetDataAction,
  );
  const { call: assignTemplate, loading: assigningTemplate } = useServerAction(
    assignTemplateToClientAction,
  );

  const [dueDate, setDueDate] = React.useState<Date>();

  const [clients, setClients] = React.useState<Client[]>([]);
  const [templates, setTemplates] = React.useState<Template[]>([]);

  const [clientsOpen, setClientsOpen] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(
    initialClientId ?? null,
  );

  const [templatesOpen, setTemplatesOpen] = React.useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<
    string | null
  >(initialTemplateId ?? null);

  React.useEffect(() => {
    if (!open) return;
    setSelectedClientId(initialClientId ?? null);
    setSelectedTemplateId(initialTemplateId ?? null);
    setDueDate(undefined);
    getData().then((res) => {
      if (res) {
        setClients(res.clients);
        setTemplates(res.templates);
      }
    });
  }, [open, getData, initialClientId, initialTemplateId]);

  const handleSubmit = async () => {
    if (!selectedClientId || !selectedTemplateId) {
      return;
    }
    const confirmation = await requireConfirmation({
      title: "Assign Template",
      subtitle: `Assigning a template will send a request to the client. Are you sure you want to continue?`,
      buttons: {
        isSuccess: true,
        confirm: "Yes, submit request",
        cancel: "No, save as draft",
      },
    });
    const startNow = await confirmation.promise;
    const result = await assignTemplate({
      clientId: selectedClientId,
      templateId: selectedTemplateId,
      dueDate: dueDate,
      startNow: startNow || false,
    });

    if (result) {
      closeDialog();
    }
  };

  return (
    <Sheet open={open} onOpenChange={(val) => (val ? null : closeDialog())}>
      <SheetContent className="flex flex-col !max-w-lg w-full overflow-auto">
        <SheetHeader>
          <SheetTitle>New document request</SheetTitle>
          <SheetDescription>
            Build a checklist and send a secure upload link.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 h-full flex flex-col">
          {/* Creatable Category Select */}
          <div className="space-y-2  px-4">
            <Label>Client</Label>
            <Popover open={clientsOpen} onOpenChange={setClientsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={clientsOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedClientId ? (
                    <span className="truncate">
                      {clients.find((c) => c.id === selectedClientId)?.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Select client...
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full max-w-lg p-0 w-[400px]"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search clients..." />
                  <CommandList>
                    <CommandEmpty className="p-0">
                      Loading clients...
                    </CommandEmpty>

                    {loadingData ? (
                      <CommandGroup heading="Loading clients...">
                        <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      </CommandGroup>
                    ) : (
                      <CommandGroup>
                        {clients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={`${client.name} ${client.company ?? ""} ${client.email ?? ""}`}
                            onSelect={() => {
                              setSelectedClientId(client.id);
                              setClientsOpen(false);
                            }}
                            className="cursor-pointer"
                            noCheckIcon
                          >
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                                  {client.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm">
                                  {client.name} -{" "}
                                  {client.company || "No company"}
                                </div>
                                <div className="ml-auto text-xs text-muted-foreground">
                                  {client.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* Show create option if user types something not in the list */}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 px-4">
            <Label>Start from template</Label>
            <Popover open={templatesOpen} onOpenChange={setTemplatesOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={templatesOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedTemplateId ? (
                    <span className="truncate">
                      {templates.find((t) => t.id === selectedTemplateId)?.name}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Select template...
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full max-w-lg p-0 w-[400px]"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search templates..." />
                  <CommandList>
                    <CommandEmpty className="p-0">
                      Loading templates...
                    </CommandEmpty>

                    {loadingData ? (
                      <CommandGroup heading="Loading templates...">
                        <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      </CommandGroup>
                    ) : (
                      <CommandGroup>
                        {templates.map((template) => (
                          <CommandItem
                            key={template.id}
                            value={`${template.name} ${template.description ?? ""}`}
                            onSelect={() => {
                              setSelectedTemplateId(template.id);
                              setTemplatesOpen(false);
                            }}
                            className="cursor-pointer"
                            noCheckIcon
                          >
                            <div className="w-full">
                              <div className="flex items-center justify-between w-full">
                                <div className="text-sm">{template.name}</div>

                                <div className="ml-auto text-xs line-clamp-2 text-muted-foreground">
                                  {template.totalFields} fields,{" "}
                                  {template.requiredFields} required
                                </div>
                              </div>
                              <div className="ml-auto text-xs line-clamp-2 text-muted-foreground">
                                {template.description || "No description"}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* Show create option if user types something not in the list */}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <SelectedTemplatePreview
            selectedTemplateId={selectedTemplateId || undefined}
          />

          <div className="space-y-2  px-4">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate?.toISOString().split("T")[0] || ""}
              onChange={(e) => setDueDate(new Date(e.target.value))}
              placeholder="Select a due date"
            />
          </div>

          <RemindersAccordion open={open} />
          <SheetFooter className="mt-auto">
            {/* <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog()}
            >
              Cancel
            </Button> */}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={
                !selectedClientId || !selectedTemplateId || assigningTemplate
              }
            >
              {assigningTemplate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const AssignWorkflowToClientSheetTrigger = ({
  variant = "default",
}: {
  variant?: "default" | "outline" | "secondary";
}) => {
  const { openSheet } = useAssignWorkflowToClientSheet();
  return (
    <Button onClick={() => openSheet()} variant={variant}>
      <Plus /> New Request
    </Button>
  );
};
