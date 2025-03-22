'use client';

import { useState } from 'react';
import { tradeSides, tradeStatuses } from '@/data/trade';
import { ComputedTrade } from '@/types';
import { RowSelectionState, Table } from '@tanstack/react-table';
import { ChevronDown, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { DataTableColumnOptions } from '@/components/data-table/data-table-column-options';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { useStore } from '@/components/layout/app-store-provider';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  orderRowSelection?: RowSelectionState;
  orderRowSelectionId?: string;
}

export function TradeTableToolbar<TData extends ComputedTrade>({
  table,
  orderRowSelection = {},
  orderRowSelectionId,
}: DataTableToolbarProps<TData>) {
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const deleteTrade = useStore((state) => state.deleteTrade);
  const deleteOrder = useStore((state) => state.deleteOrder);

  const isFiltered = table.getState().columnFilters.length > 0;
  const filteredRowSelection = table.getFilteredSelectedRowModel().rows;
  const orderRowSelectionArr = Object.keys(orderRowSelection);
  const isOrderRowSelection =
    orderRowSelectionArr.length > 0 &&
    table.getRowModel().rows.find((row) => row.id === orderRowSelectionId);
  const selectionLabel = (isOrderRowSelection ? 'order' : 'trade') + '(s)';

  const handleDeleteTradeOrOrder = () =>
    isOrderRowSelection
      ? deleteOrder(orderRowSelectionArr)
      : deleteTrade(filteredRowSelection.map((row) => row.original.id));

  const toggleConfirmationDialog = () =>
    setIsConfirmationDialogOpen(!isConfirmationDialogOpen);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {(isOrderRowSelection || filteredRowSelection.length > 0) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {isOrderRowSelection
                  ? orderRowSelectionArr.length
                  : filteredRowSelection.length}{' '}
                {selectionLabel} selected
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={toggleConfirmationDialog}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Input
          placeholder="Filter trades..."
          value={(table.getColumn('symbol')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('symbol')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={tradeStatuses}
          />
        )}
        {table.getColumn('side') && (
          <DataTableFacetedFilter
            column={table.getColumn('side')}
            title="Side"
            options={tradeSides}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableColumnOptions table={table} />

      <ConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        onClose={toggleConfirmationDialog}
        onConfirm={handleDeleteTradeOrOrder}
        title={`Delete ${selectionLabel}?`}
        description={`This action cannot be undone. This will permanently delete your ${selectionLabel}.`}
        confirmVariant="destructive"
      />
    </div>
  );
}
