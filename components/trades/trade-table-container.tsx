'use client';

import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useReactTableState } from '@/hooks/use-react-table-state';
import { useSupabase } from '@/hooks/use-supabase';
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
  } = useReactTableState();
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
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getRowId: (row) => row.id,
  });

  return <TradeTable table={table} isLoading={isLoading} />;
}
