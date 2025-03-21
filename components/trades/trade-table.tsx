'use client';

import { Fragment, useState } from 'react';
import { ComputedTrade } from '@/types';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Updater,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { OrderTable } from '@/components/trades/order-table';
import { orderTableColumns } from '@/components/trades/order-table-columns';
import { TradeTableToolbar } from '@/components/trades/trade-table-toolbar';

interface TradeTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TradeTable<TData extends ComputedTrade, TValue>({
  columns,
  data,
}: TradeTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [orderRowSelection, setOrderRowSelection] = useState<RowSelectionState>(
    {}
  );
  const [orderRowSelectionId, setOrderRowSelectionId] = useState<
    string | undefined
  >(undefined);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const onRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    const newState =
      typeof updater === 'function' ? updater(rowSelection) : updater;
    setRowSelection(newState);
    setOrderRowSelection({});
    setOrderRowSelectionId(undefined);
  };

  const onOrderRowSelectionChange = (
    value: RowSelectionState,
    tradeId?: string
  ) => {
    setOrderRowSelection(value);
    setOrderRowSelectionId(tradeId);
    setRowSelection({});
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (originalRow) => originalRow.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="flex h-full flex-col space-y-4">
      <TradeTableToolbar
        table={table}
        orderRowSelection={orderRowSelection}
        orderRowSelectionId={orderRowSelectionId}
      />
      <div className="flex-1 overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(row.getIsExpanded() && 'border-0')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && (
                    <TableRow className="hover:bg-background">
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <OrderTable
                          tradeId={row.original.id}
                          data={row.original.orders}
                          columns={orderTableColumns}
                          rowSelectionId={orderRowSelectionId}
                          onRowSelectionChange={onOrderRowSelectionChange}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No trades.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
