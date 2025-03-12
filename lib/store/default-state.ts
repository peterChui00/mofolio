import { AppState, initialAppState } from '@/lib/store/slices/app-slice';
import { initialUserState, UserState } from '@/lib/store/slices/user-slice';

export type StoreState = AppState & UserState;

export const defaultState: StoreState = {
  ...initialAppState,
  ...initialUserState,
};
