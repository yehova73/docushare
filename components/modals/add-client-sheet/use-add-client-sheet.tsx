"use client";

import { Client } from "@/lib/generated/prisma/browser";
import * as React from "react";

type State = {
  open: boolean;
  cb?: (client: Client) => void;
  editClient?: Client;
};

type Action =
  | {
      type: "SHOW_DIALOG";
      cb?: (client: Client) => void;
      editClient?: Client;
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
        cb: action.cb,
        editClient: action.editClient,
      };
    case actionTypes.CLOSE_DIALOG:
      return { ...state, open: false, cb: undefined, editClient: undefined };
  }
}

export function useAddClientSheet() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const openDialog = (params: {
    cb?: (client: Client) => void;
    editClient?: Client;
  }) => {
    const { cb, editClient } = params;
    dispatch({ type: actionTypes.SHOW_DIALOG, cb, editClient });
  };

  const closeDialog = () => dispatch({ type: actionTypes.CLOSE_DIALOG });

  return { ...state, openDialog, closeDialog };
}
