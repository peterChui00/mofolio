import { useStore } from '@/components/providers/app-store-provider';

export function useActivePortfolioId() {
  const activePortfolioId = useStore((state) => state.activePortfolioId);
  const setActivePortfolioId = useStore((state) => state.setActivePortfolioId);
  return { activePortfolioId, setActivePortfolioId };
}
