import {
  OrderAction,
  OrderStatus,
  PositionSide,
  TradeSummary,
  TypeSupabaseClient,
} from '@/types';

import { ReactTableSearchParams } from '@/hooks/use-react-table-state';

const getPagination = (page: number, size: number) => {
  const pageIndex = page ? page - 1 : 0; // Convert to 0-based index
  const limit = size ? size : 10;
  const from = pageIndex ? pageIndex * limit : 0;
  const to = pageIndex ? from + size - 1 : size - 1;

  return { from, to };
};

export const getTradeSummaries = async (
  client: TypeSupabaseClient,
  searchParams: ReactTableSearchParams = { page: 1 }
) => {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'opened_at',
    sort = 'desc',
    filters = [],
  } = searchParams;
  const { from, to } = getPagination(page, pageSize);

  let query = client
    .from('trade_summary')
    .select('*', { count: 'exact' })
    .order(sortBy, { ascending: sort === 'asc' })
    .range(from, to)
    .throwOnError();

  if (filters.length > 0) {
    filters.forEach(({ id, value }) => {
      if (Array.isArray(value)) {
        return (query = query.in(id, value));
      }

      if (typeof value === 'string') {
        return (query = query.ilike(id, `%${value}%`));
      }
    });
  }

  return query.overrideTypes<TradeSummary[], { merge: false }>();
};

export type OrderInput = {
  action: OrderAction;
  quantity: number;
  price: number;
  fee: number;
  status: OrderStatus;
  executedAt?: string | null;
};

export type AddTradeInput = {
  portfolioId: string;
  symbol: string;
  side: PositionSide;
  notes?: string;
  openedAt?: string;
  closedAt?: string;
  orders: OrderInput[];
  tagIds?: string[];
};

export const addTrade = async (
  client: TypeSupabaseClient,
  trade: AddTradeInput
) => {
  const input = {
    portfolio_id: trade.portfolioId,
    symbol: trade.symbol,
    side: trade.side,
    notes: trade.notes,
    opened_at: trade.openedAt,
    closed_at: trade.closedAt,
    tag_ids: trade.tagIds,
    orders: trade.orders.map((order) => ({
      action: order.action,
      quantity: order.quantity,
      price: order.price,
      fee: order.fee,
      status: order.status,
      executed_at: order.executedAt,
    })),
  };
  return client.rpc('add_trade', { input }).throwOnError();
};

export const deleteTrade = async (
  client: TypeSupabaseClient,
  ids: string[] | string
) => {
  if (typeof ids === 'string') {
    ids = [ids];
  }
  return client.from('trades').delete().in('id', ids).throwOnError();
};
