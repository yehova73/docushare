"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { createAssignationDraftAction } from "@/actions/assign-template/drafts/create-assignation-draft";
import { getAssignationDraftAction } from "@/actions/assign-template/drafts/get-assignation-draft";
import { updateAssignationDraftAction } from "@/actions/assign-template/drafts/update-assignation-draft";
import { submitAssignationDraftAction } from "@/actions/assign-template/drafts/submit-assignation-draft";
import { useServerAction } from "@/hooks/use-server-action";
import { Client, Template } from "@/lib/generated/prisma/browser";

export const NEW_ASSIGNATION_STEPS = [
  {
    id: "clients",
    label: "Clients",
    description: "Select one or more clients to assign this workflow to.",
  },
  {
    id: "template",
    label: "Template",
    description: "Choose the template the clients will complete.",
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Review the automated reminders attached to the assignment.",
  },
  {
    id: "deadlines",
    label: "Deadlines",
    description: "Set an optional due date for each client.",
  },
  {
    id: "review",
    label: "Review & submit",
    description: "Review the assignment details before submitting.",
  },
] as const;

export type NewAssignationStepId = (typeof NEW_ASSIGNATION_STEPS)[number]["id"];

export type SubmittedAssignationResult = {
  clientId: string;
  clientName: string;
  url: string;
};

type NewAssignationContextValue = {
  clients: Client[];
  templates: Template[];
  loading: boolean;

  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToStep: (step: number) => Promise<void>;
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;

  selectedClientIds: string[];
  selectedClients: Client[];
  addClient: (id: string) => void;
  removeClient: (id: string) => void;
  setSelectedClientIds: (ids: string[]) => void;

  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string | null) => void;

  dueDates: Record<string, string>;
  setDueDate: (clientId: string, date: string) => void;

  draftId: string | null;
  saving: boolean;
  submitting: boolean;
  submit: (startNow?: boolean) => Promise<SubmittedAssignationResult[] | null>;
  restoreDraft: (draftId: string) => Promise<boolean>;
  ensureDraft: () => Promise<string | null>;
};

const NewAssignationContext = React.createContext<
  NewAssignationContextValue | undefined
>(undefined);

const dateToInput = (date: Date | null | undefined): string =>
  date ? date.toISOString().split("T")[0] : "";

