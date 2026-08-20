"use client";

import { Template } from "@/lib/generated/prisma/browser";
import * as React from "react";

type State = {
  open: boolean;
  initialClientId?: string;
  initialTemplateId?: string;
};

type Action =
  | {
      type: "SHOW_DIALOG";
      initialClientId?: string;
      initialTemplateId?: string;
    }
  | { type: "CLOSE_DIALOG" };

const actionTypes = {
  SHOW_DIALOG: "SHOW_DIALOG",
  CLOSE_DIALOG: "CLOSE_DIALOG",
} as const;

const listeners: Array<(state: State) => void> = [];
let memoryState: State = {
  open: false,
};

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.SHOW_DIALOG:
      return {
        open: true,
        initialClientId: action.initialClientId,
        initialTemplateId: action.initialTemplateId,
      };
    case actionTypes.CLOSE_DIALOG:
      return { ...state, open: false };
  }
}

export function useAssignWorkflowToClientSheet() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const openSheet = (params?: {
    initialClientId?: string;
    initialTemplateId?: string;
  }) =>
    dispatch({
      type: actionTypes.SHOW_DIALOG,
      initialClientId: params?.initialClientId,
      initialTemplateId: params?.initialTemplateId,
    });

  const closeDialog = () => dispatch({ type: actionTypes.CLOSE_DIALOG });

  return { ...state, openSheet, closeDialog };
}
