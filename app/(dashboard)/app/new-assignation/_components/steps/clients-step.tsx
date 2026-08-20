"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getInitials } from "@/lib/utils";

import { useNewAssignationContext } from "../new-assignation-context";

export function ClientsStep() {
  const {
    clients,
    selectedClientIds,
    selectedClients,
    addClient,
    removeClient,
  } = useNewAssignationContext();

  const [searchOpen, setSearchOpen] = React.useState(false);

  const availableClients = clients.filter(
    (client) => !selectedClientIds.includes(client.id),
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search / add clients */}
      <div className="space-y-2">
        <Label>Add clients</Label>
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={searchOpen}
              className="w-full justify-between font-normal"
              size={"sm"}
            >
              {selectedClients.length > 0
                ? `${selectedClients.length} client${selectedClients.length === 1 ? "" : "s"} selected`
                : "Search clients to add..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full min-w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search clients..." />
              <CommandList>
                <CommandEmpty>No clients found.</CommandEmpty>
                <CommandGroup>
                  {availableClients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={`${client.name} ${client.company ?? ""} ${client.email ?? ""}`}
                      onSelect={() => {
                        addClient(client.id);
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
                            {client.name} - {client.company || "No company"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {client.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected clients table */}
      <div className="space-y-2">
        <Label>Selected clients ({selectedClients.length})</Label>
        {selectedClients.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed py-8 text-sm text-muted-foreground">
            No clients selected yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Company
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {client.name}
                          </div>
                          <div className="text-xs text-muted-foreground sm:hidden">
                            {client.company || "No company"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {client.company || "—"}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {client.email || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${client.name}`}
                        onClick={() => removeClient(client.id)}
                      >
                        <X className={cn("h-4 w-4")} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Check indicator for when all clients are selected */}
      {availableClients.length === 0 && clients.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          All clients are already selected.
        </div>
      )}
    </div>
  );
}
