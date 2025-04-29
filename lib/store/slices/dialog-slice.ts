import { VariantProps } from 'class-variance-authority';
import { StateCreator } from 'zustand';

import { Store } from '@/lib/store';
import { buttonVariants } from '@/components/ui/button';

export type DialogSliceState = {
  isConfirmDialogOpen: boolean;
  confirmDialog: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
    isLoading?: boolean;
    confirmingText?: string;
  };
};

export type DialogSliceActions = {
  resetDialogState(): void;
  toggleConfirmDialog(
    open?: boolean,
    dialogState?: DialogSliceState['confirmDialog']
  ): void;
  toggleConfirmDialogLoading(isLoading?: boolean): void;
};

export type DialogSlice = DialogSliceState & DialogSliceActions;

export const initialDialogState: DialogSliceState = {
  isConfirmDialogOpen: false,
  confirmDialog: {
    title: undefined,
    description: undefined,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'default',
    onConfirm: undefined,
    onCancel: undefined,
    isLoading: false,
    confirmingText: 'Loading...',
  },
};

export const createDialogSlice: StateCreator<Store, [], [], DialogSlice> = (
  set
) => ({
  ...initialDialogState,

  resetDialogState: () => set(initialDialogState),

  toggleConfirmDialog: (open, dialogState) => {
    set((state) => ({
      isConfirmDialogOpen: open ?? !state.isConfirmDialogOpen,
      confirmDialog: {
        ...state.confirmDialog,
        ...(open && initialDialogState.confirmDialog),
        ...dialogState,
      },
    }));
  },

  toggleConfirmDialogLoading: (isLoading) =>
    set((state) => ({
      confirmDialog: {
        ...state.confirmDialog,
        isLoading: isLoading ?? !state.confirmDialog.isLoading,
      },
    })),
});
