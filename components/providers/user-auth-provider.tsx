'use client';

import { useEffect, useRef } from 'react';

import { createClient } from '@/lib/supabase/client';
import { useStore } from '@/components/providers/app-store-provider';
import { getQueryClient } from '@/components/providers/query-provider';

export default function UserAuthProvider() {
  const setUser = useStore((state) => state.setUser);
  const setIsAuthLoading = useStore((state) => state.setIsAuthLoading);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (['INITIAL_SESSION', 'SIGNED_IN'].includes(event)) {
          const curUserId = session?.user?.id;
          if (curUserId && curUserId !== lastUserId.current) {
            setUser(session.user);
            lastUserId.current = curUserId;
          }
          setIsAuthLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          getQueryClient().clear();
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser, setIsAuthLoading]);

  return null;
}
