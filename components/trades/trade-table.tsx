import { Fragment } from 'react';
import { TradeSummary } from '@/types';
import { Column, flexRender, Table as ReactTable } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import OrderTableContainer from '@/components/trades/order-table-container';
import { TradeTableToolbar } from '@/components/trades/trade-table-toolbar';

const getCommonPinningClassName = (column: Column<TradeSummary>): string => {
  const isPinned = column.getIsPinned();
  return cn('bg-background', 'transition-opacity', {
    'sticky left-0 z-10 opacity-95': isPinned === 'left',
    'sticky right-0 z-10 opacity-95': isPinned === 'right',
    'relative z-0 opacity-100': !isPinned,
  });
};

export default function TradeTable({
  table,
  isLoading,
}: {
  table: ReactTable<TradeSummary>;
  isLoading?: boolean;
}) {
  return (
    <div className="flex h-full flex-col space-y-4">
      <TradeTableToolbar table={table} />
      <div className="flex-1 overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={getCommonPinningClassName(header.column)}
                    >
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
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {Array.from({ length: table.getAllColumns().length }).map(
                    (_, cellIndex) => (
                      <TableCell key={`loading-cell-${cellIndex}`}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(row.getIsExpanded() && 'border-0')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={getCommonPinningClassName(cell.column)}
                      >
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
                        <OrderTableContainer tradeId={row.original.id} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No trades.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} isLoading={isLoading} />
    </div>
  );
}
