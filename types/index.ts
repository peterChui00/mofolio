import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';

export type TypeSupabaseClient = SupabaseClient<Database>;

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

export type ComputedTrade = {
  id: string;
  note: string;
  tags: string[];
  orders: Order[];
  side: 'LONG' | 'SHORT' | null;
  status: 'PENDING' | 'OPEN' | 'WIN' | 'LOSS';
  symbol: string;
  position: number;
  pnl: number;
  fee: number;
  avgPrice: number | null;
};
