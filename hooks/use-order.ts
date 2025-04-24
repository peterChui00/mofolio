import { TypeSupabaseClient } from '@/types';
import { useMutation } from '@tanstack/react-query';

import { addOrder, AddOrderInput } from '@/lib/queries/orders';
import { getQueryClient } from '@/components/providers/query-provider';

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
