import Cookies from 'js-cookie';
import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';

export interface AppState {
  isLoading: boolean;
  isAuthLoading: boolean;
  activePortfolioId?: string;
}

export type AppActions = {
  resetAppState(): void;
  setIsLoading(isLoading: AppState['isLoading']): void;
  setIsAuthLoading(isAuthLoading: AppState['isAuthLoading']): void;
  setActivePortfolioId(activePortfolioId: string): void;
};

export type AppSlice = AppState & AppActions;

export const initialAppState: AppState = {
  isLoading: false,
  isAuthLoading: true,
  activePortfolioId: Cookies.get('activePortfolioId'),
};

export const createAppSlice: StateCreator<Store, [], [], AppSlice> = (set) => ({
  ...initialAppState,

  resetAppState: () => set(initialAppState),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

  setActivePortfolioId: (activePortfolioId) => {
    Cookies.set('activePortfolioId', activePortfolioId, {
      expires: 30, // keep for 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
    set({ activePortfolioId });
  },
});
