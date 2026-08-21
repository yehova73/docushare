"use client";

import * as React from "react";

type State = {
  open: boolean;
  templateId?: string;
};

type Action =
  | {
      type: "SHOW_DIALOG";
      templateId: string;
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
        templateId: action.templateId,
      };
    case actionTypes.CLOSE_DIALOG:
      return { ...state, open: false, templateId: undefined };
  }
}

export function useTemplatePreviewDialog() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const openDialog = (params: { templateId: string }) => {
    const { templateId } = params;
    dispatch({ type: actionTypes.SHOW_DIALOG, templateId });
  };

  const closeDialog = () => dispatch({ type: actionTypes.CLOSE_DIALOG });

  return { ...state, openDialog, closeDialog };
}
