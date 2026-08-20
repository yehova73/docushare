"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, UserPlus } from "lucide-react";
import { useAddReminderSheet } from "./use-add-reminder-sheet";
import useServerAction from "@/hooks/use-server-action";
import {
  createReminderAction,
  CreateReminderInput,
} from "@/actions/reminders/create-reminder";
import {
  editReminderAction,
  EditReminderInput,
} from "@/actions/reminders/edit-reminder";
import { createBatchReminderAction } from "@/actions/reminders/create-batch-reminder";
import { editBatchReminderAction } from "@/actions/reminders/edit-batch-reminder";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ReminderForm } from "./reminder-schedule-configurator";
import {
  Reminder,
  ReminderType,
  ReminderScheduleType,
} from "@/lib/generated/prisma/browser";
import { useRouter } from "next/navigation";

export const emailVariables = [
  {
    name: "Client name",
    value: "{{client.name}}",
  },
  {
    name: "Client email",
    value: "{{client.email}}",
  },
  {
    name: "Client company",
    value: "{{client.company}}",
  },
  {
    name: "Client phone",
    value: "{{client.phone}}",
  },
  {
    name: "Workflow name",
    value: "{{workflow.name}}",
  },
  {
    name: "Workflow description",
    value: "{{workflow.description}}",
  },
  {
    name: "Workflow due date",
    value: "{{workflow.dueDate}}",
  },
  {
    name: "Workflow status",
    value: "{{workflow.status}}",
  },
  {
    name: "Workflow progress",
    value: "{{workflow.progress}}",
  },
  {
    name: "Workflow remaining fields",
    value: "{{workflow.remainingFields}}",
  },
];

interface ReminderFormValues {
  title: string;
  subject: string;
  content: string;
  reminderType: ReminderType;
  scheduleType: ReminderScheduleType;
  afterDays?: number | null;
  everyDays?: number | null;
}

export const AddReminderSheet = () => {
  const { closeDialog, cb, open, editReminder, batchId } =
    useAddReminderSheet();
  const { call: callCreateReminder, loading } =
    useServerAction(createReminderAction);
  const { call: callEditReminder, loading: editLoading } =
    useServerAction(editReminderAction);
  const { call: callCreateBatchReminder, loading: batchCreateLoading } =
    useServerAction(createBatchReminderAction);
  const { call: callEditBatchReminder, loading: batchEditLoading } =
    useServerAction(editBatchReminderAction);

  const { register, handleSubmit, reset, getValues, setValue, watch } =
    useForm<ReminderFormValues>({
      defaultValues: {
        title: "",
        subject: "",
        content: "",
        reminderType: "ASSIGNMENT_REMINDER",
        scheduleType: "AFTER",
        afterDays: 1,
        everyDays: 1,
      },
    });

  // Watch schedule values to update form
  const scheduleValues = watch([
    "reminderType",
    "scheduleType",
    "afterDays",
    "everyDays",
  ]);

  useEffect(() => {
    if (!open) return;

    if (editReminder) {
      reset({
        title: editReminder.title || "",
        subject: editReminder.subject || "",
        content: editReminder.content || "",
        reminderType: editReminder.reminderType,
        scheduleType: editReminder.scheduleType,
        afterDays: editReminder.afterDays || undefined,
        everyDays: editReminder.everyDays || undefined,
      });
    } else {
      reset({
        title: "",
        subject: "",
        content: "",
        reminderType: "ASSIGNMENT_REMINDER",
        scheduleType: "AFTER",
        afterDays: 1,
        everyDays: 1,
      });
    }
  }, [open, editReminder, reset]);

  const onSubmit = async (data: ReminderFormValues) => {
    if (editReminder && "id" in editReminder) {
      const editInput: EditReminderInput = {
        id: (editReminder as Reminder).id,
        ...data,
      };
      const res = batchId
        ? await callEditBatchReminder(batchId, editInput)
        : await callEditReminder(editInput);
      if (res) {
        setTimeout(() => {
          reset();
        }, 200);
        closeDialog();
        if (typeof cb === "function") {
          cb(res);
        }
      }
    } else {
      const createInput: CreateReminderInput = data;
      const res = batchId
        ? await callCreateBatchReminder(batchId, createInput)
        : await callCreateReminder(createInput);
      if (res) {
        setTimeout(() => {
          reset();
        }, 200);
        closeDialog();
        if (typeof cb === "function") {
          cb(res);
        }
      }
    }
  };

  const isLoading =
    loading || editLoading || batchCreateLoading || batchEditLoading;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <SheetContent className="flex flex-col !max-w-xl w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <SheetHeader>
            <SheetTitle>
              {editReminder ? "Edit reminder" : "Add new reminder"}
            </SheetTitle>
            <SheetDescription>
              {editReminder
                ? "Update your email reminder settings."
                : "Add a new email reminder in your automation workflow. This reminder will be sent to the specified email address at the scheduled time."}
              {batchId && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  This reminder belongs to the current assignation batch only
                  and will not affect your global reminders.
                </span>
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Reminder name</FieldLabel>
                <Input
                  id="title"
                  placeholder="Weekly Check-in"
                  {...register("title", {
                    required: "Reminder name is required",
                  })}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="subject">Email subject</FieldLabel>
                <Input
                  id="subject"
                  placeholder="Your assignment reminder"
                  {...register("subject", {
                    required: "Email subject is required",
                  })}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="content">Email content</FieldLabel>
                <Textarea
                  id="content"
                  placeholder="Write your reminder message here..."
                  className="min-h-24"
                  {...register("content", {
                    required: "Email content is required",
                  })}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {emailVariables.map((variable) => (
                    <Button
                      key={variable.value}
                      variant="secondary"
                      size="xs"
                      type="button"
                      onClick={() => {
                        const currentContent = getValues("content") || "";
                        setValue(
                          "content",
                          currentContent + " " + variable.value,
                        );
                      }}
                    >
                      {variable.name}
                    </Button>
                  ))}
                </div>
              </Field>

              <Field>
                <ReminderForm
                  values={{
                    reminderType: getValues("reminderType"),
                    scheduleType: getValues("scheduleType"),
                    afterDays: getValues("afterDays") ?? null,
                    everyDays: getValues("everyDays") ?? null,
                  }}
                  onChange={(data) => {
                    setValue("reminderType", data.reminderType);
                    setValue("scheduleType", data.scheduleType);
                    setValue("afterDays", data.afterDays);
                    setValue("everyDays", data.everyDays);
                  }}
                />
              </Field>
            </FieldGroup>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isLoading}>
              <Plus data-icon="inline-start" />
              {editReminder ? "Update reminder" : "Save reminder"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export const AddReminderSheetTrigger = () => {
  const { openDialog } = useAddReminderSheet();
  const router = useRouter();
  return (
    <Button onClick={() => openDialog({ cb: () => router.refresh() })}>
      <UserPlus data-icon="inline-start" />
      Add reminder
    </Button>
  );
};
