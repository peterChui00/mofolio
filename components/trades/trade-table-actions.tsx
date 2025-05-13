'use client';

import { useRouter } from 'next/navigation';
import { TradeSummary } from '@/types';
import { Row } from '@tanstack/react-table';
import { InfoIcon, MoreHorizontal, PenLineIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useSupabase } from '@/hooks/use-supabase';
import { useDeleteTrade } from '@/hooks/use-trades';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStore } from '@/components/providers/app-store-provider';

export default function TradeTableActions({ row }: { row: Row<TradeSummary> }) {
  const router = useRouter();
  const supabase = useSupabase();
  const toggleConfirmDialog = useStore((state) => state.toggleConfirmDialog);
  const toggleEditTradeDialog = useStore(
    (state) => state.toggleEditTradeDialog
  );
  const deleteTradeMutation = useDeleteTrade({ client: supabase });

  const openDetailPage = () => {
    router.push(`/trades/${row.original.id}`);
  };

  const editTrade = () => {
    toggleEditTradeDialog(true, {
      title: 'Edit trade',
      id: row.original.id,
      symbol: row.original.symbol,
      notes: row.original.notes ?? undefined,
      tags: row.original.tags,
    });
  };

  const deleteTrade = () => {
    const toastId = toast.loading('Deleting trade...');
    deleteTradeMutation.mutate(row.original.id, {
      onSuccess: () =>
        toast.success('Trade deleted successfully', { id: toastId }),
      onError: () => toast.error('Failed to delete trade', { id: toastId }),
      onSettled: () => toggleConfirmDialog(false),
    });
  };

  const handleDeleteTrade = () => {
    toggleConfirmDialog(true, {
      title: 'Delete trade',
      description:
        'Are you sure you want to delete this trade? This action cannot be undone.',
      confirmVariant: 'destructive',
      onCancel: () => toggleConfirmDialog(false),
      onConfirm: deleteTrade,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open action menu">
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={openDetailPage}>
          <InfoIcon />
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem onClick={editTrade}>
          <PenLineIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="focus:text-destructive"
          onClick={handleDeleteTrade}
        >
          <Trash2 className="focus:text-destructive" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
