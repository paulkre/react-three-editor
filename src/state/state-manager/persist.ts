import { StateBase } from "./manager";

export type PersistOptions = {
  name: string;
  include?: string[];
  exclude?: string[];
};

function filterStateData(
  state: StateBase,
  { include, exclude }: PersistOptions
): StateBase {
  let keys = Object.keys(state);
  if (include && include.length)
    keys = keys.filter((key) => include!.includes(key));
  else if (exclude && exclude.length)
    keys = keys.filter((key) => !exclude.includes(key));
  const storageState: StateBase = {};
  keys.forEach((key) => void (storageState[key] = state[key]));
  return storageState;
}

export function persistState(state: StateBase, options: PersistOptions) {
  localStorage.setItem(
    options.name,
    JSON.stringify(filterStateData(state, options))
  );
}

export function recoverPersistedState(options: PersistOptions): any {
  const storageData = localStorage.getItem(options.name);
  if (storageData) {
    try {
      const data = JSON.parse(storageData);
      if (typeof data !== "object") throw Error();
      return filterStateData(data, options);
    } catch {
      localStorage.removeItem(options.name);
    }
  }

  return {};
}
