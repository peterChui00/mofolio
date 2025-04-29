import { useState } from 'react';
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

export type TradeTableSearchParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sort?: 'asc' | 'desc';
  filters?: ColumnFiltersState;
};

export function useTradeTableState() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const searchParams: TradeTableSearchParams = {
    page: pagination.pageIndex + 1, // 1-based
    pageSize: pagination.pageSize,
    sortBy: sorting[0]?.id ?? 'opened_at',
    sort: sorting[0]?.desc ? 'desc' : 'asc',
    filters: columnFilters,
  };

  return {
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    searchParams,
  };
}