export function NewAssignationProvider({
  children,
  clients,
  templates,
  loading = false,
}: {
  children: React.ReactNode;
  clients: Client[];
  templates: Template[];
  loading?: boolean;
}) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedClientIds, setSelectedClientIds] = React.useState<string[]>(
    [],
  );
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<
    string | null
  >(null);
  const [dueDates, setDueDates] = React.useState<Record<string, string>>({});

  const [draftId, setDraftId] = React.useState<string | null>(null);
  const draftIdRef = React.useRef<string | null>(null);

  const { call: createDraft, loading: creatingDraft } = useServerAction(
    createAssignationDraftAction,
  );
  const { call: updateDraft, loading: updatingDraft } = useServerAction(
    updateAssignationDraftAction,
  );
  const { call: loadDraft } = useServerAction(getAssignationDraftAction);
  const { call: submitDraft, loading: submittingDraft } = useServerAction(
    submitAssignationDraftAction,
  );

  const applyDraftId = React.useCallback((id: string | null) => {
    draftIdRef.current = id;
    setDraftId(id);
  }, []);

  const addClient = React.useCallback((id: string) => {
    setSelectedClientIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeClient = React.useCallback((id: string) => {
    setSelectedClientIds((prev) => prev.filter((clientId) => clientId !== id));
    setDueDates((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const setDueDate = React.useCallback((clientId: string, date: string) => {
    setDueDates((prev) => ({ ...prev, [clientId]: date }));
  }, []);

  const ensureDraft = React.useCallback(async (): Promise<string | null> => {
    if (draftIdRef.current) return draftIdRef.current;
    const res = await createDraft({
      templateId: selectedTemplateId,
      clientIds: selectedClientIds,
      currentStep,
    });
    const id = res?.draft?.id ?? null;
    if (id) applyDraftId(id);
    return id;
  }, [
    selectedTemplateId,
    selectedClientIds,
    currentStep,
    createDraft,
    applyDraftId,
  ]);

  const saveProgress = React.useCallback(
    async (step: number) => {
      const clientsInput = selectedClientIds.map((clientId) => ({
        clientId,
        dueDate: dueDates[clientId] ?? null,
      }));

      let id = draftIdRef.current;
      if (!id) {
        const res = await createDraft({
          templateId: selectedTemplateId,
          clientIds: selectedClientIds,
          currentStep: step,
        });
        id = res?.draft?.id ?? null;
        if (id) applyDraftId(id);
      }
      if (!id) return;

      await updateDraft({
        draftId: id,
        templateId: selectedTemplateId,
        currentStep: step,
        clients: clientsInput,
      });
    },
    [
      selectedTemplateId,
      selectedClientIds,
      dueDates,
      createDraft,
      updateDraft,
      applyDraftId,
    ],
  );

  const goToStep = React.useCallback(
    async (step: number) => {
      const clamped = Math.max(
        0,
        Math.min(step, NEW_ASSIGNATION_STEPS.length - 1),
      );
      await saveProgress(clamped);
      setCurrentStep(clamped);
    },
    [saveProgress],
  );

  const nextStep = React.useCallback(async () => {
    const next = Math.min(currentStep + 1, NEW_ASSIGNATION_STEPS.length - 1);
    await saveProgress(next);
    setCurrentStep(next);
  }, [currentStep, saveProgress]);

  const prevStep = React.useCallback(async () => {
    const prev = Math.max(currentStep - 1, 0);
    await saveProgress(prev);
    setCurrentStep(prev);
  }, [currentStep, saveProgress]);

  const submit = React.useCallback(
    async (startNow = false): Promise<SubmittedAssignationResult[] | null> => {
      const id = draftIdRef.current;
      if (!id) return null;
      const res = await submitDraft({ draftId: id, startNow });
      if (!res) return null;
      return res.assignations.map((assignation) => ({
        clientId: assignation.clientId,
        clientName: assignation.clientName,
        url: assignation.url,
      }));
    },
    [submitDraft],
  );

  const restoreDraft = React.useCallback(
    async (draftId: string): Promise<boolean> => {
      const res = await loadDraft(draftId);
      const draft = res?.draft;
      if (!draft) return false;

      applyDraftId(draft.id);
      setCurrentStep(draft.currentStep);
      setSelectedTemplateId(draft.templateId);
      setSelectedClientIds(draft.clients.map((client) => client.clientId));
      setDueDates(
        Object.fromEntries(
          draft.clients.map((client) => [
            client.clientId,
            dateToInput(client.dueDate),
          ]),
        ),
      );
      return true;
    },
    [loadDraft, applyDraftId],
  );

  const selectedClients = React.useMemo(
    () => clients.filter((client) => selectedClientIds.includes(client.id)),
    [clients, selectedClientIds],
  );

  const value = React.useMemo<NewAssignationContextValue>(
    () => ({
      clients,
      templates,
      loading,
      currentStep,
      setCurrentStep,
      goToStep,
      nextStep,
      prevStep,
      selectedClientIds,
      selectedClients,
      addClient,
      removeClient,
      setSelectedClientIds,
      selectedTemplateId,
      setSelectedTemplateId,
      dueDates,
      setDueDate,
      draftId,
      saving: creatingDraft || updatingDraft,
      submitting: submittingDraft,
      submit,
      restoreDraft,
      ensureDraft,
    }),
    [
      clients,
      templates,
      loading,
      currentStep,
      goToStep,
      nextStep,
      prevStep,
      selectedClientIds,
      selectedClients,
      addClient,
      removeClient,
      selectedTemplateId,
      dueDates,
      setDueDate,
      draftId,
      creatingDraft,
      updatingDraft,
      submittingDraft,
      submit,
      restoreDraft,
      ensureDraft,
    ],
  );

  return (
    <NewAssignationContext.Provider value={value}>
      {children}
    </NewAssignationContext.Provider>
  );
}

export function useNewAssignationContext() {
  const context = React.useContext(NewAssignationContext);
  if (!context) {
    throw new Error(
      "useNewAssignationContext must be used within a NewAssignationProvider",
    );
  }
  return context;
}

/**
 * Reads `templateId`, `clientIds` (comma separated) and `draftId` from the URL
 * query string and auto-selects / restores them in the context on mount.
 *
 * When a `draftId` is present it takes precedence and restores the full saved
 * progress. Otherwise `templateId` and `clientIds` are applied individually.
 */
export function NewAssignationSearchParamsSync() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    setSelectedTemplateId,
    setSelectedClientIds,
    setCurrentStep,
    restoreDraft,
    draftId,
  } = useNewAssignationContext();

  const syncedRef = React.useRef(false);

  React.useEffect(() => {
    if (syncedRef.current) return;
    syncedRef.current = true;

    const draftIdParam = searchParams.get("draftId");

    const applyInlineParams = () => {
      const templateId = searchParams.get("templateId");
      if (templateId) setSelectedTemplateId(templateId);

      const clientIdsParam = searchParams.get("clientIds");
      if (clientIdsParam) {
        const ids = clientIdsParam
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean);
        if (ids.length > 0) setSelectedClientIds(ids);
      }
    };

    async function syncFromUrl() {
      if (draftIdParam) {
        const restored = await restoreDraft(draftIdParam);
        if (!restored) applyInlineParams();
      } else {
        applyInlineParams();
      }
    }

    syncFromUrl();
  }, [
    searchParams,
    setSelectedTemplateId,
    setSelectedClientIds,
    setCurrentStep,
    restoreDraft,
  ]);

  // Keep the URL in sync with the active draft so reloads restore it.
  React.useEffect(() => {
    if (!draftId) return;
    const params = new URLSearchParams(searchParams.toString());
    if (params.get("draftId") === draftId) return;
    params.set("draftId", draftId);
    router.replace(`${pathname}?${params.toString()}`);
  }, [draftId, searchParams, router, pathname]);

  return null;
}
