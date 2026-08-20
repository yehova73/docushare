"use client";

import { Template } from "@/lib/generated/prisma/browser";
import * as React from "react";

type State = {
  open: boolean;
  editTemplate?: {
    id: string;
    name: string;
    description: string;
    category: string;
  };
  cb?: (template: Template) => void;
};

type Action =
  | {
      type: "SHOW_DIALOG";
      editTemplate?: {
        id: string;
        name: string;
        description: string;
        category: string;
      };
      cb?: (template: Template) => void;
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
        editTemplate: action.editTemplate,
        cb: action.cb,
      };
    case actionTypes.CLOSE_DIALOG:
      return { ...state, open: false };
  }
}

export function useNewTemplateSheet() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const openDialog = (params?: {
    cb?: (template: Template) => void;
    editTemplate?: {
      id: string;
      name: string;
      description: string;
      category: string;
    };
  }) => dispatch({ type: actionTypes.SHOW_DIALOG, ...params });

  const closeDialog = () => dispatch({ type: actionTypes.CLOSE_DIALOG });

  return { ...state, openDialog, closeDialog };
}
