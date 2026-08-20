"use client";

import { CalendarDays } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { useNewAssignationContext } from "../new-assignation-context";

export function DeadlinesStep() {
  const { selectedClients, dueDates, setDueDate } = useNewAssignationContext();

  if (selectedClients.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed py-8 text-sm text-muted-foreground">
        Select at least one client in step 1 to set deadlines.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {selectedClients.map((client) => {
        const dueDate = dueDates[client.id] || "";
        return (
          <div
            key={client.id}
            className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{client.name}</div>
                <div className="text-xs text-muted-foreground">
                  {client.company || "No company"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(client.id, e.target.value)}
                aria-label={`Due date for ${client.name}`}
              />
            </div>
          </div>
        );
      })}

      <p className="text-xs text-muted-foreground">
        {`Deadlines are optional. Leave a client's date empty to skip it.`}
      </p>
    </div>
  );
}
