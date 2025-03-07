'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore as useZustandStore } from 'zustand';

import { createAppStore, initStore, Store } from '@/lib/store';

export type AppStore = ReturnType<typeof createAppStore>;

export const AppStoreContext = createContext<AppStore | null>(null);

export interface AppStoreProviderProps {
  children: ReactNode;
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) storeRef.current = createAppStore(initStore());

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: Store) => T): [T, AppStore] => {
  const appStoreContext = useContext(AppStoreContext);

  if (!appStoreContext) {
    throw new Error('useStore must be use within AppStoreProvider');
  }

  return [useZustandStore(appStoreContext, selector), appStoreContext];
};
