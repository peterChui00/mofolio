import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { createClient } from '@/lib/supabase/server';
import { getPortfoliosQueryParams } from '@/hooks/use-portfolios';

export default async function PortfolioProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  await queryClient.prefetchQuery({
    ...getPortfoliosQueryParams(supabase),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
