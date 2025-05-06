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
  isEditTagGroupDialogOpen: boolean;
  editTagGroupDialog: {
    title: string;
    tagGroupId?: string;
    tagGroupName?: string;
  };
  isEditTagDialogOpen: boolean;
  editTagDialog: {
    title: string;
    tagId?: string;
    tagName?: string;
    tagGroupId?: string;
  };
};

export type DialogSliceActions = {
  resetDialogState(): void;
  toggleConfirmDialog(
    open?: boolean,
    dialogState?: DialogSliceState['confirmDialog']
  ): void;
  toggleConfirmDialogLoading(isLoading?: boolean): void;
  toggleEditTagGroupDialog(
    open?: boolean,
    dialogState?: DialogSliceState['editTagGroupDialog']
  ): void;
  toggleEditTagDialog(
    open?: boolean,
    dialogState?: DialogSliceState['editTagDialog']
  ): void;
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
  isEditTagGroupDialogOpen: false,
  editTagGroupDialog: {
    title: 'Add tag group',
    tagGroupId: undefined,
    tagGroupName: undefined,
  },
  isEditTagDialogOpen: false,
  editTagDialog: {
    title: 'Add tag',
    tagId: undefined,
    tagName: undefined,
    tagGroupId: undefined,
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

  toggleConfirmDialogLoading: (isLoading) => {
    set((state) => ({
      confirmDialog: {
        ...state.confirmDialog,
        isLoading: isLoading ?? !state.confirmDialog.isLoading,
      },
    }));
  },

  toggleEditTagGroupDialog: (open, dialogState) => {
    set((state) => ({
      isEditTagGroupDialogOpen: open ?? !state.isEditTagGroupDialogOpen,
      editTagGroupDialog: {
        ...state.editTagGroupDialog,
        ...(open && initialDialogState.editTagGroupDialog),
        ...dialogState,
      },
    }));
  },

  toggleEditTagDialog: (open, dialogState) => {
    set((state) => ({
      isEditTagDialogOpen: open ?? !state.isEditTagDialogOpen,
      editTagDialog: {
        ...state.editTagDialog,
        ...(open && initialDialogState.editTagDialog),
        ...dialogState,
      },
    }));
  },
});
