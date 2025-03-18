'use client';

import { useEffect } from 'react';
import { Trade } from '@/types';

import { useStore } from '@/components/layout/app-store-provider';

export default function DemoDataProvider({ data }: { data: Trade[] }) {
  const setTrades = useStore((state) => state.setTrades);

  useEffect(() => {
    setTrades(data);
  }, [data, setTrades]);

  return <></>;
}
