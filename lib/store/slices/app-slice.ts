import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';
import { AddTradeFromProps } from '@/components/trades/add-trade-form';

export interface AppState {
  isLoading: boolean;
  isAddTradeDialogOpen: boolean;
  addTradeDialogState: {
    title: string;
    formProps?: AddTradeFromProps;
  };
}

export type AppActions = {
  setIsLoading(isLoading: AppState['isLoading']): void;
  toggleAddTradeDialog(
    isAddTradeDialogOpen?: AppState['isAddTradeDialogOpen']
  ): void;
  setAddTradeDialogState(
    addTradeDialogState: AppState['addTradeDialogState']
  ): void;
  resetAppState(): void;
};

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  isLoading: false,
  isAddTradeDialogOpen: false,
  addTradeDialogState: {
    title: 'Add Trade',
  },
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
  setAddTradeDialogState: (addTradeDialogState) => set({ addTradeDialogState }),
  resetAppState: () => set(initialAppState),
});
