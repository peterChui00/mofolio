import { SupabaseClient } from '@supabase/supabase-js';

import { Database, Tables } from '@/types/supabase';

type RemoveNullExcept<T, E extends keyof T = never> = {
  [P in keyof T]: P extends E ? T[P] : Exclude<T[P], null>;
};

export type TypeSupabaseClient = SupabaseClient<Database>;

type TradeSummaryView = Tables<'trade_summary'>;

export type TradeSummary = RemoveNullExcept<
  TradeSummaryView,
  'notes' | 'opened_at' | 'closed_at'
>;

export type Order = Tables<'orders'>;

export type TagInGroup = {
  id: string;
  name: string;
};

export type TagGroupWithTags = {
  group_id: string;
  group_name: string;
  tags: TagInGroup[] | null;
};
