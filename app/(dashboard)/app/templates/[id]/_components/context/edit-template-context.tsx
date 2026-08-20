"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { TemplateSection } from "@/lib/generated/prisma/client";
import {
  TemplateGetPayload,
  TemplateSectionGetPayload,
} from "@/lib/generated/prisma/models";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useServerAction } from "@/hooks/use-server-action";
import { saveTemplateWithSectionsAction } from "../../../../../../../actions/templates/save-template-with-sections";
import { TemplateField } from "@/lib/generated/prisma/browser";

type EditableTemplate = TemplateGetPayload<{
  include: {
    sections: {
      include: {
        fields: true;
      };
    };
  };
}>;

// Context type
interface TemplateContextType {
  template: EditableTemplate;
  setTemplate: (template: EditableTemplate) => void;
  addEmptySection: () => TemplateSection;
  deleteSection: (sectionId: string) => void;
  renameSection: (sectionId: string, newName: string) => void;
  updateField: (
    sectionId: string,
    fieldId: string,
    data: Partial<Omit<TemplateField, "id" | "sectionId">>,
  ) => void;
  deleteField: (sectionId: string, fieldId: string) => void;
  // Auto-save state
  isSaving: boolean;
  lastSaved: Date | null;
  isDirty: boolean;

  saveTemplate: () => Promise<void>;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined,
);

// Provider Component
interface TemplateProviderProps {
  children: ReactNode;
  initialTemplate: EditableTemplate;
}

export function EditTemplateProvider({
  children,
  initialTemplate,
}: TemplateProviderProps) {
  const [template, setTemplate] = useState<EditableTemplate>(initialTemplate);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const { setOpen } = useSidebar();

  // Debounce timeout ref
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { call: saveTemplate } = useServerAction(
    saveTemplateWithSectionsAction,
  );

  useEffect(() => {
    setOpen(false);
    return () => setOpen(true);
  }, [setOpen]);

  const saveTemplateWithSections = useCallback(
    async (templateToSave: EditableTemplate) => {
      setIsSaving(true);
      try {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        // Optimistic update: assume save succeeded
        const result = await saveTemplate(templateToSave);
        if (result) {
          // Update with server response (in case of conflicts)
          // setTemplate(result);
          setLastSaved(new Date());
          setIsDirty(false);
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
        // On error, keep the dirty state so user knows changes aren't saved
      } finally {
        setIsSaving(false);
      }
    },
    [saveTemplate],
  );

  // Debounced save function
  const triggerAutoSave = useCallback(
    (templateToSave: EditableTemplate) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set up new debounced save
      debounceTimeoutRef.current = setTimeout(async () => {
        saveTemplateWithSections(templateToSave);
      }, 2500); // 500ms debounce
    },
    [saveTemplate],
  );

  const handleTemplateChange = useCallback(
    (newTemplate: EditableTemplate) => {
      setTemplate(newTemplate);
      setIsDirty(true);
      triggerAutoSave(newTemplate);
    },
    [triggerAutoSave],
  );

  const addEmptySection = () => {
    const newSection = {
      id: crypto.randomUUID(),
      templateId: template.id,
      name: "Untitled Section",
      description: "",
      collapsed: false,
      fields: [],
      order: template.sections.length + 1,
    };

    const updated = {
      ...template,
      sections: [...template.sections, newSection],
    };

    handleTemplateChange(updated);
    return newSection;
  };

  const renameSection = (sectionId: string, newName: string) => {
    const updated = {
      ...template,
      sections: template.sections.map((section) =>
        section.id === sectionId ? { ...section, name: newName } : section,
      ),
    };
    handleTemplateChange(updated);
  };

  const deleteSection = (sectionId: string) => {
    const updated = {
      ...template,
      sections: template.sections
        .filter((section) => section.id !== sectionId)
        .map((section, index) => ({
          ...section,
          order: index + 1,
        })),
    };
    handleTemplateChange(updated);
  };

  const updateField = (
    sectionId: string,
    fieldId: string,
    data: Partial<Omit<TemplateField, "id" | "sectionId">>,
  ) => {
    const updated = {
      ...template,
      sections: template.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map((f) =>
                f.id === fieldId ? { ...f, ...data } : f,
              ),
            }
          : s,
      ),
    };
    handleTemplateChange(updated);
  };

  const deleteField = (sectionId: string, fieldId: string) => {
    const updated = {
      ...template,
      sections: template.sections.map((s) =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
          : s,
      ),
    };
    handleTemplateChange(updated);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TemplateContext.Provider
      value={{
        template,
        setTemplate: handleTemplateChange,
        addEmptySection,
        deleteSection,
        renameSection,
        updateField,
        deleteField,

        saveTemplate: () => saveTemplateWithSections(template),
        isSaving,
        lastSaved,
        isDirty,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

// Custom Hook to consume Context
export function useEditTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error(
      "useEditTemplate must be used within an EditTemplateProvider",
    );
  }
  return context;
}
