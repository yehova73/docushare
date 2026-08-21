"use client";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Client } from "@/lib/generated/prisma/browser";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

export const DraftsFilters: React.FC<{ clients: Client[] }> = ({ clients }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const clientIds = useMemo(() => {
    const raw = searchParams.get("clientIds");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const [searchInput, setSearchInput] = useState(search);

  // Keep the input in sync with the URL (e.g. browser back/forward navigation).
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateParams = useCallback(
    (updates: Array<{ key: string; value: string | string[] | null }>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const { key, value } of updates) {
        const isEmpty =
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
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

  const clientById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients],
  );

  const selectedClients = useMemo(
    () => clients.filter((client) => clientIds.includes(client.id)),
    [clients, clientIds],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search drafts..."
          className="h-8 w-full pl-8 sm:w-52"
        />
      </div>

      {/* Client multiselect */}
      <Combobox
        multiple
        value={clientIds}
        onValueChange={(value) => {
          const ids = (value ?? []) as string[];
          updateParams([{ key: "clientIds", value: ids }]);
        }}
        itemToStringLabel={(id) => clientById.get(id)?.name ?? id}
      >
        <ComboboxChips className={cn("w-full sm:w-60")}>
          {selectedClients.map((client) => (
            <ComboboxChip key={client.id}>{client.name}</ComboboxChip>
          ))}
          <ComboboxChipsInput placeholder="Select clients..." />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            {clients.map((client) => (
              <ComboboxItem key={client.id} value={client.id}>
                {client.name}
              </ComboboxItem>
            ))}
            <ComboboxEmpty>No clients found.</ComboboxEmpty>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};
