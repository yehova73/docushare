"use client";

// Inspired by react-hot-toast library
import * as React from "react";

type ConfirmationModalType = {
  title: string;
  subtitle?: string;
  buttons?: {
    confirm?: string;
    isSuccess?: boolean;
    cancel?: string;
  };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actionTypes = {
  REQUIRE_CONFIRMATION: "REQUIRE_CONFIRMATION",
  CLOSE_MODAL: "CLOSE_MODAL",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["REQUIRE_CONFIRMATION"];
      data: ConfirmationModalType & {
        closeCb?: (value: boolean | null) => void;
      };
    }
  | { type: ActionType["CLOSE_MODAL"] };

interface State {
  currentConfirmation?: ConfirmationModalType & {
    closeCb?: (value: boolean | null) => void;
  };
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "REQUIRE_CONFIRMATION":
      return {
        currentConfirmation: action.data,
      };
    case "CLOSE_MODAL": {
      return {
        currentConfirmation: undefined,
      };
    }
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { currentConfirmation: undefined };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function requireConfirmation({ ...props }: ConfirmationModalType) {
  const id = genId();

  // Create a promise and capture the resolve function
  let resolvePromise: (result: boolean | null) => void;
  const promise = new Promise<boolean | null>((resolve) => {
    resolvePromise = resolve;
  });

  const dismiss = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  // Function to be called when confirmation is completed, which resolves the promise
  const closeConfirmation = (result: boolean | null) => {
    dispatch({ type: "CLOSE_MODAL" });
    resolvePromise(result); // Resolve the promise with the result passed
  };

  dispatch({
    type: "REQUIRE_CONFIRMATION",
    data: { ...props, closeCb: closeConfirmation },
  });

  return {
    id: id,
    dismiss,
    closeConfirmation, // Return closeConfirmation to be used when confirmation is done
    promise, // Return the promise so it can be awaited
  };
}

function useCofirmationModal() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    requireConfirmation,
  };
}

export { useCofirmationModal, requireConfirmation };
