import { TradeSummary, TypeSupabaseClient } from '@/types';

import { TradeTableSearchParams } from '@/hooks/use-trade-table-state';

const getPagination = (page: number, size: number) => {
  const pageIndex = page ? page - 1 : 0; // Convert to 0-based index
  const limit = size ? size : 10;
  const from = pageIndex ? pageIndex * limit : 0;
  const to = pageIndex ? from + size - 1 : size - 1;

  return { from, to };
};

export const getTradeSummaries = async (
  client: TypeSupabaseClient,
  searchParams: TradeTableSearchParams = { page: 1 }
) => {
  const {
    page = 1,
    pageSize = 10,
    sortBy = 'opened_at',
    sort = 'asc',
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

export const deleteTrade = async (
  client: TypeSupabaseClient,
  ids: string[] | string
) => {
  if (typeof ids === 'string') {
    ids = [ids];
  }
  return client.from('trades').delete().in('id', ids).throwOnError();
};
