import { AppState, initialAppState } from './slices/app-slice';

export type StoreState = AppState;

export const defaultState: AppState = {
  ...initialAppState,
};
