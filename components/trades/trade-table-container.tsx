'use client';

import { useMemo } from 'react';

import { computeTradeData } from '@/lib/trade-utils';
import { useStore } from '@/components/providers/app-store-provider';
import { TradeTable } from '@/components/trades/trade-table';
import {
  statusCompareFn,
  tradeTableColumns,
} from '@/components/trades/trade-table-columns';

export default function TradeTableContainer() {
  const trades = useStore((state) => state.trades);
  const computedTrades = useMemo(
    () =>
      trades
        .map(computeTradeData)
        .sort((a, b) => statusCompareFn(a.status, b.status)),
    [trades]
  );

  return <TradeTable data={computedTrades} columns={tradeTableColumns} />;
}
