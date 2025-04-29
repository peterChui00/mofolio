import { createStore } from 'zustand/vanilla';

import { defaultState, StoreState } from '@/lib/store/default-state';
import { AppSlice, createAppSlice } from '@/lib/store/slices/app-slice';
import {
  createDialogSlice,
  DialogSlice,
} from '@/lib/store/slices/dialog-slice';
import { createUserSlice, UserSlice } from '@/lib/store/slices/user-slice';

export type Store = AppSlice & UserSlice & DialogSlice;

export const initStore = (): StoreState => {
  return defaultState;
};

export const createAppStore = (initState: StoreState = defaultState) => {
  return createStore<Store>()((set, get, store) => ({
    ...initState,
    ...createAppSlice(set, get, store),
    ...createUserSlice(set, get, store),
    ...createDialogSlice(set, get, store),
  }));
};
