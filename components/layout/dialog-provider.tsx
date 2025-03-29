'use client';

import { useStore } from '@/components/layout/app-store-provider';
import AddTradeDialog from '@/components/trades/add-trade-dialog';

export default function DialogProvider() {
  const isAddTradeDialogOpen = useStore((state) => state.isAddTradeDialogOpen);
  const toggleAddTradeDialog = useStore((state) => state.toggleAddTradeDialog);
  const addTradeDialogState = useStore((state) => state.addTradeDialogState);

  const onAddTradeDialogOpenChange = (open: boolean) =>
    toggleAddTradeDialog(open);

  return (
    <>
      <AddTradeDialog
        open={isAddTradeDialogOpen}
        onOpenChange={onAddTradeDialogOpenChange}
        title={addTradeDialogState.title}
        formProps={addTradeDialogState.formProps}
      />
    </>
  );
}
