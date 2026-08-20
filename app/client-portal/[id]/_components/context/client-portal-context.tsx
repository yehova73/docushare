"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ClientWorkflowPayload, PortalSection } from "./types";
import { isTextField, transformWorkflowToSections } from "./utils";
import { FieldCompletionValueGetPayload } from "@/lib/generated/prisma/internal/prismaNamespaceBrowser";

const ClientPortalContext = createContext<
  | {
      sections: PortalSection[];
      expandedSections: Set<string>;
      setExpandedSections: React.Dispatch<React.SetStateAction<Set<string>>>;
      workflow: ClientWorkflowPayload;

      setText: (id: string, value: string) => void;
      isSectionComplete: (sectionId: string) => boolean;
      getSectionCompletion: (sectionId: string) => number;

      allItems: ReturnType<typeof transformWorkflowToSections>[number]["items"];
      onFieldFilesUpdate: (
        fieldId: string,
        values: FieldCompletionValueGetPayload<{ include: { files: true } }>,
      ) => void;
    }
  | undefined
>(undefined);

// 2. Create the Provider Component
export function ClientPortalProvider({
  children,
  workflow,
}: {
  children: React.ReactNode;
  workflow: ClientWorkflowPayload;
}) {
  const [sections, setSections] = useState<PortalSection[]>(() =>
    transformWorkflowToSections(workflow),
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id)),
  );

  const setText = (id: string, value: string) =>
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        items: section.items.map((i) => (i.id === id ? { ...i, value } : i)),
      })),
    );

  const allItems = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  const getSectionItems = useCallback(
    (sectionId: string) => allItems.filter((i) => i.sectionId === sectionId),
    [allItems],
  );

  const isSectionComplete = useCallback(
    (sectionId: string) => {
      const sectionItems = getSectionItems(sectionId);
      if (sectionItems.length === 0) return false;
      return sectionItems.every(
        (i) => i.status === "done" || (isTextField(i) && i.value),
      );
    },
    [getSectionItems],
  );

  const getSectionCompletion = useCallback(
    (sectionId: string) => {
      const sectionItems = getSectionItems(sectionId);
      if (sectionItems.length === 0) return 100;
      const completed = sectionItems.filter(
        (i) => i.status === "done" || (isTextField(i) && i.value),
      ).length;
      return Math.round((completed / sectionItems.length) * 100);
    },
    [getSectionItems],
  );

  const onUploadFinished = (
    fieldId: string,
    values: FieldCompletionValueGetPayload<{ include: { files: true } }>,
  ) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        items: section.items.map((i) =>
          i.id === fieldId
            ? {
                ...i,
                status: "done",
                completionValue: values,
              }
            : i,
        ),
      })),
    );
  };
  return (
    <ClientPortalContext.Provider
      value={{
        sections,
        expandedSections,
        setExpandedSections,
        workflow,

        allItems,
        isSectionComplete,
        setText,
        getSectionCompletion,
        onFieldFilesUpdate: onUploadFinished,
      }}
    >
      {children}
    </ClientPortalContext.Provider>
  );
}

// 3. Custom hook for consuming the Context easily
export function useClientPortalContext() {
  const context = useContext(ClientPortalContext);
  if (!context) {
    throw new Error(
      "useClientPortalContext must be used within a ClientPortalProvider",
    );
  }
  return context;
}
