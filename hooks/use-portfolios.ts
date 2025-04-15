import { TypeSupabaseClient } from '@/types';
import { useQuery } from '@tanstack/react-query';

import { getPortfolios } from '@/lib/queries/portfolios';
import { useSupabase } from '@/hooks/use-supabase';
import { useUser } from '@/hooks/use-user';

export const getPortfoliosQueryParams = (supabase: TypeSupabaseClient) => ({
  queryKey: ['portfolios'],
  queryFn: () => getPortfolios(supabase).then((res) => res.data),
});

export function usePortfolios() {
  const supabase = useSupabase();
  const user = useUser();

  return useQuery({
    ...getPortfoliosQueryParams(supabase),
    enabled: !!user,
  });
}
