import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';

export interface AppState {
  isLoading: boolean;
  isAddTradeDialogOpen: boolean;
}

export type AppActions = {
  setIsLoading(isLoading: AppState['isLoading']): void;
  toggleAddTradeDialog(
    isAddTradeDialogOpen?: AppState['isAddTradeDialogOpen']
  ): void;
  resetAppState(): void;
};

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  isLoading: false,
  isAddTradeDialogOpen: false,
};

export const createAppSlice: StateCreator<Store, [], [], AppSlice> = (set) => ({
  ...initialAppState,
  setIsLoading: (isLoading) => set({ isLoading }),
  toggleAddTradeDialog: (isAddTradeDialogOpen) =>
    set((state) => ({
      isAddTradeDialogOpen:
        typeof isAddTradeDialogOpen === 'boolean'
          ? isAddTradeDialogOpen
          : !state.isAddTradeDialogOpen,
    })),
  resetAppState: () => set(initialAppState),
});
