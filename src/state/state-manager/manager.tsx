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

type StoreProviderComponent<S extends StateBase> = React.FC<{
  userState?: Partial<S>;
  persist?: PersistOptions;
}>;

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
  StoreProvider: StoreProviderComponent<S>;
  useStore: () => StateContext<S, A>;
} {
  const Context = React.createContext<StateContext<S, A>>([
    handlePersist(defaultState, persist),
    createActions(() => ({})),
  ]);

  return {
    StoreProvider: ({ children, userState }) => {
      const initialState = React.useMemo<S>(() => {
        console.log("UPDAING STATE");
        return handlePersist(defaultState, persist);
      }, []);

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

      React.useEffect(() => {
        if (!userState) return;
        dispatch(() => userState);
      }, [userState]);

      return (
        <Context.Provider value={[state, actions]}>{children}</Context.Provider>
      );
    },
    useStore() {
      return React.useContext<StateContext<S, A>>(Context);
    },
  };
}
