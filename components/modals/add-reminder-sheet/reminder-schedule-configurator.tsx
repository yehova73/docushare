import { Alert, AlertTitle } from "@/components/ui/alert";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reminder, ReminderType } from "@/lib/generated/prisma/browser";
import { Info } from "lucide-react";
import React, { useState } from "react";

type ReminderScheduleType = Pick<
  Reminder,
  "reminderType" | "scheduleType" | "afterDays" | "everyDays"
>;
interface ReminderFormProps {
  values: ReminderScheduleType;
  onChange: (values: ReminderScheduleType) => void;
}

// Single-time send types that do not require schedule configuration
const SINGLE_TIME_TYPES: ReminderType[] = [
  "ASSIGNMENT_STARTED",
  "ASSIGNMENT_OVERDUE",
  "ASSIGNMENT_COMPLETED",
];

export function ReminderForm({ values, onChange }: ReminderFormProps) {
  const isConfigurable = !SINGLE_TIME_TYPES.includes(values.reminderType);

  const handleInputChange = (
    field: keyof ReminderScheduleType,
    value: string | number | null,
  ) => {
    onChange({ ...values, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(values);
  };

  return (
    <div className="space-y-4">
      {/* Reminder Type Select */}
      <Field>
        <FieldLabel htmlFor="c-name">Reminder Type</FieldLabel>
        <Select
          value={values.reminderType}
          onValueChange={(val: ReminderType) =>
            handleInputChange("reminderType", val)
          }
        >
          <SelectTrigger id="reminderType">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASSIGNMENT_STARTED">
              Assignment Started
            </SelectItem>
            <SelectItem value="ASSIGNMENT_REMINDER">
              Assignment Reminder
            </SelectItem>
            <SelectItem value="ASSIGNMENT_DUE_SOON">
              Assignment Due Soon
            </SelectItem>
            <SelectItem value="ASSIGNMENT_OVERDUE">
              Assignment Overdue
            </SelectItem>
            <SelectItem value="ASSIGNMENT_OVERDUE_REMINDER">
              Assignment Overdue Reminder
            </SelectItem>
            <SelectItem value="ASSIGNMENT_COMPLETED">
              Assignment Completed
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* Dynamic Schedule Controls */}
      {isConfigurable ? (
        <div className="space-y-4 mt-4">
          <Field>
            <Label htmlFor="scheduleType">Schedule Type</Label>
            <Select
              value={values.scheduleType}
              onValueChange={(val: ReminderScheduleType["scheduleType"]) =>
                handleInputChange("scheduleType", val)
              }
            >
              <SelectTrigger id="scheduleType" className="bg-background">
                <SelectValue placeholder="Select schedule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AFTER">Send once after a delay</SelectItem>
                <SelectItem value="EVERY">
                  Repeat on a regular schedule
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Schedule Configuration Inputs */}
          {values.scheduleType === "AFTER" && (
            <div className="space-y-2">
              <Label htmlFor="afterDays">Days Delay</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="afterDays"
                  type="number"
                  min={1}
                  className="bg-background"
                  value={values.afterDays ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      "afterDays",
                      parseInt(e.target.value) || null,
                    )
                  }
                  required
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  day(s){" "}
                  {values.reminderType === "ASSIGNMENT_REMINDER"
                    ? "after the assignment is created"
                    : values.reminderType === "ASSIGNMENT_DUE_SOON"
                      ? "before the assignment is due"
                      : values.reminderType === "ASSIGNMENT_OVERDUE_REMINDER"
                        ? "after the assignment is overdue"
                        : ""}
                </span>
              </div>
            </div>
          )}

          {values.scheduleType === "EVERY" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="everyDays">Repeat Interval</Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Every
                  </span>
                  <Input
                    id="everyDays"
                    type="number"
                    min={1}
                    className="bg-background min-w-12 mx-1"
                    value={values.everyDays ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "everyDays",
                        parseInt(e.target.value) || null,
                      )
                    }
                    required
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    day
                    {values.everyDays !== undefined && values.everyDays !== 1
                      ? "s"
                      : ""}
                  </span>
                  {values.reminderType !== "ASSIGNMENT_DUE_SOON" ? (
                    <>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        , delayed by
                      </span>
                      <Input
                        id="afterDaysOffset"
                        type="number"
                        min={0}
                        className="bg-background min-w-12 mx-1"
                        value={values.afterDays ?? ""}
                        onChange={(e) =>
                          handleInputChange(
                            "afterDays",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        required
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        day
                        {values.afterDays !== undefined && values.afterDays != 1
                          ? "s"
                          : ""}{" "}
                        {values.reminderType === "ASSIGNMENT_REMINDER"
                          ? "from when the assignment is created"
                          : values.reminderType ===
                              "ASSIGNMENT_OVERDUE_REMINDER"
                            ? "after the assignment is overdue"
                            : ""}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      before the assignment is due
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Alert variant="default" className="flex items-center gap-2">
          <AlertTitle className="flex items-center gap-2 font-normal">
            <Info className="" />
            This reminder type triggers instantly when the event occurs and does
            not require schedule configuration.
          </AlertTitle>
        </Alert>
      )}
    </div>
  );
}
