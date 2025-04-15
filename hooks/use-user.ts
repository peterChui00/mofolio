import { useStore } from '@/components/providers/app-store-provider';

export function useUser() {
  const user = useStore((state) => state.user);
  return user;
}
