import { useMemo, useState } from 'react';
import {
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

export type ReactTableSearchParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sort?: 'asc' | 'desc';
  filters?: ColumnFiltersState;
};

export function useReactTableState({
  defaultValues = {},
}: {
  defaultValues?: {
    pagination?: PaginationState;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
    searchParams?: ReactTableSearchParams;
  };
} = {}) {
  const [pagination, setPagination] = useState<PaginationState>(
    defaultValues.pagination || {
      pageIndex: 0,
      pageSize: 10,
    }
  );
  const [sorting, setSorting] = useState<SortingState>(
    defaultValues.sorting || []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    defaultValues.columnFilters || []
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultValues.columnVisibility || {}
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const searchParams: ReactTableSearchParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      ...(sorting[0]
        ? { sortBy: sorting[0].id, sort: sorting[0].desc ? 'desc' : 'asc' }
        : {}),
      filters: columnFilters,
    }),
    [pagination, sorting, columnFilters]
  );

  return {
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    expanded,
    setExpanded,
    searchParams,
  };
}
