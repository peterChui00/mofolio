'use client';

import { computeTradeData } from '@/lib/trade-utils';
import { useStore } from '@/components/layout/app-store-provider';
import { TradeTable } from '@/components/trades/trade-table';
import { tradeTableColumns } from '@/components/trades/trade-table-columns';

export default function TradeTableContainer() {
  const trades = useStore((state) => state.trades);
  const computedTrades = trades.map(computeTradeData);

  return <TradeTable data={computedTrades} columns={tradeTableColumns} />;
}
