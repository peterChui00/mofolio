'use client';

import { useEffect } from 'react';

import { useActivePortfolioId } from '@/hooks/use-active-portfolio-id';
import { usePortfolios } from '@/hooks/use-portfolios';

export default function ActivePortfolioIdProvider() {
  const { activePortfolioId, setActivePortfolioId } = useActivePortfolioId();
  const { data: portfolios } = usePortfolios();

  useEffect(() => {
    const init = () => {
      if (!portfolios || portfolios.length === 0) return;

      // If there is no valid active portfolio id, set the first portfolio's id as active
      if (
        !activePortfolioId ||
        (activePortfolioId &&
          !portfolios.find((p) => p.id === activePortfolioId))
      ) {
        setActivePortfolioId(portfolios[0].id);
      }
    };

    init();
  }, [portfolios, activePortfolioId, setActivePortfolioId]);

  return null;
}
