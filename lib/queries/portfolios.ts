import { TypeSupabaseClient } from '@/types';

export const getPortfolios = async (client: TypeSupabaseClient) => {
  return client
    .from('portfolios')
    .select(`id, name, base_currency`)
    .throwOnError();
};
