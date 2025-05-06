'use client';

import GeneralConfirmationDialog from '@/components/general-confirmation-dialog';
import { useStore } from '@/components/providers/app-store-provider';
import EditTagDialog from '@/components/tags/edit-tag-dialog';
import EditTagGroupDialog from '@/components/tags/edit-tag-group-dialog';
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
      <GeneralConfirmationDialog />
      <EditTradeDialog
        open={isEditTradeDialogOpen}
        onOpenChange={onEditTradeDialogOpenChange}
        title={editTradeDialogState.title}
      />
      <EditTagGroupDialog />
      <EditTagDialog />
    </>
  );
}
