"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Reminder } from "@/lib/generated/prisma/browser";
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
import { usePathname, useRouter } from "next/navigation";

export const RemindersList: React.FC<{
  reminders: Reminder[];
  search?: string;
  type?: string;
}> = ({ reminders: initialReminders, search = "", type = "ALL" }) => {
  const [reminders, setReminders] = useState(initialReminders);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setReminders(initialReminders);
  }, [initialReminders]);

  // Filter reminders based on search input and selected reminder type
  const filteredReminders = useMemo(() => {
    return sortReminders(reminders).filter((reminder) => {
      // 1. Check Reminder Type Filter
      const matchesType = type === "ALL" || reminder.reminderType === type;

      // 2. Check Search Query (matches against title, subject, or content)
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        reminder.title.toLowerCase().includes(query) ||
        reminder.subject.toLowerCase().includes(query) ||
        reminder.content.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [reminders, search, type]);

  const handleReset = () => {
    router.replace(pathname);
  };

  return (
    <div className="lg:col-span-2">
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
                <Button onClick={handleReset}>Reset Filters</Button>
              </EmptyContent>
            </Empty>
          </Card>
        )}
      </div>
    </div>
  );
};
