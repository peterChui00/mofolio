'use client';

import {
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useSupabase } from '@/hooks/use-supabase';
import { useTradeTableState } from '@/hooks/use-trade-table-state';
import { useTradeSummaries } from '@/hooks/use-trades';
import TradeTable from '@/components/trades/trade-table';
import { tradeTableColumns } from '@/components/trades/trade-table-columns';

export default function TradeTableContainer() {
  const supabase = useSupabase();
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    searchParams,
  } = useTradeTableState();
  const { data: tradeSummaries, isLoading } = useTradeSummaries({
    client: supabase,
    searchParams,
  });
  const table = useReactTable({
    data: tradeSummaries?.data || [],
    columns: tradeTableColumns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    pageCount: Math.ceil(
      (tradeSummaries?.count || 0) / (pagination.pageSize || 1)
    ),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getRowId: (row) => row.id,
  });

  return <TradeTable table={table} isLoading={isLoading} />;
}
