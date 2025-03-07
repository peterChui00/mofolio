import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { defaultState } from './default-state';
import { AppSlice, AppState, createAppSlice } from './slices/app-slice';

export type Store = AppSlice;

export const initStore = (): AppState => {
  return defaultState;
};

export const createAppStore = (initState: AppState = defaultState) => {
  return createStore<Store>()(
    persist(
      (set, get, store) => ({
        ...initState,
        ...createAppSlice(set, get, store),
      }),
      {
        name: 'app-store',
        storage: createJSONStorage(() => sessionStorage),
        skipHydration: true,
      }
    )
  );
};
