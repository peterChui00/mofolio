import { User } from '@supabase/supabase-js';
import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';

export interface UserState {
  user: User | null;
}

export type UserActions = {
  resetUserState(): void;
  setUser: (user: UserState['user']) => void;
};

export type UserSlice = UserState & UserActions;

export const initialUserState: UserState = {
  user: null,
};

export const createUserSlice: StateCreator<Store, [], [], UserSlice> = (
  set
) => ({
  ...initialUserState,
  resetUserState: () => set(initialUserState),

  setUser: (user) => set({ user }),
});
