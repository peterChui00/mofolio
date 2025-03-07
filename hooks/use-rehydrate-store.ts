import { useLayoutEffect } from 'react';

import { AppStore } from '@/components/layout/app-store-provider';

export function useRehydrateStore(store: AppStore) {
  useLayoutEffect(() => {
    store.persist?.rehydrate();
  }, []);
}
