'use client';

import { computeTradeData, getTradeById } from '@/lib/trade-utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/components/layout/app-store-provider';
import { OrderTable } from '@/components/trades/order-table';
import { orderTableColumns } from '@/components/trades/order-table-columns';

export default function TradeDetail({ id }: { id: string }) {
  const trade = useStore((state) => getTradeById(state.trades, id));

  if (!trade) return <div>Trade not found</div>;

  const { symbol, side, status, position, avgPrice, pnl, fee, orders } =
    computeTradeData(trade);

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-full flex w-full items-center gap-4">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {symbol}
        </h2>
        <Badge className="h-7">{side}</Badge>
        <Badge className="h-7">{status}</Badge>
      </div>

      <Card className="col-span-full md:col-span-6">
        <CardContent className="grid grid-cols-3 gap-6 sm:grid-cols-4">
          {status === 'OPEN' && (
            <article className="space-y-1">
              <p className="font-medium">Position</p>
              <p className="text-2xl font-semibold">
                {parseFloat(position.toFixed(3))}
              </p>
            </article>
          )}
          <article className="space-y-1">
            <p className="font-medium">Avg. Price</p>
            <p className="text-2xl font-semibold">
              {avgPrice ? parseFloat(avgPrice.toFixed(3)) : 0}
            </p>
          </article>
          <article className="space-y-1">
            <p className="font-medium">P&L</p>
            <p className="text-2xl font-semibold">
              {parseFloat(pnl.toFixed(3))}
            </p>
          </article>
          <article className="space-y-1">
            <p className="font-medium">Fee</p>
            <p className="text-2xl font-semibold">
              {parseFloat(fee.toFixed(3))}
            </p>
          </article>
        </CardContent>
      </Card>

      <div className="col-span-full space-y-1">
        <div className="text-2xl font-semibold tracking-tight">Orders</div>
        <div className="w-full overflow-auto rounded-lg border">
          <OrderTable tradeId={id} data={orders} columns={orderTableColumns} />
        </div>
      </div>
    </div>
  );
}
