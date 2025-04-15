import { useMemo } from 'react';

import { createClient } from '@/lib/supabase/client';

export function useSupabase() {
  const supabase = useMemo(() => createClient(), []);
  return supabase;
}
