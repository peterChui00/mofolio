import { TypeSupabaseClient } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addTrade,
  AddTradeInput,
  deleteTrade,
  getTradeSummaries,
} from '@/lib/queries/trades';
import { ReactTableSearchParams } from '@/hooks/use-react-table-state';
import { getQueryClient } from '@/components/providers/query-provider';

export const getTradeSummaryQueryParams = (
  client: TypeSupabaseClient,
  searchParams?: ReactTableSearchParams
) => ({
  queryKey: ['trades', searchParams],
  queryFn: () => getTradeSummaries(client, searchParams),
});

export function useTradeSummaries({
  client,
  searchParams,
}: {
  client: TypeSupabaseClient;
  searchParams?: ReactTableSearchParams;
}) {
  return useQuery({
    ...getTradeSummaryQueryParams(client, searchParams),
  });
}

export function useAddTrade({ client }: { client: TypeSupabaseClient }) {
  return useMutation({
    mutationFn: async (trade: AddTradeInput) => addTrade(client, trade),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['trades'],
      });
    },
    onError: (error) => console.error(error),
  });
}

export function useDeleteTrade({ client }: { client: TypeSupabaseClient }) {
  return useMutation({
    mutationFn: (ids: string[] | string) => deleteTrade(client, ids),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['trades'],
      });
    },
    onError: (error) => console.error(error),
  });
}
