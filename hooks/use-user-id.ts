import { useStore } from '@/components/providers/app-store-provider';

export function useUserId(fallback: string = '') {
  return useStore((state) => state.user?.id || fallback);
}
