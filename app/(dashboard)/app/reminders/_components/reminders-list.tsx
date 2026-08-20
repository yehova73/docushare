"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reminder, ReminderType } from "@/lib/generated/prisma/browser";
import { ReminderCard } from "./reminder-card";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sortReminders } from "./utils";

// Human-readable labels for the ReminderType filter dropdown
const REMINDER_TYPE_LABELS: Record<ReminderType, string> = {
  ASSIGNMENT_STARTED: "Assignment Started",
  ASSIGNMENT_REMINDER: "Assignment Reminder",
  ASSIGNMENT_DUE_SOON: "Assignment Due Soon",
  ASSIGNMENT_OVERDUE: "Assignment Overdue",
  ASSIGNMENT_OVERDUE_REMINDER: "Overdue Reminder",
  ASSIGNMENT_COMPLETED: "Assignment Completed",
};

export const RemindersList: React.FC<{ reminders: Reminder[] }> = ({
  reminders: initialReminders,
}) => {
  const [reminders, setReminders] = useState(initialReminders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  useEffect(() => {
    setReminders(initialReminders);
  }, [initialReminders]);

  // Filter reminders based on search input and selected reminder type
  const filteredReminders = useMemo(() => {
    return sortReminders(reminders).filter((reminder) => {
      // 1. Check Reminder Type Filter
      const matchesType =
        selectedType === "ALL" || reminder.reminderType === selectedType;

      // 2. Check Search Query (matches against title, subject, or content)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        reminder.title.toLowerCase().includes(query) ||
        reminder.subject.toLowerCase().includes(query) ||
        reminder.content.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [reminders, searchQuery, selectedType]);

  return (
    <div className="lg:col-span-2">
      {/* Controls Header */}
      <div className="flex items-center justify-between mb-4 gap-4">
        {/* Search Bar */}
        <div className="relative max-w-[200px] w-full">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-8 bg-background"
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Type Filter Select */}
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            {Object.entries(REMINDER_TYPE_LABELS).map(([type, label]) => (
              <SelectItem key={type} value={type}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reminders List Timeline */}
      <div
        className={cn(
          "relative flex flex-col gap-4",
          filteredReminders.length > 0 ? " pl-6" : "",
        )}
      >
        {!!filteredReminders.length && (
          <span
            className="absolute top-2 bottom-2 left-[9px] w-px bg-border"
            aria-hidden
          />
        )}
        {filteredReminders.length > 0 ? (
          filteredReminders.map((step) => (
            <ReminderCard
              key={step.id}
              reminder={step}
              onDelete={(id) =>
                setReminders((prev) => prev.filter((x) => x.id !== id))
              }
              onEdit={(updatedReminder) =>
                setReminders((prev) =>
                  prev.map((r) =>
                    r.id === updatedReminder.id ? updatedReminder : r,
                  ),
                )
              }
            />
          ))
        ) : (
          <Card>
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Search className="h-6 w-6 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No reminders found</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search or filter to find what you're
                  looking for.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("ALL");
                  }}
                >
                  Reset Filters
                </Button>
              </EmptyContent>
            </Empty>
          </Card>
        )}
      </div>
    </div>
  );
};
