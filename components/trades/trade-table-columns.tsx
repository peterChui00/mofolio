import { TradeSummary } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import TradeTableActions from '@/components/trades/trade-table-actions';

export const tradeTableColumns: ColumnDef<TradeSummary>[] = [
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
    accessorKey: 'average_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avg. Price" />
    ),
  },
  {
    accessorKey: 'pnl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="P&L" />
    ),
    cell: ({ row }) => {
      return typeof row.original.pnl !== 'number' ? 0 : row.original.pnl;
    },
  },
  {
    accessorKey: 'fee',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee" />
    ),
  },
  {
    accessorKey: 'opened_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Opened At" />
    ),
    cell: ({ row }) => {
      return (
        row.original.opened_at &&
        new Date(row.original.opened_at).toLocaleDateString()
      );
    },
  },
  {
    accessorKey: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <TradeTableActions row={row} />,
    enableHiding: false,
  },
];
