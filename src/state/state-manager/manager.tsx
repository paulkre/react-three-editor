import React from "react";

import { persistState, recoverPersistedState, PersistOptions } from "./persist";

export type StateBase = { [key: string]: any };
type ActionsBase = { [key: string]: (...args: any) => void };
type Reducer<S> = React.Reducer<S, (state: S) => Partial<S>>;
export type ActionsCreator<S, A> = (
  dispatch: (set: (state: S) => Partial<S>) => void
) => A;
type StateContext<S, A> = [S, A];

type Options = { persist?: PersistOptions };

const localStorageAvailable = typeof localStorage !== "undefined";

function handlePersist<S extends StateBase>(
  state: S,
  options?: PersistOptions
): S {
  return options && localStorageAvailable
    ? { ...state, ...recoverPersistedState(options) }
    : state;
}

export function createStateManager<S extends StateBase, A extends ActionsBase>(
  defaultState: S,
  createActions: ActionsCreator<S, A>,
  { persist }: Options = {}
): {
  StoreProvider: React.FC;
  useStore: () => StateContext<S, A>;
} {
  const Context = React.createContext<StateContext<S, A>>([
    handlePersist(defaultState, persist),
    createActions(() => ({})),
  ]);

  return {
    StoreProvider: ({ children }) => {
      const initialState = React.useMemo<S>(
        () => handlePersist(defaultState, persist),
        []
      );

      const [state, dispatch] = React.useReducer<Reducer<S>, undefined>(
        React.useCallback((state, set) => {
          const result = set(state);
          if (state === result) return state;
          const newState = { ...state, ...result };
          if (persist && localStorageAvailable) persistState(newState, persist);
          return newState;
        }, []),
        undefined,
        () => initialState
      );

      const actions = React.useMemo(() => createActions(dispatch), [dispatch]);

      return (
        <Context.Provider value={[state, actions]}>{children}</Context.Provider>
      );
    },
    useStore() {
      return React.useContext<StateContext<S, A>>(Context);
    },
  };
}
