import { TypeSupabaseClient } from '@/types';

import { EditTradeFormValues } from '@/hooks/use-edit-trade-form';

export type AddOrderInput = EditTradeFormValues & {
  portfolioId: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  fee: number;
  status: 'FILLED' | 'PENDING';
  notes?: string;
  tradeId?: string;
};

export const addOrder = async (
  client: TypeSupabaseClient,
  input: AddOrderInput
) => {
  const {
    portfolioId,
    symbol,
    action,
    quantity,
    price,
    fee,
    status,
    executedAt,
    notes,
    tradeId,
  } = input;
  const executed_at = executedAt ? executedAt.toISOString() : null;

  let targetTradeId = tradeId;

  // Check if there's an existing open Trade for the same symbol
  if (!targetTradeId) {
    const { data: existingTrade } = await client
      .from('trades')
      .select('id')
      .eq('portfolio_id', portfolioId)
      .eq('symbol', symbol)
      .is('closed_at', null)
      .limit(1)
      .maybeSingle()
      .throwOnError();

    targetTradeId = existingTrade?.id;
  }

  // Create a new Trade if there's no existing one
  if (!targetTradeId) {
    const side = action === 'BUY' ? 'LONG' : 'SHORT';
    const { data: newTrade } = await client
      .from('trades')
      .insert({
        portfolio_id: portfolioId,
        symbol,
        side,
        notes,
        opened_at: executed_at,
      })
      .select('id')
      .single()
      .throwOnError();

    targetTradeId = newTrade.id;
  }

  // Create the Order linked to the Trade
  const { data: newOrder } = await client
    .from('orders')
    .insert({
      trade_id: targetTradeId,
      action,
      quantity,
      price,
      fee,
      status,
      executed_at,
    })
    .select()
    .single()
    .throwOnError();

  return newOrder;
};
