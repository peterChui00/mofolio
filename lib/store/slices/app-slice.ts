import Cookies from 'js-cookie';
import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';

export interface AppState {
  isLoading: boolean;
  isAuthLoading: boolean;
  isEditTradeDialogOpen: boolean;
  editTradeDialogState: {
    title: string;
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
  setActivePortfolioId(activePortfolioId: string): void;
};

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  isLoading: false,
  isAuthLoading: true,
  isEditTradeDialogOpen: false,
  editTradeDialogState: {
    title: 'Add Trade',
  },
  activePortfolioId: Cookies.get('activePortfolioId'),
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

  setActivePortfolioId: (activePortfolioId) => {
    Cookies.set('activePortfolioId', activePortfolioId, {
      expires: 30, // keep for 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
    set({ activePortfolioId });
  },
});
