import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';
import { EditTradeFromProps } from '@/components/trades/edit-trade-form';

export interface AppState {
  isLoading: boolean;
  isEditTradeDialogOpen: boolean;
  editTradeDialogState: {
    title: string;
    formProps?: EditTradeFromProps;
  };
}

export type AppActions = {
  setIsLoading(isLoading: AppState['isLoading']): void;
  toggleEditTradeDialog(
    isEditTradeDialogOpen?: AppState['isEditTradeDialogOpen']
  ): void;
  setEditTradeDialogState(
    editTradeDialogState: AppState['editTradeDialogState']
  ): void;
  resetAppState(): void;
};

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  isLoading: false,
  isEditTradeDialogOpen: false,
  editTradeDialogState: {
    title: 'Add Trade',
  },
};

export const createAppSlice: StateCreator<Store, [], [], AppSlice> = (set) => ({
  ...initialAppState,
  setIsLoading: (isLoading) => set({ isLoading }),
  toggleEditTradeDialog: (isEditTradeDialogOpen) =>
    set((state) => ({
      isEditTradeDialogOpen:
        typeof isEditTradeDialogOpen === 'boolean'
          ? isEditTradeDialogOpen
          : !state.isEditTradeDialogOpen,
    })),
  setEditTradeDialogState: (editTradeDialogState) =>
    set({ editTradeDialogState }),
  resetAppState: () => set(initialAppState),
});
