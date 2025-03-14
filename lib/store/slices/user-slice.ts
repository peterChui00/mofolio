import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';

export type Order = {
  id: string;
  timestamp: string;
  symbol: string;
  quantity: number;
  price: number;
  fee: number;
  type: 'BUY' | 'SELL';
  status: 'FILLED' | 'PENDING' | 'STOP_LOSS' | 'TAKE_PROFIT';
  note: string;
  tags: string[];
};

export type Trade = {
  id: string;
  note: string;
  tags: string[];
  orders: Order[];
};

export const getTradeBySymbol = (trades: Trade[], symbol: string) => {
  return trades.find((trade) =>
    trade.orders.some((order) => order.symbol === symbol)
  );
};

export const getTradeById = (trades: Trade[], id: string) => {
  return trades.find((trade) => trade.id === id);
};

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
      : getTradeBySymbol(get().trades, order.symbol);
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
