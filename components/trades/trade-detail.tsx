'use client';

import { SquarePlus } from 'lucide-react';

import { computeTradeData, getTradeById } from '@/lib/trade-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/components/providers/app-store-provider';
import { OrderTable } from '@/components/trades/order-table';
import { orderTableColumns } from '@/components/trades/order-table-columns';

export default function TradeDetail({ id }: { id: string }) {
  const trade = useStore((state) => getTradeById(state.trades, id));
  const toggleEditTradeDialog = useStore(
    (state) => state.toggleEditTradeDialog
  );
  const setEditTradeDialogState = useStore(
    (state) => state.setEditTradeDialogState
  );

  if (!trade) return <div>Trade not found</div>;

  const { symbol, side, status, position, avgPrice, pnl, fee, orders } =
    computeTradeData(trade);
  const filledAndPendingOrders = orders.filter((order) =>
    ['FILLED', 'PENDING'].includes(order.status)
  );
  const slOrders = orders.filter((order) => order.status === 'STOP_LOSS');
  const tpOrders = orders.filter((order) => order.status === 'TAKE_PROFIT');

  const onAddSLOrTPClick = (title: string) => {
    setEditTradeDialogState({
      title,
    });
    toggleEditTradeDialog(true);
  };

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-full flex w-full items-center gap-4">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {symbol}
        </h2>
        <Badge className="h-7">{side}</Badge>
        <Badge className="h-7">{status}</Badge>
      </div>

      <Card className="col-span-full">
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

      <Card className="col-span-full md:col-span-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Stop Loss
            <Button
              variant="secondary"
              onClick={() => onAddSLOrTPClick('Add stop loss order')}
            >
              <SquarePlus />
              Add SL
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {slOrders.map((slOrder) => (
            <span key={slOrder.id} className="flex items-center gap-2">
              <Badge>{slOrder.type}</Badge>
              {slOrder.quantity}@{slOrder.price}
            </span>
          ))}
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Take Profit
            <Button
              variant="secondary"
              onClick={() => onAddSLOrTPClick('Add take profit order')}
            >
              <SquarePlus />
              Add TP
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {tpOrders.map((slOrder) => (
            <span key={slOrder.id} className="flex items-center gap-2">
              <Badge>{slOrder.type}</Badge>
              {slOrder.quantity}@{slOrder.price}
            </span>
          ))}
        </CardContent>
      </Card>

      <div className="bg-card col-span-full space-y-2 rounded-lg p-4">
        <div className="leading-none font-semibold tracking-tight">Orders</div>
        <div className="w-full overflow-auto rounded-md border">
          <OrderTable
            tradeId={id}
            data={filledAndPendingOrders}
            columns={orderTableColumns}
          />
        </div>
      </div>
    </div>
  );
}
