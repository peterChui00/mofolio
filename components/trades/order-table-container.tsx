'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useOrders } from '@/hooks/use-orders';
import { useSupabase } from '@/hooks/use-supabase';
import OrderTable from '@/components/trades/order-table';
import { orderTableColumns } from '@/components/trades/order-table-columns';

export default function OrderTableContainer({ tradeId }: { tradeId: string }) {
  const supabase = useSupabase();
  const { data: orders, isLoading } = useOrders({
    client: supabase,
    tradeId,
  });

  const table = useReactTable({
    data: orders?.data || [],
    columns: orderTableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
  });

  return <OrderTable table={table} isLoading={isLoading} className="px-2" />;
}
