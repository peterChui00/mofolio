import { Metadata } from 'next';

import TradeTableContainer from '@/components/trades/trade-table-container';

export const metadata: Metadata = {
  title: 'Trades',
};

export default function TradesPage() {
  return (
    <div className="flex h-full flex-1 flex-col p-4">
      <TradeTableContainer />
    </div>
  );
}
