import { Order, Trade } from '@/types';
import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';
import { getOpenTradeBySymbol, getTradeById } from '@/lib/trade-utils';

export interface UserState {
  trades: Trade[];
}

export type UserActions = {
  resetUserState(): void;
  addOrder: (order: Order, tradeId?: string) => void;
};

export type UserSlice = UserState & UserActions;

export const initialUserState: UserState = {
  trades: [],
};

export const createUserSlice: StateCreator<Store, [], [], UserSlice> = (
  set,
  get
) => ({
  ...initialUserState,
  resetUserState: () => set(initialUserState),

  addOrder: (order: Order, tradeId?: string) => {
    const trades = get().trades;
    const targetTrade = tradeId
      ? getTradeById(trades, tradeId)
      : getOpenTradeBySymbol(trades, order.symbol);
    if (targetTrade) {
      // Add order to existing trade
      return set((state) => ({
        trades: state.trades.map((trade) =>
          trade.id === targetTrade.id
            ? {
                ...trade,
                orders: [...trade.orders, order],
              }
            : trade
        ),
      }));
    }

    // Create new trade
    set((state) => ({
      trades: [
        ...state.trades,
        {
          id: crypto.randomUUID(),
          note: '',
          tags: [],
          orders: [order],
        },
      ],
    }));
  },
});
