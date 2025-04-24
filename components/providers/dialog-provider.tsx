'use client';

import { useStore } from '@/components/providers/app-store-provider';
import EditTradeDialog from '@/components/trades/edit/edit-trade-dialog';

export default function DialogProvider() {
  const isEditTradeDialogOpen = useStore(
    (state) => state.isEditTradeDialogOpen
  );
  const toggleEditTradeDialog = useStore(
    (state) => state.toggleEditTradeDialog
  );
  const editTradeDialogState = useStore((state) => state.editTradeDialogState);

  const onEditTradeDialogOpenChange = (open: boolean) =>
    toggleEditTradeDialog(open);

  return (
    <>
      <EditTradeDialog
        open={isEditTradeDialogOpen}
        onOpenChange={onEditTradeDialogOpenChange}
        title={editTradeDialogState.title}
      />
    </>
  );
}
