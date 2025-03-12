'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore as useZustandStore, type StoreApi } from 'zustand';

import { createAppStore, initStore, Store } from '@/lib/store';

export const AppStoreContext = createContext<StoreApi<Store> | null>(null);

export interface AppStoreProviderProps {
  children: ReactNode;
}

export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
  const storeRef = useRef<StoreApi<Store>>(null);
  if (!storeRef.current) storeRef.current = createAppStore(initStore());

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: Store) => T): T => {
  const appStoreContext = useContext(AppStoreContext);

  if (!appStoreContext) {
    throw new Error('useStore must be use within AppStoreProvider');
  }

  return useZustandStore(appStoreContext, selector);
};
