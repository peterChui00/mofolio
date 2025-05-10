import { TypeSupabaseClient } from '@/types';

export const getOrders = async (
  client: TypeSupabaseClient,
  tradeId?: string
) => {
  let query = client
    .from('orders')
    .select('*')
    .order('executed_at', { ascending: false })
    .throwOnError();

  if (tradeId) {
    query = query.eq('trade_id', tradeId);
  }

  return query;
};
