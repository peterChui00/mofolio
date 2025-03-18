import { ComputedTrade, Trade } from '@/types';

export const getTradeSymbol = (trade: Trade) => trade.orders[0]?.symbol || '';

export const getTradeById = (trades: Trade[], id: string) =>
  trades.find((trade) => trade.id === id);

export const getOpenTradeBySymbol = (trades: Trade[], symbol: string) =>
  trades.find(
    (trade) => getTradeSymbol(trade) === symbol && isOpenTrade(trade)
  );

export const isOpenTrade = (trade: Trade) => {
  const position = trade.orders.reduce(
    (acc, order) =>
      order.status === 'FILLED'
        ? acc + (order.type === 'BUY' ? order.quantity : -order.quantity)
        : acc,
    0
  );
  return position !== 0;
};

export const computeTradeData = (trade: Trade): ComputedTrade => {
  // Extract symbol from the first order, default to empty string if no orders exist
  const symbol = getTradeSymbol(trade);

  const filledOrders = trade.orders
    .filter((order) => order.status === 'FILLED')
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  let position = 0;
  let realizedPnl = 0;
  let fee = 0;
  let lastSide: ComputedTrade['side'] = null;
  let avgPrice: ComputedTrade['avgPrice'] = null;
  let finalSide: ComputedTrade['side'] = null;
  let finalAvgPrice: ComputedTrade['avgPrice'] = null;

  for (const order of filledOrders) {
    // Check if this order will close the position (position changes from non-zero to zero or flips)
    if (order.type === 'BUY' && position < 0 && order.quantity >= -position) {
      finalAvgPrice = avgPrice;
      finalSide = 'SHORT';
    } else if (
      order.type === 'SELL' &&
      position > 0 &&
      order.quantity >= position
    ) {
      finalAvgPrice = avgPrice;
      finalSide = 'LONG';
    }

    fee += order.fee;
    // Process BUY order
    if (order.type === 'BUY') {
      if (position < 0) {
        // Reducing a short position
        const amountToClose = Math.min(order.quantity, -position);
        realizedPnl += amountToClose * (avgPrice! - order.price); // Pnl from closing short
        position += amountToClose; // Reduce the short position

        if (order.quantity > amountToClose) {
          // Flipping from short to long
          const remainingQuantity = order.quantity - amountToClose;
          position = remainingQuantity;
          avgPrice = order.price;
          lastSide = 'LONG';
        }
      } else {
        // Adding to a long position or starting a new long position
        const newPosition = position + order.quantity;
        if (position > 0) {
          // Update average price for existing long position
          avgPrice =
            (position * avgPrice! + order.quantity * order.price) / newPosition;
        } else {
          // Starting a new long position
          avgPrice = order.price;
        }
        position = newPosition;
        if (position > 0) {
          lastSide = 'LONG';
        }
      }
    }
    // Process SELL order
    else if (order.type === 'SELL') {
      if (position > 0) {
        // Reducing a long position
        const amountToClose = Math.min(order.quantity, position);
        realizedPnl += amountToClose * (order.price - avgPrice!); // Pnl from closing long
        position -= amountToClose; // Reduce the long position

        if (order.quantity > amountToClose) {
          // Flipping from long to short
          const remainingQuantity = order.quantity - amountToClose;
          position = -remainingQuantity;
          avgPrice = order.price;
          lastSide = 'SHORT';
        }
      } else {
        // Adding to a short position or starting a new short position
        const newPosition = position - order.quantity;
        if (position < 0) {
          // Update average price for existing short position
          avgPrice =
            (-position * avgPrice! + order.quantity * order.price) /
            -newPosition;
        } else {
          // Starting a new short position
          avgPrice = order.price;
        }
        position = newPosition;
        if (position < 0) {
          lastSide = 'SHORT';
        }
      }
    }
  }

  // Determine the final status and side
  let status: ComputedTrade['status'];
  let side: ComputedTrade['side'];

  if (filledOrders.length === 0) {
    // No filled orders, trade is pending
    status = 'PENDING';
    side = null;
    position = 0;
    realizedPnl = 0;
    avgPrice = null;
  } else if (position !== 0) {
    // Position is non-zero, trade is open
    status = 'OPEN';
    side = position > 0 ? 'LONG' : 'SHORT';
  } else {
    // Position is zero, trade is closed
    status = realizedPnl > 0 ? 'WIN' : 'LOSS';
    side = finalSide;
    avgPrice = finalAvgPrice;
  }

  return {
    id: trade.id,
    note: trade.note,
    tags: trade.tags,
    orders: trade.orders,
    side,
    status,
    symbol,
    position,
    pnl: realizedPnl,
    avgPrice,
    fee,
  };
};
