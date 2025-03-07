import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';

export interface AppState {
  isLoading: boolean;
}

export type AppActions = {
  setIsLoading(isLoading: AppState['isLoading']): void;
  resetAppState(): void;
};

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  isLoading: false,
};

export const createAppSlice: StateCreator<Store, [], [], AppSlice> = (set) => ({
  ...initialAppState,
  setIsLoading: (isLoading) => set({ isLoading }),
  resetAppState: () => set(initialAppState),
});
