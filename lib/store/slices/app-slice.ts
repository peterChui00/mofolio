import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';
import { EditTradeFromProps } from '@/components/trades/edit-trade-form';

export interface AppState {
  isLoading: boolean;
  isAuthLoading: boolean;
  isEditTradeDialogOpen: boolean;
  editTradeDialogState: {
    title: string;
    formProps?: EditTradeFromProps;
  };
  activePortfolioId?: string;
}

export type AppActions = {
  resetAppState(): void;
  setIsLoading(isLoading: AppState['isLoading']): void;
  setIsAuthLoading(isAuthLoading: AppState['isAuthLoading']): void;
  toggleEditTradeDialog(
    isEditTradeDialogOpen?: AppState['isEditTradeDialogOpen']
  ): void;
  setEditTradeDialogState(
    editTradeDialogState: AppState['editTradeDialogState']
  ): void;
  setActivePortfolioId(activePortfolioId: AppState['activePortfolioId']): void;
};

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  isLoading: false,
  isAuthLoading: true,
  isEditTradeDialogOpen: false,
  editTradeDialogState: {
    title: 'Add Trade',
  },
  activePortfolioId: undefined,
};

export const createAppSlice: StateCreator<Store, [], [], AppSlice> = (set) => ({
  ...initialAppState,

  resetAppState: () => set(initialAppState),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

  toggleEditTradeDialog: (isEditTradeDialogOpen) =>
    set((state) => ({
      isEditTradeDialogOpen:
        typeof isEditTradeDialogOpen === 'boolean'
          ? isEditTradeDialogOpen
          : !state.isEditTradeDialogOpen,
    })),

  setEditTradeDialogState: (editTradeDialogState) =>
    set({ editTradeDialogState }),

  setActivePortfolioId: (activePortfolioId) => set({ activePortfolioId }),
});
