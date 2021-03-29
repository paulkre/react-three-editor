import React from "react";

import { persistState, recoverPersistedState, PersistOptions } from "./persist";

export type StateBase = { [key: string]: any };
type Reducer<S> = React.Reducer<S, (state: S) => Partial<S>>;
export type ActionsCreator<S, A> = (
  dispatch: (set: (state: S) => Partial<S>) => void
) => A;
type StateContext<S, A> = [S, A];

type Options = { persist?: PersistOptions };

const localStorageAvailable = typeof localStorage !== "undefined";

export function createStateManager<
  S extends StateBase,
  A extends { [key: string]: (...args: any) => void }
>(
  initialState: S,
  createActions: ActionsCreator<S, A>,
  { persist }: Options = {}
): {
  StoreProvider: React.FC<{ userState?: Partial<S> }>;
  useStore: () => StateContext<S, A>;
} {
  if (persist && localStorageAvailable)
    initialState = {
      ...initialState,
      ...recoverPersistedState(persist),
    };

  const Context = React.createContext<StateContext<S, A>>([
    initialState,
    createActions(() => {}),
  ]);

  const reducer: Reducer<S> = (state, set) => {
    const result = set(state);
    if (state === result) return state;
    const newState = { ...state, ...result };
    if (persist && localStorageAvailable) persistState(newState, persist);
    return newState;
  };

  return {
    StoreProvider: ({ children, userState }) => {
      const [state, dispatch] = React.useReducer<Reducer<S>, undefined>(
        reducer,
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
    useStore: () => React.useContext(Context),
  };
}
