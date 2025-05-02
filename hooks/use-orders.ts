import { TypeSupabaseClient } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { addOrder, AddOrderInput, getOrders } from '@/lib/queries/orders';
import { getQueryClient } from '@/components/providers/query-provider';

export function useOrders({
  client,
  tradeId,
}: {
  client: TypeSupabaseClient;
  tradeId?: string;
}) {
  return useQuery({
    queryKey: ['orders', tradeId],
    queryFn: () => getOrders(client, tradeId),
  });
}

export function useAddOrder({ client }: { client: TypeSupabaseClient }) {
  return useMutation({
    mutationFn: (data: AddOrderInput) => addOrder(client, data),
    onSuccess: () => {
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ['trades'],
      });

      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
