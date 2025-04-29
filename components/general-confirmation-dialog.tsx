'use client';

import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { useStore } from '@/components/providers/app-store-provider';

export default function GeneralConfirmationDialog() {
  const isConfirmDialogOpen = useStore((state) => state.isConfirmDialogOpen);
  const {
    title,
    description,
    confirmText,
    cancelText,
    confirmVariant,
    onCancel,
    onConfirm,
    confirmingText,
  } = useStore((state) => state.confirmDialog);

  return (
    <ConfirmationDialog
      isOpen={isConfirmDialogOpen}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={confirmVariant}
      onClose={onCancel}
      onConfirm={onConfirm}
      confirmingText={confirmingText}
    />
  );
}
