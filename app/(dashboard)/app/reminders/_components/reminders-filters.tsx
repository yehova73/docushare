"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReminderType } from "@/lib/generated/prisma/browser";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

// Human-readable labels for the ReminderType filter dropdown
export const REMINDER_TYPE_LABELS: Record<ReminderType, string> = {
  ASSIGNMENT_STARTED: "Assignment Started",
  ASSIGNMENT_REMINDER: "Assignment Reminder",
  ASSIGNMENT_DUE_SOON: "Assignment Due Soon",
  ASSIGNMENT_OVERDUE: "Assignment Overdue",
  ASSIGNMENT_OVERDUE_REMINDER: "Overdue Reminder",
  ASSIGNMENT_COMPLETED: "Assignment Completed",
};

export const RemindersFilters: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const type = searchParams.get("type") ?? "ALL";

  const [searchInput, setSearchInput] = useState(search);

  // Keep the input in sync with the URL (e.g. browser back/forward navigation).
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParams = useCallback(
    (updates: Array<{ key: string; value: string | null }>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const { key, value } of updates) {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams],
  );

  // Debounce the search input before pushing it to the URL.
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === search) return;

    const timer = setTimeout(() => {
      updateParams([{ key: "search", value: trimmed || null }]);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search, searchInput, updateParams]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative w-full sm:w-52">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          className="h-8 bg-background pl-8"
          placeholder="Search reminders..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>

      {/* Type filter select */}
      <Select
        value={type}
        onValueChange={(value) => {
          updateParams([
            { key: "type", value: value === "ALL" ? null : value },
          ]);
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
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
  );
};
