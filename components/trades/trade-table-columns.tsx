'use client';

import { ComputedTrade } from '@/types';
import { ColumnDef, Row, SortingFn } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

export const statusSortingOrder = {
  OPEN: 2,
  PENDING: 1,
  WIN: 0,
  LOSS: 0,
};

export const statusCompareFn = (
  statusA: ComputedTrade['status'],
  statusB: ComputedTrade['status']
) => (statusSortingOrder[statusB] ?? 0) - (statusSortingOrder[statusA] ?? 0);

const statusSortingFn: SortingFn<ComputedTrade> = (
  rowA: Row<ComputedTrade>,
  rowB: Row<ComputedTrade>,
  columnId: string
) => {
  const statusA = rowA.getValue(columnId) as ComputedTrade['status'];
  const statusB = rowB.getValue(columnId) as ComputedTrade['status'];
  return statusCompareFn(statusA, statusB);
};

export const tradeTableColumns: ColumnDef<ComputedTrade>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'expander',
    cell: ({ row }) => {
      const isExpanded = row.getIsExpanded();
      return (
        row.getCanExpand() && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
          >
            <span className="sr-only">
              {(isExpanded ? 'Collapse' : 'Expand') + " trade's orders"}
            </span>
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
          </Button>
        )
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return <Badge>{row.original.status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: statusSortingFn,
  },
  {
    accessorKey: 'side',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Side" />
    ),
    cell: ({ row }) => {
      return row.original.side && <Badge>{row.original.side}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
  },

  {
    accessorKey: 'position',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
  },
  {
    accessorKey: 'avgPrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avg. Price" />
    ),
  },
  {
    accessorKey: 'pnl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="P&L" />
    ),
  },
  {
    accessorKey: 'fee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee" />
    ),
    cell: ({ row }) => {
      return row.original.fee.toFixed(3);
    },
  },
];
