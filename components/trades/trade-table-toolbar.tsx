'use client';

import { tradeSides, tradeStatuses } from '@/data/trade';
import { TradeSummary } from '@/types';
import { RowSelectionState, Table } from '@tanstack/react-table';
import { ChevronDown, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { useSupabase } from '@/hooks/use-supabase';
import { useDeleteTrade } from '@/hooks/use-trades';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { DataTableColumnOptions } from '@/components/data-table/data-table-column-options';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { useStore } from '@/components/providers/app-store-provider';

type DataTableToolbarProps = {
  table: Table<TradeSummary>;
  orderRowSelection?: RowSelectionState;
  orderRowSelectionId?: string;
};

export function TradeTableToolbar({
  table,
  orderRowSelection = {},
  orderRowSelectionId,
}: DataTableToolbarProps) {
  const supabase = useSupabase();
  const toggleConfirmDialog = useStore((state) => state.toggleConfirmDialog);
  const toggleConfirmDialogLoading = useStore(
    (state) => state.toggleConfirmDialogLoading
  );
  const deleteTradeMutation = useDeleteTrade({ client: supabase });

  const isFiltered = table.getState().columnFilters.length > 0;
  const filteredRowSelection = table.getFilteredSelectedRowModel().rows;
  const orderRowSelectionArr = Object.keys(orderRowSelection);
  const isOrderRowSelection =
    orderRowSelectionArr.length > 0 &&
    table.getRowModel().rows.find((row) => row.id === orderRowSelectionId);
  const selectionLabel =
    (isOrderRowSelection ? 'order' : 'trade') +
    (filteredRowSelection.length > 1 ? 's' : '');

  const deleteTradeOrOrder = async () => {
    toggleConfirmDialogLoading(true);
    deleteTradeMutation.mutate(
      filteredRowSelection.map((row) => row.original.id),
      {
        onError: () => toast.error('Failed to delete ' + selectionLabel),
        onSettled: () => toggleConfirmDialogLoading(false),
      }
    );
  };

  const confirmDeletion = () => {
    toggleConfirmDialog(true, {
      title: `Delete ${selectionLabel}?`,
      description: `Are you sure you want to delete ${selectionLabel}? This action cannot be undone.`,
      confirmVariant: 'destructive',
      onCancel: () => toggleConfirmDialog(false),
      onConfirm: deleteTradeOrOrder,
      confirmingText: 'Deleting...',
    });
  };

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
              <DropdownMenuItem
                onClick={confirmDeletion}
                className="focus:text-destructive"
              >
                <Trash2 className="focus:text-destructive" />
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
    </div>
  );
}
