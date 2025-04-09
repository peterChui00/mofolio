import { Order, Trade } from '@/types';
import { User } from '@supabase/supabase-js';
import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';
import { getOpenTradeBySymbol, getTradeById } from '@/lib/trade-utils';

export interface UserState {
  user: User | null;
  trades: Trade[];
}

export type UserActions = {
  resetUserState(): void;
  setUser: (user: UserState['user']) => void;
  setTrades: (trades: Trade[]) => void;
  deleteTrade: (tradeId: string | string[]) => void;
  addOrder: (order: Order, tradeId?: string) => void;
  deleteOrder: (orderId: string | string[]) => void;
};

export type UserSlice = UserState & UserActions;

export const initialUserState: UserState = {
  user: null,
  trades: [],
};

export const createUserSlice: StateCreator<Store, [], [], UserSlice> = (
  set,
  get
) => ({
  ...initialUserState,
  resetUserState: () => set(initialUserState),

  setUser: (user) => set({ user }),

  setTrades: (trades: Trade[]) => set({ trades }),

  deleteTrade: (tradeId: string | string[]) => {
    const idsToDelete = Array.isArray(tradeId) ? tradeId : [tradeId];
    set((state) => ({
      trades: state.trades.filter((trade) => !idsToDelete.includes(trade.id)),
    }));
  },

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

  deleteOrder: (orderId: string | string[]) => {
    const idsToDelete = Array.isArray(orderId) ? orderId : [orderId];
    set((state) => ({
      trades: state.trades.map((trade) => ({
        ...trade,
        orders: trade.orders.filter((order) => !idsToDelete.includes(order.id)),
      })),
    }));
  },
});
